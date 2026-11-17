import { topicById, materiaById, topicUrl, semestreNome } from '../content.js';
import { renderMarkdown, renderMermaid } from '../markdown.js';
import { getStatus, setStatus, getNote, setNote } from '../store.js';
import { STATUS, STATUS_LABEL } from '../lib/parse.js';
import { esc, statsFor } from '../ui.js';

const QUICK = new Set(['alta-cobranca', 'resumo']);
let quickMode = false;
try { quickMode = localStorage.getItem('estudos-med:quick') === '1'; } catch {}

/** Agrupa o HTML renderizado em <section data-sec> por título h2, para o modo revisão rápida. */
function sectionize(article) {
  const nodes = [...article.childNodes];
  article.innerHTML = '';
  let sec = document.createElement('section');
  sec.dataset.sec = '_intro';
  for (const n of nodes) {
    if (n.nodeType === 1 && n.tagName === 'H2') {
      if (sec.childNodes.length) article.appendChild(sec);
      sec = document.createElement('section');
      sec.dataset.sec = n.id || '';
    }
    sec.appendChild(n);
  }
  if (sec.childNodes.length) article.appendChild(sec);
}

export function topicoView(main, materiaId, topicId, secao) {
  const t = topicById[topicId];
  if (!t || t.materia !== materiaId) { main.innerHTML = '<p>Tópico não encontrado. <a href="#/">Voltar</a></p>'; return; }
  const m = materiaById[t.materia];
  const st = statsFor(t.questoes);
  const relacionados = (t.relacionados || []).map((id) => topicById[id]).filter(Boolean);
  const pendentes = (t.relacionados || []).filter((id) => !topicById[id]);
  const status = getStatus(t.id);

  main.innerHTML = `
    <nav class="crumbs"><a href="#/">Início</a> › <a href="#/materia/${m.id}">${esc(m.nome)}</a> › ${esc(t.titulo)}</nav>
    <div class="topic-layout">
      <aside class="toc">
        <details open><summary>Sumário</summary>
          <ol>${t.headings.filter((x) => x.level <= 3).map((x) => `<li class="lvl${x.level}"><a href="${topicUrl(t, x.id)}">${esc(x.title)}</a></li>`).join('')}</ol>
        </details>
      </aside>
      <div class="topic-main">
        <header class="topic-head">
          <h1>${esc(t.titulo)}</h1>
          <p class="muted small">${esc(m.nome)} · ${esc(semestreNome(t.semestre))}${t.modulo_uepa ? ' · Módulo: ' + esc(t.modulo_uepa) : ''}${t.atualizado ? ' · atualizado em ' + esc(t.atualizado) : ''}</p>
          <div class="topic-toolbar">
            <div class="seg" role="group" aria-label="Status do tópico">
              ${STATUS.map((s) => `<button class="seg-btn status-${s} ${status === s ? 'active' : ''}" data-status="${s}">${STATUS_LABEL[s]}</button>`).join('')}
            </div>
            <label class="switch"><input type="checkbox" id="quick" ${quickMode ? 'checked' : ''}> Revisão rápida</label>
            <a class="btn btn-primary" href="#/${t.materia}/${t.id}/questoes">📝 Questões (${t.questoes.length})${st.pct != null ? ` · ${st.pct}%` : ''}</a>
          </div>
        </header>
        <article class="prose" id="topic-article"></article>
        ${relacionados.length || pendentes.length ? `
          <section class="card related">
            <h2>🔗 Tópicos relacionados</h2>
            <ul>${relacionados.map((r) => `<li><a href="${topicUrl(r)}">${esc(r.titulo)}</a> <span class="muted small">(${esc(materiaById[r.materia]?.nome)})</span></li>`).join('')}
            ${pendentes.map((p) => `<li class="muted">${esc(p)} <span class="small">(em breve)</span></li>`).join('')}</ul>
          </section>` : ''}
        <section class="card notes">
          <h2>✍️ Minhas anotações</h2>
          <textarea id="notes" rows="6" placeholder="Suas anotações sobre este tópico (salvas automaticamente neste aparelho)…">${esc(getNote(t.id))}</textarea>
          <p class="small muted" id="notes-status"></p>
        </section>
      </div>
    </div>`;

  const article = main.querySelector('#topic-article');
  article.innerHTML = renderMarkdown(t.body);
  sectionize(article);
  const applyQuick = () => {
    article.classList.toggle('quick', quickMode);
    article.querySelectorAll('section[data-sec]').forEach((s) => { s.classList.toggle('sec-off', quickMode && !QUICK.has(s.dataset.sec)); });
    renderMermaid(article);
  };
  applyQuick();

  main.querySelector('#quick').addEventListener('change', (e) => {
    quickMode = e.target.checked;
    try { localStorage.setItem('estudos-med:quick', quickMode ? '1' : '0'); } catch {}
    applyQuick();
  });
  main.querySelectorAll('[data-status]').forEach((b) => b.addEventListener('click', () => {
    const s = b.dataset.status === getStatus(t.id) ? null : b.dataset.status;
    setStatus(t.id, s);
    main.querySelectorAll('[data-status]').forEach((x) => x.classList.toggle('active', x.dataset.status === s));
  }));
  let timer;
  const notes = main.querySelector('#notes');
  notes.addEventListener('input', () => {
    clearTimeout(timer);
    main.querySelector('#notes-status').textContent = 'Salvando…';
    timer = setTimeout(() => { setNote(t.id, notes.value); main.querySelector('#notes-status').textContent = 'Salvo ✓'; }, 400);
  });

  if (secao) {
    // Ao chegar por link de seção (ex.: botão "estudar o tópico"), sai do modo rápido se a seção estiver oculta.
    const target = document.getElementById(secao);
    if (target) {
      if (target.closest('section.sec-off')) { quickMode = false; main.querySelector('#quick').checked = false; applyQuick(); }
      requestAnimationFrame(() => {
        target.scrollIntoView({ block: 'start' });
        target.classList.add('flash');
        setTimeout(() => target.classList.remove('flash'), 2000);
      });
    }
  } else window.scrollTo(0, 0);
}
