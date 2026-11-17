// Carrega todo o conteúdo de content/ em tempo de build (Vite import.meta.glob).
import catalog from '../content/materias.json';
import { parseFrontmatter, extractHeadings, splitSections } from './lib/parse.js';

const mdFiles = import.meta.glob('../content/**/*.md', { query: '?raw', import: 'default', eager: true });
const qFiles = import.meta.glob('../content/**/*.questoes.json', { import: 'default', eager: true });

export const materias = catalog.materias;
export const semestres = catalog.semestres || [];
export const materiaById = Object.fromEntries(materias.map((m) => [m.id, m]));

export const topics = Object.values(mdFiles)
  .map((raw) => {
    const { meta, body } = parseFrontmatter(raw);
    return { ...meta, body, headings: extractHeadings(body), sections: splitSections(body), questoes: [] };
  })
  .sort((a, b) => (a.semestre - b.semestre) || ((a.ordem ?? 99) - (b.ordem ?? 99)) || a.titulo.localeCompare(b.titulo));

export const topicById = Object.fromEntries(topics.map((t) => [t.id, t]));

export const questions = [];
for (const data of Object.values(qFiles)) {
  const t = topicById[data.topico];
  if (!t) continue;
  for (const q of data.questoes) {
    const full = { ...q, topico: t.id, materia: t.materia };
    t.questoes.push(full);
    questions.push(full);
  }
}
export const questionById = Object.fromEntries(questions.map((q) => [q.id, q]));

export const topicUrl = (t, secao) => `#/${t.materia}/${t.id}${secao ? '#' + secao : ''}`;
export const semestreNome = (n) => semestres.find((s) => s.numero === n)?.nome || `${n}º semestre`;
export const modulosUepa = () => [...new Set(topics.map((t) => t.modulo_uepa).filter(Boolean))].sort();
