import {
  topics, materias, materiaById, modulos, topicUrl, semestreNome, semestres, topicsByModulo, moduloUrl, moduloById,
} from '../content.js';
import { getStatus, dueIds } from '../store.js';
import { esc, statusChip, statsFor, pctBar } from '../ui.js';

let filtroMateria = '';

export const materiaChip = (id) => {
  const m = materiaById[id];
  return m ? `<a class="chip chip-materia" style="--c:${m.cor}" href="#/materia/${m.id}">${m.icone || ''} ${esc(m.nome)}</a>` : '';
};

/** Linha de tópico usada na home, na página do ASE e na página da disciplina. */
export function topicRow(t, { moduloAtual } = {}) {
  const st = statsFor(t.questoes);
  const secundario = moduloAtual && t.modulos?.[0] !== moduloAtual;
  return `<li>
    <a href="${topicUrl(t)}" class="topic-link">${esc(t.titulo)}</a>
    ${statusChip(getStatus(t.id))}
    <span class="topic-stats small muted">${materiaChip(t.materia)}
      ${st.answered}/${st.total} questões${st.pct != null ? ` · ${st.pct}%` : ''}
      ${secundario ? ` · também em ${esc(moduloById[t.modulos[0]]?.sigla)}` : ''}</span>
    ${pctBar(st.pct)}
  </li>`;
}

function moduloCard(m, lista) {
  const ts = lista.filter((t) => t.modulos?.includes(m.id));
  const st = statsFor(ts.flatMap((t) => t.questoes));
  if (!ts.length) {
    return `<div class="card materia-card vazio" style="--accent:${m.cor || 'var(--primary)'}">
      <a href="${moduloUrl(m)}">${m.icone || ''} ${esc(m.sigla)} · ${esc(m.nome)}</a>
      <span class="chip">${filtroMateria ? 'sem tópicos desta disciplina' : 'em breve'}</span></div>`;
  }
  return `
    <div class="card materia-card" style="--accent:${m.cor || 'var(--primary)'}">
      <h3><a href="${moduloUrl(m)}">${m.icone || ''} ${esc(m.sigla)} · ${esc(m.nome)}</a></h3>
      <p class="small muted">${m.ch ? `${m.ch} h · ` : ''}${ts.length} tópico(s)${st.pct != null ? ` · ${st.pct}% de acerto` : ''}</p>
      <ul class="topic-list">${ts.map((t) => topicRow(t, { moduloAtual: m.id })).join('')}</ul>
    </div>`;
}

export function homeView(main) {
  const due = dueIds().length;
  const lista = filtroMateria ? topics.filter((t) => t.materia === filtroMateria) : topics;
  const counts = { estudado: 0, revisar: 0, dominado: 0 };
  topics.forEach((t) => { const s = getStatus(t.id); if (s) counts[s]++; });
  const materiasComTopicos = materias.filter((m) => topics.some((t) => t.materia === m.id));
  const sems = semestres.length ? semestres.map((s) => s.numero) : [...new Set(modulos.map((m) => m.semestre))];

  main.innerHTML = `
    <section class="hero">
      <h1>Seus estudos</h1>
      <p class="muted">${topics.length} tópicos · ${topics.reduce((n, t) => n + t.questoes.length, 0)} questões ·
        ${counts.dominado} dominados · ${counts.estudado} estudados · ${counts.revisar} para revisar</p>
      <div class="actions">
        ${due ? `<a class="btn btn-primary" href="#/revisao">🔁 Revisar hoje (${due})</a>` : '<span class="chip">Nenhuma questão para revisar hoje 🎉</span>'}
        <a class="btn" href="#/simulado">⏱️ Novo simulado</a>
      </div>
      <label class="filter">Disciplina:
        <select id="materia-filter"><option value="">Todas</option>
          ${materiasComTopicos.map((m) => `<option value="${m.id}" ${m.id === filtroMateria ? 'selected' : ''}>${esc(m.nome)}</option>`).join('')}
        </select>
      </label>
    </section>
    ${sems.map((s) => `
      <section class="semestre">
        <h2>${esc(semestreNome(s))}</h2>
        ${modulos.filter((m) => m.semestre === s).map((m) => moduloCard(m, lista)).join('')}
      </section>`).join('')}
    ${topics.filter((t) => !t.modulos?.length).length ? `
      <section class="semestre"><h2>Sem módulo</h2>
        <div class="card"><ul class="topic-list">${topics.filter((t) => !t.modulos?.length).map((t) => topicRow(t)).join('')}</ul></div>
      </section>` : ''}
  `;
  main.querySelector('#materia-filter').addEventListener('change', (e) => { filtroMateria = e.target.value; homeView(main); });
}

export function moduloView(main, moduloId) {
  const m = moduloById[moduloId];
  if (!m) { main.innerHTML = '<p>Módulo não encontrado. <a href="#/">Início</a></p>'; return; }
  const ts = topicsByModulo(m.id);
  const st = statsFor(ts.flatMap((t) => t.questoes));
  main.innerHTML = `
    <nav class="crumbs"><a href="#/">Início</a> › ${esc(semestreNome(m.semestre))} › ${esc(m.sigla)}</nav>
    <h1>${m.icone || ''} ${esc(m.sigla)} · ${esc(m.nome)}</h1>
    <p class="muted">${m.ch ? `${m.ch} h · ` : ''}${ts.length} tópico(s) · ${st.answered}/${st.total} questões respondidas${st.pct != null ? ` · ${st.pct}% de acerto` : ''}</p>
    <div class="actions">
      ${st.total ? `<a class="btn btn-primary" href="#/simulado?modulo=${m.id}">⏱️ Simulado do ${esc(m.sigla)}</a>` : ''}
    </div>
    <section class="card">
      <h2>Tópicos</h2>
      ${ts.length ? `<ul class="topic-list">${ts.map((t) => topicRow(t, { moduloAtual: m.id })).join('')}</ul>` : '<p class="muted">Em breve.</p>'}
    </section>
    ${m.ementa ? `<details class="card"><summary><strong>Ementa (plano de ensino UEPA)</strong></summary><p>${esc(m.ementa)}</p></details>` : ''}
    ${m.objetivos?.length ? `<details class="card"><summary><strong>Objetivos do módulo</strong></summary><ul>${m.objetivos.map((o) => `<li>${esc(o)}</li>`).join('')}</ul></details>` : ''}
    ${m.bibliografia?.length ? `<div class="callout callout-referencias"><div class="callout-title">📚 Bibliografia básica do módulo</div><ul>${m.bibliografia.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div>` : ''}`;
}

export function materiaView(main, materiaId) {
  const m = materiaById[materiaId];
  if (!m) { main.innerHTML = '<p>Disciplina não encontrada.</p>'; return; }
  const ts = topics.filter((t) => t.materia === m.id);
  const st = statsFor(ts.flatMap((t) => t.questoes));
  main.innerHTML = `
    <nav class="crumbs"><a href="#/">Início</a> › ${esc(m.nome)}</nav>
    <h1>${m.icone || ''} ${esc(m.nome)}</h1>
    <p class="muted">${ts.length} tópicos · ${st.answered}/${st.total} questões respondidas${st.pct != null ? ` · ${st.pct}% de acerto` : ''}</p>
    ${st.total ? `<div class="actions"><a class="btn" href="#/simulado?materia=${m.id}">⏱️ Simulado de ${esc(m.nome)}</a></div>` : ''}
    ${modulos.filter((mod) => ts.some((t) => t.modulos?.[0] === mod.id)).map((mod) => `
      <section class="card"><h2><a href="${moduloUrl(mod)}">${esc(mod.sigla)} · ${esc(mod.nome)}</a></h2>
        <ul class="topic-list">${ts.filter((t) => t.modulos?.[0] === mod.id).map((t) => topicRow(t)).join('')}</ul>
      </section>`).join('')}`;
}
