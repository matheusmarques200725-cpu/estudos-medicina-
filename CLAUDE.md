# CLAUDE.md — Estudos de Medicina

Site pessoal de estudos de um estudante de medicina da **UEPA (método de tutoria/PBL)**. Organização: **semestre → matéria → tópico**. Cada tópico tem (1) material aprofundado em Markdown e (2) banco de questões em JSON, ligados entre si. Idioma de todo o conteúdo e da interface: **português do Brasil**.

## Comandos

```bash
npm run dev        # servidor local (Vite) com --host para acessar pelo celular na rede
npm run validate   # valida todo o conteúdo — rode SEMPRE após criar/editar conteúdo
npm run build      # validate + build estático em dist/
```

Deploy: GitHub Actions (`.github/workflows/deploy.yml`) publica no GitHub Pages a cada push na `main`.

## Estrutura

```
content/                          ← CONTEÚDO (editável, separado do código)
  materias.json                   semestres + matérias (id, nome, ícone, cor, referências-base)
  <materia>/<topico>.md           material do tópico (frontmatter YAML + Markdown)
  <materia>/<topico>.questoes.json  questões do tópico
scripts/validate.js               validação do conteúdo (roda antes do build)
src/
  lib/parse.js                    funções puras (frontmatter, títulos/âncoras, seções) usadas no site e no validador
  content.js                      carrega content/ via import.meta.glob (sem etapa de build própria)
  markdown.js                     markdown-it + caixas (:::) + mermaid (carregado sob demanda)
  store.js                        localStorage: status, anotações, respostas, simulados, revisão espaçada
  ui.js                           componentes compartilhados (cartão de questão, feedback, estatísticas)
  main.js                         roteador por hash + tema
  views/                          home, topico, estudo (questões + revisão), simulado, desempenho, busca
  styles.css                      mobile-first, tema claro/escuro
```

Stack: Vite + JavaScript puro (sem framework), markdown-it, mermaid, MiniSearch, vite-plugin-pwa. Sem backend, sem login.

**Rotas:** `#/` · `#/materia/<id>` · `#/<materia>/<topico>` · `#/<materia>/<topico>#<secao>` · `#/<materia>/<topico>/questoes` · `#/simulado[?topico=|?materia=]` · `#/revisao` · `#/desempenho` · `#/busca`.

## Como adicionar conteúdo

1. Matéria nova → adicionar em `content/materias.json` (o `id` vira o nome da pasta).
2. Tópico novo → `content/<materia>/<id>.md` seguindo o modelo abaixo (nome do arquivo = `id`).
3. Questões → `content/<materia>/<id>.questoes.json` (10 por tópico).
4. `npm run validate` até zerar os erros. Avisos de "relacionado ainda não existe" são aceitáveis para tópicos planejados.

IDs de tópicos são globais e únicos (kebab-case, sem acento). Use prefixo de matéria quando ajudar: `farmaco-diureticos`, `patologia-lesao-renal-aguda`, `clinica-cetoacidose-diabetica`.

## Modelo de tópico

```markdown
---
id: filtracao-glomerular            # = nome do arquivo
titulo: Filtração glomerular e sua regulação
materia: fisiologia                 # = id em materias.json e nome da pasta
semestre: 2
ordem: 1                            # ordem dentro da matéria/semestre
modulo_uepa: ""                     # módulo de tutoria da UEPA (filtro na página inicial)
tags: [rim, TFG]
relacionados: [equilibrio-acido-base, farmaco-diureticos]   # ids de outros tópicos
atualizado: 2026-11-17
---

## Objetivos do tópico {#objetivos}
## Conceitos-base {#conceitos-base}
### Subtópico {#ancora-do-subtopico}
## Explicação detalhada {#explicacao}
### Mecanismo X {#mecanismo-x}       ← subseções com âncora = alvos das questões
## Correlação clínica {#correlacao-clinica}
## Pontos de alta cobrança em prova {#alta-cobranca}
## Armadilhas comuns {#armadilhas}
## Resumo para revisão rápida {#resumo}
```

Regras do Markdown:

- As **7 seções `##` acima são obrigatórias**, com essas âncoras exatas (o validador confere).
- **Todo título `##`/`###`/`####` deve ter âncora explícita** `{#id-kebab-case}` — é assim que questões, sumário, busca e links apontam para seções.
- Modo **revisão rápida** mostra apenas `#alta-cobranca` e `#resumo` → essas duas seções devem ser autossuficientes.
- **Referências ao fim de cada seção `##`**, em bloco:
  ```
  ::: referencias
  Guyton & Hall, 14ª ed., cap. 27 · Berne & Levy, 7ª ed., cap. 33.
  :::
  ```
- Caixas disponíveis: `::: clinica [título]`, `::: alerta`, `::: dica`, `::: armadilha`, `::: prova`, `::: referencias`. Use `::: prova` dentro de "Pontos de alta cobrança" e `::: armadilha` dentro de "Armadilhas comuns".
- Tabelas comparativas em Markdown (ficam roláveis no celular).
- Diagramas em blocos ```` ```mermaid ```` (flowchart). Rótulos entre aspas: `A["texto<br/>linha 2"]`.
- Fórmulas: Unicode para índices simples (CO₂, HCO₃⁻, Na⁺) e `<sub>` quando necessário (P<sub>CG</sub>, K<sub>f</sub>). Equações importantes em `>` (blockquote).
- Links entre tópicos: `[texto](#/<materia>/<topico>)` ou `[texto](#/<materia>/<topico>#<ancora>)` (o validador confere matéria e âncora).
- Evite a sequência literal `(c)` no texto (o tipógrafo converte em ©).

## Formato das questões

```json
{
  "topico": "filtracao-glomerular",
  "questoes": [
    {
      "id": "fg-001",
      "nivel": "medio",
      "enunciado": "Caso clínico/pergunta. Aceita **negrito** e <sub>.",
      "alternativas": [
        { "letra": "A", "texto": "…", "explicacao": "Por que está errada (ou correta)." },
        { "letra": "B", "texto": "…", "explicacao": "Correta. Raciocínio completo…" },
        { "letra": "C", "texto": "…", "explicacao": "…" },
        { "letra": "D", "texto": "…", "explicacao": "…" },
        { "letra": "E", "texto": "…", "explicacao": "…" }
      ],
      "gabarito": "B",
      "secao": "arteriolas",
      "referencia": "Guyton & Hall, 14ª ed., cap. 27",
      "tags": ["arteríolas"]
    }
  ]
}
```

- `id`: prefixo curto do tópico + número (`fg-001`, `ab-001`), **único no projeto inteiro** (é a chave do progresso salvo — nunca renumere questões existentes).
- `nivel`: `medio` | `dificil` | `aprofundado`. Distribuição por tópico (10 questões): ~4 médias, ~4 difíceis, ~2 aprofundadas.
- Exatamente **5 alternativas A–E**, cada uma com `explicacao` (a correta começa com "Correta.").
- `secao`: âncora do tópico que responde a questão (alimenta o botão "Estudar o tópico").
- Estilo residência/USMLE: caso clínico quando fizer sentido, uma única resposta claramente melhor, distratores plausíveis que testem erros conceituais reais. Não deixe o gabarito sempre na mesma letra — distribua A–E.
- Explicações não devem citar outras alternativas pela letra (para permitir reordenação).

## Regras de conteúdo (obrigatórias)

1. **Nível:** graduação avançada, com raciocínio **fisiopatológico** (o porquê, não só o quê). Didático, em português claro.
2. **Originalidade:** todo texto e todas as questões devem ser **originais**. Cite as fontes, **nunca copie** trechos de livros ou de bancos de questões.
3. **Referências padrão-ouro:** Fisiologia — Guyton & Hall, Berne & Levy · Patologia — Robbins · Farmacologia — Goodman & Gilman, Katzung · Anatomia — Moore, Netter · Histologia — Junqueira · Bioquímica — Lehninger · Clínica — Harrison, Cecil · Diretrizes atuais do Ministério da Saúde e das sociedades brasileiras (SBN, SBC, SBD, SBPT…) e internacionais (KDIGO etc.). Formato: `Livro, edição, cap. N` ou, quando o número do capítulo variar entre edições, o título do capítulo.
4. **Precisão:** valores numéricos e condutas devem refletir as referências e diretrizes vigentes; na dúvida, prefira não afirmar a afirmar errado. Revise os cálculos das questões (gasometrias, depurações etc.).
5. **Integração:** preencha `relacionados` e use links internos para conectar fisiologia ↔ farmacologia ↔ patologia ↔ clínica.
6. Ao final de cada tarefa de conteúdo: `npm run validate` sem erros.

## Dados do usuário (localStorage)

Chave `estudos-med:v1`: `{ status, notes, answers, srs, simulados }`. Revisão espaçada: errou → entra na fila (volta em 1 dia); acertou na data → próxima etapa (1 → 3 → 7 → 15 → 30 dias); acertou na última → sai da fila; errou → volta ao início. Mudanças de formato exigem migração para não perder o progresso.

## Plano de expansão

- Etapa 1 (feita): estrutura + Fisiologia renal (filtração glomerular; equilíbrio ácido-base).
- Etapa 2: ajustes de feedback; preencher semestres/módulos UEPA reais.
- Etapa 3+: expandir por matéria (ex.: restante da fisiologia renal → farmacologia dos diuréticos e IECA/BRA → patologia renal), sempre material completo + 10 questões, com links cruzados.
