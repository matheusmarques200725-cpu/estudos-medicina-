import { renderInline } from './markdown.js';
import { topicById, topicUrl, materiaById } from './content.js';
import { NIVEL_LABEL, STATUS_LABEL } from './lib/parse.js';
import { getAnswers, allAnswers } from './store.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const inline = (s) => renderInline(String(s ?? ''));

export function h(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export const nivelChip = (n) => `<span class="chip nivel-${n}">${NIVEL_LABEL[n] || n}</span>`;
export const statusChip = (s) => (s ? `<span class="chip status-${s}">${STATUS_LABEL[s]}</span>` : '');

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Estatísticas para um conjunto de questões: tentativas, acertos, respondidas (distintas). */
export function statsFor(qs) {
  const ans = allAnswers();
  let attempts = 0, correct = 0, answered = 0, lastOk = 0;
  for (const q of qs) {
    const a = ans[q.id];
    if (!a?.length) continue;
    answered++;
    attempts += a.length;
    correct += a.filter((x) => x.ok).length;
    if (a[a.length - 1].ok) lastOk++;
  }
  return { total: qs.length, attempts, correct, answered, lastOk, pct: attempts ? Math.round((100 * correct) / attempts) : null };
}

export const pctBar = (pct) =>
  `<div class="bar" title="${pct ?? 0}%"><div style="width:${pct ?? 0}%;background:${pct == null ? 'transparent' : pct >= 70 ? 'var(--ok)' : pct >= 50 ? 'var(--warn)' : 'var(--bad)'}"></div></div>`;

/** Corpo da questão (enunciado + alternativas). Retorna elemento. */
export function questionCard(q, { index, total } = {}) {
  const t = topicById[q.topico];
  return h(`
    <article class="question" data-qid="${esc(q.id)}">
      <div class="q-meta">
        ${index != null ? `<span class="q-num">Questão ${index + 1}${total ? ` de ${total}` : ''}</span>` : ''}
        ${nivelChip(q.nivel)}
        <span class="muted small">${esc(materiaById[q.materia]?.nome)} · ${esc(t?.titulo)}</span>
      </div>
      <div class="q-stem">${inline(q.enunciado).replace(/\n/g, '<br>')}</div>
      <ol class="alts">
        ${q.alternativas.map((a) => `
          <li><button class="alt" data-letra="${a.letra}">
            <span class="alt-letra">${a.letra}</span><span class="alt-texto">${inline(a.texto)}</span>
          </button></li>`).join('')}
      </ol>
      <div class="q-feedback" hidden></div>
    </article>`);
}

/** Mostra gabarito, explicação de cada alternativa, referência e botão "estudar o tópico". */
export function revealAnswer(card, q, choice) {
  const t = topicById[q.topico];
  const ok = choice === q.gabarito;
  card.querySelectorAll('.alt').forEach((b) => {
    const l = b.dataset.letra;
    b.disabled = true;
    b.classList.toggle('correct', l === q.gabarito);
    b.classList.toggle('wrong', l === choice && !ok);
    b.classList.toggle('chosen', l === choice);
  });
  const fb = card.querySelector('.q-feedback');
  const secTitle = t?.headings.find((x) => x.id === q.secao)?.title || 'o tópico';
  fb.hidden = false;
  fb.innerHTML = `
    <div class="verdict ${choice ? (ok ? 'ok' : 'bad') : 'bad'}">
      ${choice ? (ok ? '✅ Correto!' : `❌ Incorreto — você marcou ${choice}.`) : '⏱️ Não respondida.'} Gabarito: <strong>${q.gabarito}</strong>
    </div>
    <ul class="explic">
      ${q.alternativas.map((a) => `
        <li class="${a.letra === q.gabarito ? 'is-correct' : ''}${a.letra === choice && !ok ? ' is-wrong' : ''}">
          <strong>${a.letra})</strong> ${inline(a.explicacao)}
        </li>`).join('')}
    </ul>
    <div class="q-foot">
      <span class="small muted">📚 ${esc(q.referencia)}</span>
      <a class="btn ${ok ? 'btn-ghost' : 'btn-primary'}" href="${topicUrl(t, q.secao)}">📖 Estudar o tópico: ${esc(secTitle)}</a>
    </div>`;
  return ok;
}

export function lastResultIcon(qid) {
  const a = getAnswers(qid);
  if (!a.length) return '<span class="dot"></span>';
  return a[a.length - 1].ok ? '<span class="dot ok"></span>' : '<span class="dot bad"></span>';
}
