import { topics, materias, materiaById, topicUrl, semestreNome, modulosUepa } from '../content.js';
import { getStatus, dueIds } from '../store.js';
import { esc, statusChip, statsFor, pctBar } from '../ui.js';

let filtroModulo = '';

export function homeView(main) {
  const due = dueIds().length;
  const mods = modulosUepa();
  const lista = filtroModulo ? topics.filter((t) => t.modulo_uepa === filtroModulo) : topics;
  const semestresPresentes = [...new Set(lista.map((t) => t.semestre))].sort((a, b) => a - b);
  const counts = { estudado: 0, revisar: 0, dominado: 0 };
  topics.forEach((t) => { const s = getStatus(t.id); if (s) counts[s]++; });

  main.innerHTML = `
    <section class="hero">
      <h1>Seus estudos</h1>
      <p class="muted">${topics.length} tópicos · ${topics.reduce((n, t) => n + t.questoes.length, 0)} questões ·
        ${counts.dominado} dominados · ${counts.estudado} estudados · ${counts.revisar} para revisar</p>
      <div class="actions">
        ${due ? `<a class="btn btn-primary" href="#/revisao">🔁 Revisar hoje (${due})</a>` : '<span class="chip">Nenhuma questão para revisar hoje 🎉</span>'}
        <a class="btn" href="#/simulado">⏱️ Novo simulado</a>
      </div>
      ${mods.length ? `
        <label class="filter">Módulo UEPA:
          <select id="mod-filter"><option value="">Todos</option>
            ${mods.map((m) => `<option ${m === filtroModulo ? 'selected' : ''}>${esc(m)}</option>`).join('')}
          </select>
        </label>` : ''}
    </section>
    ${semestresPresentes.map((s) => `
      <section class="semestre">
        <h2>${esc(semestreNome(s))}</h2>
        ${materias.filter((m) => lista.some((t) => t.semestre === s && t.materia === m.id)).map((m) => {
          const ts = lista.filter((t) => t.semestre === s && t.materia === m.id);
          return `
          <div class="card materia-card" style="--accent:${m.cor || 'var(--primary)'}">
            <h3><a href="#/materia/${m.id}">${m.icone || ''} ${esc(m.nome)}</a></h3>
            <ul class="topic-list">
              ${ts.map((t) => {
                const st = statsFor(t.questoes);
                return `<li>
                  <a href="${topicUrl(t)}" class="topic-link">${esc(t.titulo)}</a>
                  ${statusChip(getStatus(t.id))}
                  <span class="topic-stats small muted">${st.answered}/${st.total} questões${st.pct != null ? ` · ${st.pct}%` : ''}</span>
                  ${pctBar(st.pct)}
                </li>`;
              }).join('')}
            </ul>
          </div>`;
        }).join('')}
      </section>`).join('')}
    ${!topics.length ? '<p>Nenhum tópico ainda. Adicione arquivos em <code>content/</code>.</p>' : ''}
  `;
  main.querySelector('#mod-filter')?.addEventListener('change', (e) => { filtroModulo = e.target.value; homeView(main); });
}

export function materiaView(main, materiaId) {
  const m = materiaById[materiaId];
  if (!m) { main.innerHTML = '<p>Matéria não encontrada.</p>'; return; }
  const ts = topics.filter((t) => t.materia === m.id);
  const st = statsFor(ts.flatMap((t) => t.questoes));
  main.innerHTML = `
    <nav class="crumbs"><a href="#/">Início</a> › ${esc(m.nome)}</nav>
    <h1>${m.icone || ''} ${esc(m.nome)}</h1>
    <p class="muted">${ts.length} tópicos · ${st.answered}/${st.total} questões respondidas${st.pct != null ? ` · ${st.pct}% de acerto` : ''}</p>
    ${m.referencias?.length ? `<div class="callout callout-referencias"><div class="callout-title">📚 Referências-base</div><ul>${m.referencias.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div>` : ''}
    <div class="actions"><a class="btn" href="#/simulado?materia=${m.id}">⏱️ Simulado de ${esc(m.nome)}</a></div>
    <ul class="topic-list card">
      ${ts.map((t) => `<li>
        <a href="${topicUrl(t)}" class="topic-link">${esc(t.titulo)}</a> ${statusChip(getStatus(t.id))}
        <span class="small muted">${esc(semestreNome(t.semestre))}${t.modulo_uepa ? ' · ' + esc(t.modulo_uepa) : ''}</span>
      </li>`).join('')}
    </ul>`;
}
