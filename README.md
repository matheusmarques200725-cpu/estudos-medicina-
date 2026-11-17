# Estudos de Medicina

Plataforma pessoal de estudos (semestre → matéria → tópico): material aprofundado em Markdown + banco de questões em JSON, com modo estudo, simulado cronometrado, revisão espaçada, desempenho, busca, status e anotações. Tudo salvo localmente no navegador, sem login.

## Rodar no computador

Requer [Node.js](https://nodejs.org) 20+.

```bash
npm install
npm run dev        # abre em http://localhost:5173 (e na rede local, para testar no celular)
```

Outros comandos:

```bash
npm run validate   # confere conteúdo (seções, âncoras, gabaritos, links)
npm run build      # valida + gera o site em dist/
npm run preview    # serve o dist/ gerado
```

## Publicar no GitHub Pages

1. No GitHub: **Settings → Pages → Source: GitHub Actions**.
2. Faça merge na branch `main`: o workflow `.github/workflows/deploy.yml` valida, gera e publica.
3. No celular, abra o link e use "Adicionar à tela inicial" — funciona offline.

> O progresso fica salvo em cada aparelho separadamente (localStorage).

## Editar conteúdo

Veja o [CLAUDE.md](CLAUDE.md): estrutura, modelo de tópico, formato das questões e regras.
