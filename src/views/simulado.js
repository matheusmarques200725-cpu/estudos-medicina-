// Modo simulado: cronometrado, sem feedback até o fim; nota final + revisão com explicações.
import { topics, modulos, questions, topicById } from '../content.js';
import { recordAnswer, recordSimulado, getSimulados } from '../store.js';
import { NIVEIS, NIVEL_LABEL } from '../lib/parse.js';
import { esc, questionCard, revealAnswer, shuffle } from '../ui.js';

let timerId = null;
export const stopSimulado = () => { clearInterval(timerId); timerId = null; window.onbeforeunload = null; };
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export function simuladoView(main, params) {
  stopSimulado();
  const preTopico = params.get('topico');
  const preMateria = params.get('materia');
  const preModulo = params.get('modulo');
  const checkedTopic = (t) => (preTopico ? t.id === preTopico
    : preMateria ? t.materia === preMateria
      : preModulo ? (t.modulos || []).includes(preModulo) : true);
  // Agrupa por módulo principal (ASE); tópicos sem módulo ficam em "Outros".
  const grupos = [
    ...modulos.map((m) => ({ nome: `${m.sigla} · ${m.nome}`, ts: topics.filter((t) => t.modulos?.[0] === m.id) })),
    { nome: 'Outros', ts: topics.filter((t) => !t.modulos?.length) },
  ].filter((g) => g.ts.length);
  const hist = getSimulados();
  main.innerHTML = `
    <h1>⏱️ Simulado</h1>
    <form class="card sim-form" id="cfg">
      <fieldset><legend>Tópicos</legend>
        ${grupos.map((g) => `
          <div class="sim-materia"><strong>${esc(g.nome)}</strong>
            ${g.ts.map((t) => `
              <label class="check"><input type="checkbox" name="topico" value="${t.id}" ${checkedTopic(t) ? 'checked' : ''}> ${esc(t.titulo)} <span class="muted small">(${t.questoes.length})</span></label>`).join('')}
          </div>`).join('')}
      </fieldset>
      <fieldset><legend>Níveis</legend>
        ${NIVEIS.map((n) => `<label class="check"><input type="checkbox" name="nivel" value="${n}" checked> ${NIVEL_LABEL[n]}</label>`).join('')}
      </fieldset>
      <div class="row">
        <label>Nº de questões <input type="number" name="n" min="1" max="200" value="10"></label>
        <label>Minutos por questão <input type="number" name="min" min="0.5" max="10" step="0.5" value="3"></label>
      </div>
      <p class="small muted" id="avail"></p>
      <button class="btn btn-primary" type="submit">Iniciar simulado</button>
    </form>
    ${hist.length ? `
      <section class="card"><h2>Histórico</h2>
        <table class="simple"><thead><tr><th>Data</th><th>Nota</th><th>Tempo</th></tr></thead><tbody>
        ${hist.slice(0, 10).map((s) => `<tr><td>${new Date(s.date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</td><td>${s.correct}/${s.total} (${Math.round((100 * s.correct) / s.total)}%)</td><td>${fmt(s.durationSec)}</td></tr>`).join('')}
        </tbody></table>
      </section>` : ''}`;

  const form = main.querySelector('#cfg');
  const pool = () => {
    const fd = new FormData(form);
    const ts = new Set(fd.getAll('topico'));
    const ns = new Set(fd.getAll('nivel'));
    return questions.filter((q) => ts.has(q.topico) && ns.has(q.nivel));
  };
  const upd = () => { main.querySelector('#avail').textContent = `${pool().length} questões disponíveis com esses filtros.`; };
  form.addEventListener('change', upd);
  upd();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const qs = shuffle(pool()).slice(0, Math.max(1, +fd.get('n') || 10));
    if (!qs.length) { alert('Nenhuma questão com esses filtros.'); return; }
    runSimulado(main, qs, Math.round((+fd.get('min') || 3) * 60 * qs.length));
  });
}

function runSimulado(main, qs, totalSec) {
  const answers = {};
  const startedAt = Date.now();
  let i = 0;
  let remaining = totalSec;
  window.onbeforeunload = () => true;
  main.innerHTML = `
    <div class="sim-bar">
      <span id="clock" class="clock">${fmt(remaining)}</span>
      <span id="answered" class="muted small"></span>
      <button class="btn btn-primary" id="finish">Entregar</button>
    </div>
    <div class="sim-grid" id="grid"></div>
    <div id="qhost"></div>`;
  const grid = main.querySelector('#grid');
  const qhost = main.querySelector('#qhost');
  const renderGrid = () => {
    grid.innerHTML = qs.map((q, k) => `<button class="g ${answers[q.id] ? 'done' : ''} ${k === i ? 'cur' : ''}" data-k="${k}">${k + 1}</button>`).join('');
    grid.querySelectorAll('button').forEach((b) => (b.onclick = () => { i = +b.dataset.k; renderQ(); }));
    main.querySelector('#answered').textContent = `${Object.keys(answers).length}/${qs.length} respondidas`;
  };
  const renderQ = () => {
    const q = qs[i];
    qhost.innerHTML = '';
    const card = questionCard(q, { index: i, total: qs.length });
    card.querySelectorAll('.alt').forEach((b) => {
      b.classList.toggle('chosen', answers[q.id] === b.dataset.letra);
      b.onclick = () => { answers[q.id] = b.dataset.letra; renderQ(); };
    });
    qhost.appendChild(card);
    const nav = document.createElement('div');
    nav.className = 'q-nav';
    nav.innerHTML = `<button class="btn" ${i === 0 ? 'disabled' : ''}>← Anterior</button><button class="btn">${i === qs.length - 1 ? 'Revisar grade' : 'Próxima →'}</button>`;
    const [prev, next] = nav.querySelectorAll('button');
    prev.onclick = () => { i--; renderQ(); };
    next.onclick = () => { if (i < qs.length - 1) { i++; renderQ(); } else main.querySelector('.sim-bar').scrollIntoView(); };
    qhost.appendChild(nav);
    renderGrid();
  };
  renderQ();
  const clock = main.querySelector('#clock');
  timerId = setInterval(() => {
    remaining--;
    clock.textContent = fmt(Math.max(0, remaining));
    clock.classList.toggle('low', remaining <= 60);
    if (remaining <= 0) finish(true);
  }, 1000);
  const finish = (timeout = false) => {
    if (!timeout && Object.keys(answers).length < qs.length && !confirm(`Ainda há ${qs.length - Object.keys(answers).length} questão(ões) sem resposta. Entregar mesmo assim?`)) return;
    stopSimulado();
    let correct = 0;
    for (const q of qs) {
      const ok = answers[q.id] === q.gabarito;
      if (ok) correct++;
      recordAnswer(q.id, answers[q.id] || null, ok, 'simulado');
    }
    const durationSec = Math.round((Date.now() - startedAt) / 1000);
    recordSimulado({ date: Date.now(), total: qs.length, correct, durationSec, ids: qs.map((q) => q.id) });
    showResult(main, qs, answers, correct, durationSec, timeout);
  };
  main.querySelector('#finish').onclick = () => finish(false);
}

function showResult(main, qs, answers, correct, durationSec, timeout) {
  const pct = Math.round((100 * correct) / qs.length);
  const byTopic = {};
  for (const q of qs) {
    const b = (byTopic[q.topico] ||= { ok: 0, n: 0 });
    b.n++; if (answers[q.id] === q.gabarito) b.ok++;
  }
  main.innerHTML = `
    <div class="card result">
      <h1>Resultado ${timeout ? '<span class="chip">tempo esgotado</span>' : ''}</h1>
      <p class="score ${pct >= 70 ? 'ok' : pct >= 50 ? 'warn' : 'bad'}">${correct}/${qs.length} · ${pct}%</p>
      <p class="muted">Tempo: ${fmt(durationSec)} · Erradas/não respondidas foram para a fila de revisão.</p>
      <ul>${Object.entries(byTopic).map(([id, b]) => `<li>${esc(topicById[id].titulo)}: ${b.ok}/${b.n}</li>`).join('')}</ul>
      <div class="actions"><a class="btn btn-primary" href="#/simulado">Novo simulado</a> <a class="btn" href="#/desempenho">Desempenho</a></div>
    </div>
    <label class="switch"><input type="checkbox" id="onlywrong"> Mostrar só as erradas</label>
    <div id="review"></div>`;
  const review = main.querySelector('#review');
  qs.forEach((q, k) => {
    const card = questionCard(q, { index: k, total: qs.length });
    const ok = revealAnswer(card, q, answers[q.id] || null);
    card.dataset.ok = ok ? '1' : '0';
    review.appendChild(card);
  });
  main.querySelector('#onlywrong').onchange = (e) =>
    review.querySelectorAll('.question').forEach((c) => { c.hidden = e.target.checked && c.dataset.ok === '1'; });
  window.scrollTo(0, 0);
}
