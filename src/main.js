import './styles.css';
import { registerSW } from 'virtual:pwa-register';

// Atualização automática do aplicativo: ao abrir, procura versão nova; se houver, instala e recarrega.
// Também verifica a cada 30 min e quando o app volta a ficar visível (ex.: reabrir no iPad).
registerSW({
  immediate: true,
  onRegisteredSW(_url, reg) {
    if (!reg) return;
    const check = () => reg.update().catch(() => {});
    setInterval(check, 30 * 60 * 1000);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });
  },
});
import { homeView, materiaView, moduloView } from './views/home.js';
import { topicoView } from './views/topico.js';
import { questoesTopicoView, revisaoView } from './views/estudo.js';
import { simuladoView, stopSimulado } from './views/simulado.js';
import { desempenhoView } from './views/desempenho.js';
import { buscaView } from './views/busca.js';
import { creditosView } from './views/creditos.js';
import { dueIds, onChange } from './store.js';

const main = document.getElementById('app-main');
document.getElementById('app-versao').textContent = __VERSAO__;

// ---------- Tema ----------
const themeKey = 'estudos-med:theme';
function applyTheme(t) {
  const theme = t || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
}
let savedTheme = null;
try { savedTheme = localStorage.getItem(themeKey); } catch {}
applyTheme(savedTheme);
document.getElementById('app-theme').onclick = () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem(themeKey, next); } catch {}
  applyTheme(next);
  route();
};

// ---------- Badge de revisão ----------
function updateBadge() {
  const n = dueIds().length;
  const b = document.getElementById('app-due-badge');
  b.hidden = !n;
  b.textContent = n;
}
onChange(updateBadge);
updateBadge();

// ---------- Rotas (hash) ----------
// #/                         início
// #/ase/<id>                  módulo da UEPA (ASE)
// #/materia/<id>             disciplina
// #/<materia>/<topico>[#sec] material do tópico (opcionalmente rolando até a seção)
// #/<materia>/<topico>/questoes
// #/simulado?topico=…|materia=…   #/revisao   #/desempenho   #/busca?q=…
function route() {
  stopSimulado();
  const raw = decodeURI(location.hash.slice(1) || '/');
  const [pathAndQuery, secao] = raw.split('#');
  const [path, query] = pathAndQuery.split('?');
  const params = new URLSearchParams(query || '');
  const parts = path.split('/').filter(Boolean);
  const nav = parts[0] || 'home';
  document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === nav));

  if (!parts.length) homeView(main);
  else if (parts[0] === 'materia') materiaView(main, parts[1]);
  else if (parts[0] === 'ase') moduloView(main, parts[1]);
  else if (parts[0] === 'simulado') simuladoView(main, params);
  else if (parts[0] === 'revisao') revisaoView(main);
  else if (parts[0] === 'desempenho') desempenhoView(main);
  else if (parts[0] === 'busca') buscaView(main, params);
  else if (parts[0] === 'creditos') creditosView(main);
  else if (parts.length === 3 && parts[2] === 'questoes') questoesTopicoView(main, parts[0], parts[1]);
  else if (parts.length === 2) { topicoView(main, parts[0], parts[1], secao); return; }
  else main.innerHTML = '<p>Página não encontrada. <a href="#/">Início</a></p>';
  window.scrollTo(0, 0);
}

// Atalho: "/" abre a busca
addEventListener('keydown', (e) => {
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); location.hash = '#/busca'; }
});

// Ampliar imagens (figuras e questões): toque abre em tela cheia; toque de novo alterna tamanho real
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.fig-zoom');
  if (!btn) return;
  e.preventDefault();
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = `<button class="lightbox-close" aria-label="Fechar">✕</button><img src="${btn.dataset.src}" alt="">`;
  const close = () => { box.remove(); removeEventListener('keydown', onKey); };
  const onKey = (ev) => { if (ev.key === 'Escape') close(); };
  box.addEventListener('click', (ev) => {
    if (ev.target.tagName === 'IMG') box.classList.toggle('real');
    else close();
  });
  addEventListener('keydown', onKey);
  document.body.appendChild(box);
});

addEventListener('hashchange', route);
route();
