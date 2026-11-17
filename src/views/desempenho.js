import { topics, materias, modulos, questions, topicUrl, topicsByModulo, moduloUrl } from '../content.js';
import { srsEntries, getSimulados, dueIds } from '../store.js';
import { NIVEIS, NIVEL_LABEL } from '../lib/parse.js';
import { esc, statsFor, pctBar, statusChip } from '../ui.js';
import { getStatus } from '../store.js';

export function desempenhoView(main) {
  const geral = statsFor(questions);
  const row = (label, st, extra = '') => `
    <tr><td>${label}</td><td>${st.answered}/${st.total}</td><td>${st.attempts}</td>
    <td>${st.pct != null ? st.pct + '%' : '—'}</td><td class="bar-cell">${pctBar(st.pct)}</td><td>${extra}</td></tr>`;
  const head = '<thead><tr><th></th><th>Respondidas</th><th>Tentativas</th><th>Acerto</th><th></th><th></th></tr></thead>';
  main.innerHTML = `
    <h1>📊 Desempenho</h1>
    <div class="stat-row">
      <div class="stat"><span class="stat-n">${geral.pct ?? '—'}${geral.pct != null ? '%' : ''}</span><span class="stat-l">acerto geral</span></div>
      <div class="stat"><span class="stat-n">${geral.answered}/${geral.total}</span><span class="stat-l">questões respondidas</span></div>
      <div class="stat"><span class="stat-n">${Object.keys(srsEntries()).length}</span><span class="stat-l">na fila de revisão (${dueIds().length} hoje)</span></div>
      <div class="stat"><span class="stat-n">${getSimulados().length}</span><span class="stat-l">simulados feitos</span></div>
    </div>
    ${modulos.filter((m) => topicsByModulo(m.id).length).map((m) => {
      const ts = topicsByModulo(m.id);
      return `<section class="card"><h2><a href="${moduloUrl(m)}">${m.icone || ''} ${esc(m.sigla)} · ${esc(m.nome)}</a></h2>
        <div class="table-wrap"><table class="simple">${head}<tbody>
        ${row('<strong>Total do módulo</strong>', statsFor(ts.flatMap((t) => t.questoes)))}
        ${ts.map((t) => row(`<a href="${topicUrl(t)}">${esc(t.titulo)}</a>`, statsFor(t.questoes), statusChip(getStatus(t.id)))).join('')}
        </tbody></table></div></section>`;
    }).join('')}
    <section class="card"><h2>Por disciplina</h2>
      <div class="table-wrap"><table class="simple">${head}<tbody>
      ${materias.filter((m) => topics.some((t) => t.materia === m.id)).map((m) =>
        row(`<a href="#/materia/${m.id}">${m.icone || ''} ${esc(m.nome)}</a>`, statsFor(topics.filter((t) => t.materia === m.id).flatMap((t) => t.questoes)))).join('')}
      </tbody></table></div>
    </section>
    <section class="card"><h2>Por nível</h2>
      <div class="table-wrap"><table class="simple">${head}<tbody>
      ${NIVEIS.map((n) => row(NIVEL_LABEL[n], statsFor(questions.filter((q) => q.nivel === n)))).join('')}
      </tbody></table></div>
    </section>`;
}
