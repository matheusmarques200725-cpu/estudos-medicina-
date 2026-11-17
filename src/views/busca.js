import MiniSearch from 'minisearch';
import { topics, questions, topicById, materiaById, topicUrl } from '../content.js';
import { esc } from '../ui.js';

let index;
const strip = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
function getIndex() {
  if (index) return index;
  index = new MiniSearch({
    fields: ['titulo', 'texto', 'tags'],
    storeFields: ['tipo', 'topico', 'secao', 'titulo', 'texto'],
    processTerm: (t) => strip(t),
    searchOptions: { boost: { titulo: 3, tags: 2 }, prefix: true, fuzzy: 0.2, combineWith: 'AND' },
  });
  const docs = [];
  for (const t of topics) {
    t.sections.forEach((s, k) => docs.push({ id: `${t.id}#${s.id || k}`, tipo: 'material', topico: t.id, secao: s.id, titulo: s.title, texto: s.text, tags: (t.tags || []).join(' ') + ' ' + t.titulo }));
  }
  for (const q of questions) {
    docs.push({ id: `q:${q.id}`, tipo: 'questao', topico: q.topico, secao: q.secao, titulo: `Questão ${q.id}`, texto: [q.enunciado, ...q.alternativas.map((a) => a.texto + ' ' + a.explicacao)].join(' '), tags: (q.tags || []).join(' ') });
  }
  index.addAll(docs);
  return index;
}

function snippet(text, terms) {
  const plain = strip(text);
  let pos = -1;
  for (const t of terms) { pos = plain.indexOf(t); if (pos >= 0) break; }
  const start = Math.max(0, pos - 80);
  let out = esc((start ? '…' : '') + text.slice(start, start + 240) + '…');
  for (const t of terms) {
    if (t.length < 2) continue;
    // destaca ignorando acentos: percorre o trecho original
    const src = out; const norm = strip(src); let res = ''; let i = 0; let p;
    while ((p = norm.indexOf(t, i)) >= 0) { res += src.slice(i, p) + '<mark>' + src.slice(p, p + t.length) + '</mark>'; i = p + t.length; }
    out = res + src.slice(i);
  }
  return out;
}

let lastQuery = '';
export function buscaView(main, params) {
  const q0 = params.get('q') ?? lastQuery;
  main.innerHTML = `
    <h1>🔍 Busca</h1>
    <input type="search" id="q" class="search-input" placeholder="Ex.: autorregulação, ânion gap, Winter…" value="${esc(q0)}" autofocus>
    <div id="results"></div>`;
  const input = main.querySelector('#q');
  const run = () => {
    lastQuery = input.value.trim();
    const box = main.querySelector('#results');
    if (lastQuery.length < 2) { box.innerHTML = '<p class="muted">Digite ao menos 2 letras.</p>'; return; }
    const res = getIndex().search(lastQuery).slice(0, 40);
    const terms = strip(lastQuery).split(/\s+/).filter(Boolean);
    box.innerHTML = res.length ? `<p class="muted small">${res.length} resultado(s)</p><ul class="results">${res.map((r) => {
      const t = topicById[r.topico];
      const href = r.tipo === 'questao' ? `#/${t.materia}/${t.id}/questoes` : topicUrl(t, r.secao);
      return `<li class="card"><a href="${href}"><span class="chip">${r.tipo === 'questao' ? '📝 Questão' : '📖 Material'}</span>
        <strong>${esc(r.titulo)}</strong> <span class="muted small">— ${esc(materiaById[t.materia]?.nome)} › ${esc(t.titulo)}</span></a>
        <p class="small">${snippet(r.texto, terms)}</p></li>`;
    }).join('')}</ul>` : '<p class="muted">Nada encontrado.</p>';
  };
  input.addEventListener('input', run);
  run();
  input.focus();
}
