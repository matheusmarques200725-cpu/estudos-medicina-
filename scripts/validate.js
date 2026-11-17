// Valida todo o conteúdo em content/: frontmatter, seções obrigatórias, links internos e questões.
// Uso: npm run validate  (roda também antes de npm run build)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseFrontmatter, extractHeadings, extractInternalLinks, NIVEIS, SECOES_OBRIGATORIAS,
} from '../src/lib/parse.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(root, 'content');
const errors = [];
const warnings = [];
const err = (f, msg) => errors.push(`${path.relative(root, f)}: ${msg}`);
const warn = (f, msg) => warnings.push(`${path.relative(root, f)}: ${msg}`);

const materiasFile = path.join(contentDir, 'materias.json');
const catalog = JSON.parse(fs.readFileSync(materiasFile, 'utf8'));
const materiaIds = new Set(catalog.materias.map((m) => m.id));

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]);
}
const files = walk(contentDir);
const mdFiles = files.filter((f) => f.endsWith('.md'));
const qFiles = files.filter((f) => f.endsWith('.questoes.json'));

const topics = new Map(); // id -> { file, meta, anchors:Set }
for (const f of mdFiles) {
  const { meta, body } = parseFrontmatter(fs.readFileSync(f, 'utf8'));
  const base = path.basename(f, '.md');
  for (const k of ['id', 'titulo', 'materia', 'semestre']) if (meta[k] == null) err(f, `frontmatter sem "${k}"`);
  if (meta.id && meta.id !== base) err(f, `id "${meta.id}" diferente do nome do arquivo "${base}"`);
  if (meta.materia && !materiaIds.has(meta.materia)) err(f, `matéria "${meta.materia}" não existe em materias.json`);
  if (meta.materia && path.basename(path.dirname(f)) !== meta.materia) err(f, `arquivo deve ficar em content/${meta.materia}/`);
  if (topics.has(meta.id)) err(f, `id de tópico duplicado: ${meta.id}`);
  const heads = extractHeadings(body);
  const anchors = new Set();
  for (const h of heads) {
    if (anchors.has(h.id)) err(f, `âncora duplicada: #${h.id}`);
    anchors.add(h.id);
  }
  for (const s of SECOES_OBRIGATORIAS) if (!anchors.has(s)) err(f, `seção obrigatória ausente: {#${s}}`);
  if (!/:::\s*referencias/.test(body)) warn(f, 'nenhum bloco ::: referencias encontrado');
  topics.set(meta.id, { file: f, meta, body, anchors });
}

for (const [id, t] of topics) {
  for (const r of t.meta.relacionados || []) {
    if (!topics.has(r)) warn(t.file, `relacionado "${r}" ainda não existe (ok se for tópico futuro)`);
  }
  for (const l of extractInternalLinks(t.body)) {
    const target = topics.get(l.topico);
    if (!target) { warn(t.file, `link para tópico inexistente: ${l.materia}/${l.topico}`); continue; }
    if (target.meta.materia !== l.materia) err(t.file, `link ${l.materia}/${l.topico}: matéria correta é "${target.meta.materia}"`);
    if (l.secao && !target.anchors.has(l.secao)) err(t.file, `link para âncora inexistente: ${l.topico}#${l.secao}`);
  }
}

const qIds = new Set();
let totalQ = 0;
for (const f of qFiles) {
  let data;
  try { data = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { err(f, `JSON inválido: ${e.message}`); continue; }
  const base = path.basename(f, '.questoes.json');
  if (data.topico !== base) err(f, `"topico" deve ser "${base}"`);
  const t = topics.get(data.topico);
  if (!t) { err(f, `tópico "${data.topico}" não tem arquivo .md`); continue; }
  if (!Array.isArray(data.questoes)) { err(f, '"questoes" deve ser uma lista'); continue; }
  for (const q of data.questoes) {
    const where = `questão ${q.id || '(sem id)'}`;
    totalQ++;
    if (!q.id) err(f, `${where}: sem id`);
    if (qIds.has(q.id)) err(f, `${where}: id duplicado`);
    qIds.add(q.id);
    if (!NIVEIS.includes(q.nivel)) err(f, `${where}: nivel deve ser ${NIVEIS.join('|')}`);
    if (!q.enunciado || q.enunciado.length < 20) err(f, `${where}: enunciado ausente/curto`);
    const alts = q.alternativas || [];
    if (alts.length !== 5) err(f, `${where}: deve ter 5 alternativas (tem ${alts.length})`);
    const letras = alts.map((a) => a.letra).join('');
    if (letras !== 'ABCDE'.slice(0, alts.length)) err(f, `${where}: letras devem ser A–E em ordem`);
    for (const a of alts) {
      if (!a.texto) err(f, `${where}: alternativa ${a.letra} sem texto`);
      if (!a.explicacao) err(f, `${where}: alternativa ${a.letra} sem explicação`);
    }
    if (!alts.some((a) => a.letra === q.gabarito)) err(f, `${where}: gabarito "${q.gabarito}" não corresponde a nenhuma alternativa`);
    if (!q.secao) err(f, `${where}: sem "secao"`);
    else if (!t.anchors.has(q.secao)) err(f, `${where}: secao "#${q.secao}" não existe no tópico`);
    if (!q.referencia) err(f, `${where}: sem referência`);
  }
}

for (const w of warnings) console.warn('⚠️  ' + w);
for (const e of errors) console.error('❌ ' + e);
console.log(`\n${topics.size} tópico(s), ${totalQ} questão(ões), ${errors.length} erro(s), ${warnings.length} aviso(s).`);
if (errors.length) process.exit(1);
