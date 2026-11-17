// Estado local (localStorage). Tudo fica no aparelho; nada é enviado para fora.
const KEY = 'estudos-med:v1';
const empty = () => ({ status: {}, notes: {}, answers: {}, srs: {}, simulados: [] });

let state;
try { state = { ...empty(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { state = empty(); }

const listeners = new Set();
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn('Falha ao salvar', e); }
  listeners.forEach((fn) => fn());
}
export const onChange = (fn) => listeners.add(fn);

export const getStatus = (topicId) => state.status[topicId] || null;
export function setStatus(topicId, s) {
  if (s) state.status[topicId] = s; else delete state.status[topicId];
  save();
}

export const getNote = (topicId) => state.notes[topicId] || '';
export function setNote(topicId, text) {
  if (text) state.notes[topicId] = text; else delete state.notes[topicId];
  save();
}

/** Registra uma resposta. mode: estudo | simulado | revisao */
export function recordAnswer(qid, choice, ok, mode) {
  (state.answers[qid] ||= []).push({ t: Date.now(), choice, ok, mode });
  updateSrs(qid, ok);
  save();
}
export const getAnswers = (qid) => state.answers[qid] || [];
export const allAnswers = () => state.answers;

export function recordSimulado(sim) {
  state.simulados.unshift(sim);
  state.simulados = state.simulados.slice(0, 50);
  save();
}
export const getSimulados = () => state.simulados;

// ---------- Revisão espaçada ----------
// Errou → entra na fila (caixa 0, volta amanhã). Acertou na fila → sobe de caixa.
// Intervalos (dias) por caixa; ao acertar na última caixa, a questão sai da fila.
export const INTERVALOS = [1, 3, 7, 15, 30];
const DAY = 86400000;
const startOfDay = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };

function updateSrs(qid, ok) {
  const cur = state.srs[qid];
  const today = startOfDay(Date.now());
  if (!ok) {
    state.srs[qid] = { box: 0, due: today + INTERVALOS[0] * DAY, lapses: (cur?.lapses || 0) + 1 };
  } else if (cur) {
    if (cur.due > Date.now()) return; // acerto antes do vencimento não promove
    const box = cur.box + 1;
    if (box >= INTERVALOS.length) delete state.srs[qid];
    else state.srs[qid] = { ...cur, box, due: today + INTERVALOS[box] * DAY };
  }
}
export const srsEntries = () => state.srs;
export const dueIds = (now = Date.now()) =>
  Object.entries(state.srs).filter(([, v]) => v.due <= now).sort((a, b) => a[1].due - b[1].due).map(([k]) => k);
export function removeFromSrs(qid) { delete state.srs[qid]; save(); }
