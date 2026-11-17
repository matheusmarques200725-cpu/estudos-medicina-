import './styles.css';
import { homeView, materiaView, moduloView } from './views/home.js';
import { topicoView } from './views/topico.js';
import { questoesTopicoView, revisaoView } from './views/estudo.js';
import { simuladoView, stopSimulado } from './views/simulado.js';
import { desempenhoView } from './views/desempenho.js';
import { buscaView } from './views/busca.js';
import { dueIds, onChange } from './store.js';

const main = document.getElementById('app-main');

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
  else if (parts.length === 3 && parts[2] === 'questoes') questoesTopicoView(main, parts[0], parts[1]);
  else if (parts.length === 2) { topicoView(main, parts[0], parts[1], secao); return; }
  else main.innerHTML = '<p>Página não encontrada. <a href="#/">Início</a></p>';
  window.scrollTo(0, 0);
}

// Atalho: "/" abre a busca
addEventListener('keydown', (e) => {
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); location.hash = '#/busca'; }
});

addEventListener('hashchange', route);
route();
