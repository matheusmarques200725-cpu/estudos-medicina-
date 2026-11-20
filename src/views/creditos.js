import creditos from '../../content/imagens.json';
import { esc } from '../ui.js';

export function creditosView(main) {
  const itens = Object.entries(creditos);
  main.innerHTML = `
    <nav class="crumbs"><a href="#/">Início</a> › Créditos das imagens</nav>
    <h1>📷 Créditos das imagens</h1>
    <p class="muted">As imagens deste site têm licença livre (Creative Commons ou domínio público) e foram obtidas na
      <a href="https://commons.wikimedia.org" target="_blank" rel="noopener">Wikimedia Commons</a>. Abaixo, autor, licença e fonte de cada uma.
      Os esquemas e diagramas sem crédito são originais deste site.</p>
    <ul class="creditos">
      ${itens.map(([src, c]) => `
        <li class="card">
          <img src="${esc(src)}" alt="" loading="lazy">
          <div>
            <strong>${esc(c.titulo)}</strong><br>
            <span class="small">Autor: ${esc(c.autor)} · Licença: ${esc(c.licenca)}${c.modificacao ? ` · ${esc(c.modificacao)}` : ''}</span><br>
            <a class="small" href="${esc(c.fonte)}" target="_blank" rel="noopener">Ver original na Wikimedia Commons</a>
          </div>
        </li>`).join('')}
    </ul>`;
}
