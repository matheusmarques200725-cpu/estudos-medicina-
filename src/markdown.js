import MarkdownIt from 'markdown-it';
import attrs from 'markdown-it-attrs';
import container from 'markdown-it-container';

// Caixas especiais: ::: tipo Título opcional
export const CALLOUTS = {
  clinica: '🩺 Correlação clínica',
  alerta: '⚠️ Atenção',
  dica: '💡 Dica',
  armadilha: '🪤 Armadilha',
  prova: '🎯 Cai em prova',
  referencias: '📚 Referências',
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
