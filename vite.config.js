import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const versao = new Date().toLocaleString('pt-BR', { timeZone: 'America/Belem', dateStyle: 'short', timeStyle: 'short' });

export default defineConfig({
  define: { __VERSAO__: JSON.stringify(versao) },
  base: './', // caminhos relativos: funciona no GitHub Pages (/estudos-medicina-/) e localmente
  build: { chunkSizeWarningLimit: 3000 },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Estudos de Medicina',
        short_name: 'EstudosMed',
        description: 'Material aprofundado e banco de questões por tópico',
        lang: 'pt-BR',
        theme_color: '#0f766e',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: './',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // Pré-carrega só o app; os pedaços do mermaid (diagramas) são guardados quando usados pela 1ª vez.
        globPatterns: ['index.html', 'icon.svg', 'assets/index-*.{js,css}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [{
          urlPattern: ({ url }) => url.pathname.includes('/assets/') || url.pathname.includes('/img/'),
          handler: 'CacheFirst',
          options: { cacheName: 'assets', expiration: { maxEntries: 200 } },
        }],
      },
    }),
  ],
});
