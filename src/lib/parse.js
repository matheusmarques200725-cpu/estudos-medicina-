// Funções puras compartilhadas entre o site (navegador) e scripts/validate.js (Node).
import YAML from 'yaml';

/** Separa o frontmatter YAML do corpo Markdown. */
export function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  return { meta: YAML.parse(m[1]) || {}, body: m[2] };
}

/** Lista os títulos com âncora explícita `## Título {#id}` (níveis 2–4), ignorando blocos de código. */
export function extractHeadings(body) {
  const out = [];
  let inFence = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const h = line.match(/^(#{2,4})\s+(.+?)\s*\{#([\w-]+)\}\s*$/);
    if (h) out.push({ level: h[1].length, title: h[2].trim(), id: h[3] });
  }
  return out;
}

/** Links internos no formato `#/materia/topico` ou `#/materia/topico#secao`. */
export function extractInternalLinks(body) {
  const out = [];
  const re = /\]\(#\/([\w-]+)\/([\w-]+)(?:#([\w-]+))?\)/g;
  let m;
  while ((m = re.exec(body))) out.push({ materia: m[1], topico: m[2], secao: m[3] || null });
  return out;
}

/** Divide o corpo em seções (por título com âncora) com texto simples — usado na busca. */
export function splitSections(body) {
  const sections = [];
  let cur = { id: null, title: 'Introdução', lines: [] };
  let inFence = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const h = !inFence && line.match(/^(#{2,4})\s+(.+?)\s*\{#([\w-]+)\}\s*$/);
    if (h) {
      if (cur.lines.length) sections.push(cur);
      cur = { id: h[3], title: h[2].trim(), lines: [] };
    } else cur.lines.push(line);
  }
  if (cur.lines.length) sections.push(cur);
  return sections.map((s) => ({ id: s.id, title: s.title, text: toPlain(s.lines.join('\n')) }));
}

export function toPlain(md) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/^:::.*$/gm, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#|]/g, ' ')
    .replace(/-{3,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const NIVEIS = ['medio', 'dificil', 'aprofundado'];
export const NIVEL_LABEL = { medio: 'Médio', dificil: 'Difícil', aprofundado: 'Aprofundado' };
export const STATUS = ['estudado', 'revisar', 'dominado'];
export const STATUS_LABEL = { estudado: 'Estudado', revisar: 'Revisar', dominado: 'Dominado' };
export const SECOES_OBRIGATORIAS = [
  'objetivos', 'conceitos-base', 'explicacao', 'correlacao-clinica', 'alta-cobranca', 'armadilhas', 'resumo',
];
