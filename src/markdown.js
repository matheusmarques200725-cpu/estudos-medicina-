import MarkdownIt from 'markdown-it';
import attrs from 'markdown-it-attrs';
import container from 'markdown-it-container';
import creditos from '../content/imagens.json';

// Caixas especiais: ::: tipo Título opcional
export const CALLOUTS = {
  clinica: '🩺 Correlação clínica',
  alerta: '⚠️ Atenção',
  dica: '💡 Dica',
  armadilha: '🪤 Armadilha',
  prova: '🎯 Cai em prova',
  referencias: '📚 Referências',
  videos: '▶️ Vídeos de demonstração',
};

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });
md.use(attrs, { allowedAttributes: ['id', 'class'] });
for (const [name, label] of Object.entries(CALLOUTS)) {
  md.use(container, name, {
    render(tokens, idx) {
      const t = tokens[idx];
      if (t.nesting === 1) {
        const title = t.info.trim().slice(name.length).trim() || label;
        return `<div class="callout callout-${name}"><div class="callout-title">${md.utils.escapeHtml(title)}</div>\n`;
      }
      return '</div>\n';
    },
  });
}

/** Crédito curto de uma imagem (autor · licença), a partir de content/imagens.json. */
export function creditoImagem(src) {
  const c = creditos[src];
  if (!c) return '';
  const tipo = /\.(ogg|oga|mp3|wav|m4a)$/i.test(src) ? 'Áudio' : /\.(webm|ogv|mp4)$/i.test(src) ? 'Vídeo' : 'Imagem';
  return `${tipo}: ${md.utils.escapeHtml(c.autor)} · ${md.utils.escapeHtml(c.licenca)}`;
}

/** HTML de uma imagem ampliável com crédito (usado nas figuras e nas questões). */
export function figuraHtml(src, legendaHtml = '', alt = '') {
  const esc = md.utils.escapeHtml;
  return `<figure class="fig"><button type="button" class="fig-zoom" data-src="${esc(src)}" aria-label="Ampliar imagem">`
    + `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"></button>`
    + `<figcaption>${legendaHtml}<span class="fig-credito">${creditoImagem(src)} — <a href="#/creditos">créditos</a></span></figcaption></figure>`;
}

// Figuras: ::: figura img/caminho.jpg  (conteúdo = legenda em Markdown)
md.use(container, 'figura', {
  render(tokens, idx) {
    const t = tokens[idx];
    if (t.nesting === 1) {
      const src = t.info.trim().slice('figura'.length).trim();
      const esc = md.utils.escapeHtml;
      if (/\.(ogg|oga|mp3|wav|m4a)$/i.test(src)) {
        return `<figure class="fig fig-midia"><audio controls preload="none" src="${esc(src)}"></audio><figcaption><!--credito:${esc(src)}-->`;
      }
      if (/\.(webm|ogv|mp4)$/i.test(src)) {
        return `<figure class="fig fig-midia"><video controls preload="metadata" playsinline src="${esc(src)}"></video><figcaption><!--credito:${esc(src)}-->`;
      }
      return `<figure class="fig"><button type="button" class="fig-zoom" data-src="${esc(src)}" aria-label="Ampliar imagem">`
        + `<img src="${esc(src)}" alt="" loading="lazy"></button><figcaption>`
        + `<!--credito:${esc(src)}-->`;
    }
    return '</figcaption></figure>\n';
  },
});
// Insere o crédito no fim da legenda (o container só conhece a fonte na abertura)
const renderOriginal = md.render.bind(md);
md.render = (src, env) => renderOriginal(src, env).replace(
  /<!--credito:([^>]*?)-->([\s\S]*?)<\/figcaption>/g,
  (_, s, cap) => `${cap}<span class="fig-credito">${creditoImagem(md.utils.unescapeAll(s))} — <a href="#/creditos">créditos</a></span></figcaption>`,
);

// Links externos (http/https) abrem em nova aba, sem sair do site
const defaultLinkOpen = md.renderer.rules.link_open || ((tokens, idx, opts, env, self) => self.renderToken(tokens, idx, opts));
md.renderer.rules.link_open = (tokens, idx, opts, env, self) => {
  const href = tokens[idx].attrGet('href') || '';
  if (/^https?:\/\//.test(href)) { tokens[idx].attrSet('target', '_blank'); tokens[idx].attrSet('rel', 'noopener noreferrer'); }
  return defaultLinkOpen(tokens, idx, opts, env, self);
};

// ```mermaid → <div class="mermaid">
const defaultFence = md.renderer.rules.fence;
md.renderer.rules.fence = (tokens, idx, opts, env, self) => {
  const t = tokens[idx];
  if (t.info.trim() === 'mermaid') return `<div class="mermaid">${md.utils.escapeHtml(t.content)}</div>\n`;
  return defaultFence(tokens, idx, opts, env, self);
};

// Tabelas roláveis no celular
md.renderer.rules.table_open = () => '<div class="table-wrap"><table>\n';
md.renderer.rules.table_close = () => '</table></div>\n';

export const renderMarkdown = (src) => md.render(src);
export const renderInline = (src) => md.renderInline(src);

let mermaidPromise;
let queue = Promise.resolve();
/** Renderiza os diagramas visíveis (o mermaid precisa de layout). Chamadas são enfileiradas. */
export function renderMermaid(root) {
  queue = queue.then(async () => {
    const nodes = [...root.querySelectorAll('.mermaid:not([data-processed])')].filter((n) => n.isConnected && n.offsetParent !== null);
    if (!nodes.length) return;
    mermaidPromise ||= import('mermaid').then((m) => m.default);
    const mermaid = await mermaidPromise;
    const dark = document.documentElement.dataset.theme === 'dark';
    mermaid.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'neutral', securityLevel: 'strict', fontFamily: 'inherit' });
    try { await mermaid.run({ nodes: nodes.filter((n) => n.isConnected) }); } catch (e) { if (nodes.every((n) => n.isConnected)) console.error('Mermaid:', e); /* senão: o usuário mudou de página durante a renderização */ }
  });
  return queue;
}
