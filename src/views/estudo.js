// Modo estudo: uma questão por vez, feedback imediato. Usado na página de questões do tópico e na revisão.
import { topicById, moduloPrincipal, moduloUrl, semestreNome, topicUrl, questionById } from '../content.js';
import { recordAnswer, dueIds, srsEntries, INTERVALOS } from '../store.js';
import { NIVEIS, NIVEL_LABEL } from '../lib/parse.js';
import { esc, questionCard, revealAnswer, lastResultIcon, shuffle, statsFor } from '../ui.js';

function runSession(host, qs, { mode, finishActions }) {
  let i = 0;
  const ok = {}; // qid -> boolean
  const choice = {}; // qid -> letra
  const render = () => {
    if (i >= qs.length) {
      const n = Object.values(ok).filter(Boolean).length;
      const answered = Object.keys(ok).length;
      host.innerHTML = `
        <div class="card result">
          <h2>Sessão concluída</h2>
          <p class="score">${n}/${answered} acertos${answered < qs.length ? ` <span class="small muted">(${qs.length - answered} pulada(s))</span>` : ''}</p>
          ${n < answered ? '<p class="muted">As questões erradas entraram na fila de revisão espaçada.</p>' : ''}
          <div class="actions"></div>
        </div>`;
      finishActions?.(host.querySelector('.actions'));
      return;
    }
    const q = qs[i];
    const done = q.id in ok;
    host.innerHTML = `<div class="progress-dots">${qs.map((x, k) => `<span class="${k === i ? 'cur' : ''} ${x.id in ok ? (ok[x.id] ? 'ok' : 'bad') : ''}"></span>`).join('')}</div>`;
    const card = questionCard(q, { index: i, total: qs.length });
    host.appendChild(card);
    const nav = document.createElement('div');
    nav.className = 'q-nav';
    const nextLabel = () => (q.id in ok ? (i === qs.length - 1 ? 'Finalizar' : 'Próxima →') : 'Pular →');
    nav.innerHTML = `
      <button class="btn" data-act="prev" ${i === 0 ? 'disabled' : ''}>← Anterior</button>
      <button class="btn ${done ? 'btn-primary' : ''}" data-act="next">${nextLabel()}</button>`;
    host.appendChild(nav);
    if (done) revealAnswer(card, q, choice[q.id]);
    card.querySelectorAll('.alt').forEach((b) => b.addEventListener('click', () => {
      if (q.id in ok) return;
      choice[q.id] = b.dataset.letra;
      ok[q.id] = revealAnswer(card, q, choice[q.id]);
      recordAnswer(q.id, choice[q.id], ok[q.id], mode);
      const next = nav.querySelector('[data-act=next]');
      next.textContent = nextLabel();
      next.classList.add('btn-primary');
      host.querySelectorAll('.progress-dots span')[i].classList.add(ok[q.id] ? 'ok' : 'bad');
    }));
    nav.querySelector('[data-act=prev]').onclick = () => { i--; render(); host.scrollIntoView({ block: 'start' }); };
    nav.querySelector('[data-act=next]').onclick = () => { i++; render(); host.scrollIntoView({ block: 'start' }); };
  };
  render();
}

let filtroNivel = '';
let ordemAleatoria = false;

export function questoesTopicoView(main, materiaId, topicId) {
  const t = topicById[topicId];
  if (!t || t.materia !== materiaId) { main.innerHTML = '<p>Tópico não encontrado.</p>'; return; }
  const mp = moduloPrincipal(t);
  const st = statsFor(t.questoes);
  main.innerHTML = `
    <nav class="crumbs"><a href="#/">Início</a> › ${esc(semestreNome(t.semestre))}${mp ? ` › <a href="${moduloUrl(mp)}">${esc(mp.sigla)}</a>` : ''} › <a href="${topicUrl(t)}">${esc(t.titulo)}</a> › Questões</nav>
    <h1>📝 Questões — ${esc(t.titulo)}</h1>
    <p class="muted">${st.total} questões · ${st.answered} respondidas${st.pct != null ? ` · ${st.pct}% de acerto` : ''}</p>
    <div class="card filters">
      <label>Nível: <select id="nivel"><option value="">Todos</option>${NIVEIS.map((n) => `<option value="${n}" ${n === filtroNivel ? 'selected' : ''}>${NIVEL_LABEL[n]}</option>`).join('')}</select></label>
      <label class="switch"><input type="checkbox" id="rand" ${ordemAleatoria ? 'checked' : ''}> Ordem aleatória</label>
      <button class="btn btn-primary" id="start">Começar (modo estudo)</button>
      <a class="btn" href="#/simulado?topico=${t.id}">⏱️ Fazer como simulado</a>
    </div>
    <details class="card"><summary>Lista de questões</summary>
      <ul class="q-list">${t.questoes.map((q) => `<li>${lastResultIcon(q.id)} <strong>${esc(q.id)}</strong> · ${NIVEL_LABEL[q.nivel]} — ${esc(q.enunciado.slice(0, 110))}…</li>`).join('')}</ul>
    </details>
    <div id="session"></div>`;
  const start = () => {
    filtroNivel = main.querySelector('#nivel').value;
    ordemAleatoria = main.querySelector('#rand').checked;
    let qs = t.questoes.filter((q) => !filtroNivel || q.nivel === filtroNivel);
    if (ordemAleatoria) qs = shuffle(qs);
    const host = main.querySelector('#session');
    main.querySelector('.filters').hidden = true;
    runSession(host, qs, {
      mode: 'estudo',
      finishActions: (el) => {
        el.innerHTML = `<a class="btn" href="${topicUrl(t)}">📖 Voltar ao material</a> <button class="btn btn-primary">Refazer</button>`;
        el.querySelector('button').onclick = () => questoesTopicoView(main, materiaId, topicId);
      },
    });
    host.scrollIntoView({ block: 'start' });
  };
  main.querySelector('#start').onclick = start;
}

export function revisaoView(main) {
  const due = dueIds().map((id) => questionById[id]).filter(Boolean);
  const all = Object.entries(srsEntries()).filter(([id]) => questionById[id]);
  const fmt = (t) => new Date(t).toLocaleDateString('pt-BR');
  main.innerHTML = `
    <h1>🔁 Revisão espaçada</h1>
    <p class="muted">Questões que você errou voltam em ${INTERVALOS.join(' → ')} dias. Errou de novo, volta ao início; acertou na última etapa, sai da fila.</p>
    ${due.length ? `<div class="actions"><button class="btn btn-primary" id="start">Revisar ${due.length} questão(ões) de hoje</button></div>` : '<div class="card">Nada para revisar hoje 🎉</div>'}
    <div id="session"></div>
    ${all.length ? `
      <details class="card"><summary>Fila completa (${all.length})</summary>
        <ul class="q-list">${all.sort((a, b) => a[1].due - b[1].due).map(([id, v]) => {
          const q = questionById[id]; const t = topicById[q.topico];
          return `<li><strong>${esc(id)}</strong> · ${esc(t.titulo)} — próxima: ${fmt(v.due)} · etapa ${v.box + 1}/${INTERVALOS.length} · erros: ${v.lapses}</li>`;
        }).join('')}</ul>
      </details>` : ''}`;
  main.querySelector('#start')?.addEventListener('click', (e) => {
    e.target.closest('.actions').hidden = true;
    runSession(main.querySelector('#session'), shuffle(due), { mode: 'revisao', finishActions: (el) => { el.innerHTML = '<a class="btn" href="#/">Início</a>'; } });
  });
}
