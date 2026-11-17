# CLAUDE.md — Estudos de Medicina

Site pessoal de estudos de um estudante de medicina da **UEPA (método de tutoria/PBL)**. Organização: **semestre → módulo (ASE da UEPA) → tópico**, com a **disciplina** (fisiologia, imunologia, patologia…) como etiqueta/filtro. Cada tópico tem (1) material aprofundado em Markdown e (2) banco de questões em JSON, ligados entre si. Idioma de todo o conteúdo e da interface: **português do Brasil**.

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
  materias.json                   semestres + modulos (ASE1–ASE6: ementa, objetivos, bibliografia UEPA) + materias (disciplinas)
  <materia>/<topico>.md           material do tópico (frontmatter YAML + Markdown); pasta = disciplina
  <materia>/<topico>.questoes.json  questões do tópico
scripts/validate.js               validação do conteúdo (roda antes do build)
src/
  lib/parse.js                    funções puras (frontmatter, títulos/âncoras, seções) usadas no site e no validador
  content.js                      carrega content/ via import.meta.glob (sem etapa de build própria)
  markdown.js                     markdown-it + caixas (:::) + mermaid (carregado sob demanda)
  store.js                        localStorage: status, anotações, respostas, simulados, revisão espaçada
  ui.js                           componentes compartilhados (cartão de questão, feedback, estatísticas)
  main.js                         roteador por hash + tema
  views/                          home (+ página do ASE e da disciplina), topico, estudo (questões + revisão), simulado, desempenho, busca
  styles.css                      mobile-first, tema claro/escuro
```

Stack: Vite + JavaScript puro (sem framework), markdown-it, mermaid, MiniSearch, vite-plugin-pwa. Sem backend, sem login.

**Rotas:** `#/` · `#/ase/<id>` (módulo) · `#/materia/<id>` (disciplina) · `#/<materia>/<topico>` · `#/<materia>/<topico>#<secao>` · `#/<materia>/<topico>/questoes` · `#/simulado[?topico=|?materia=|?modulo=]` · `#/revisao` · `#/desempenho` · `#/busca`.

## Como adicionar conteúdo

1. Disciplina nova → adicionar em `materias` de `content/materias.json` (o `id` vira o nome da pasta). Módulos (ASEs) ficam em `modulos`.
2. Tópico novo → `content/<materia>/<id>.md` seguindo o modelo abaixo (nome do arquivo = `id`).
3. Questões → `content/<materia>/<id>.questoes.json` (10 por tópico).
4. `npm run validate` até zerar os erros. Avisos de "relacionado ainda não existe" são aceitáveis para tópicos planejados.

IDs de tópicos são globais e únicos (kebab-case, sem acento). Use prefixo de matéria quando ajudar: `farmaco-diureticos`, `patologia-lesao-renal-aguda`, `clinica-cetoacidose-diabetica`.

## Modelo de tópico

```markdown
---
id: filtracao-glomerular            # = nome do arquivo
titulo: Filtração glomerular e sua regulação
materia: fisiologia                 # disciplina: id em materias.json e nome da pasta
semestre: 2                         # deve bater com o semestre do 1º módulo
ordem: 1                            # ordem dentro do módulo
modulos: [ase4]                     # ASE(s) da UEPA; o 1º é o principal (validado)
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

## Módulos da UEPA e roteiro de tópicos

MED1 (1º semestre) = ASE1–ASE3; MED2 (2º semestre) = ASE4–ASE6. Ementas, objetivos e bibliografia básica de cada ASE estão em `content/materias.json` (fonte: Manual Acadêmico MED1/MED2 da UEPA). Ao escrever um tópico, priorize as referências da bibliografia básica do ASE, nas edições atuais.

**Ordem de produção combinada com o usuário: ASE6 → ASE4/ASE5 → ASE1–3, em lotes de 3–4 tópicos** (o usuário revisa cada lote). ✔ = pronto.

- **ASE6 – Mecanismos de Agressão e Defesa** (cursando)
  - Lote 1 ✔: `orgaos-linfoides-hematopoese` (lh-), `imunidade-inata` (ii-), `sistema-complemento` (co-), `imunidade-celular-mhc-linfocitos-t` (tc-) — imunologia
  - Lote 2: `imunidade-humoral-anticorpos` (imunologia); `lesao-celular-estresse-oxidativo` (isquemia/hipóxia, agentes físicos/químicos/biológicos), `necrose-apoptose`, `inflamacao-aguda` (sinais cardinais, mediadores) — patologia
  - Lote 3: `inflamacao-cronica-reparo`, `hemostasia-coagulacao`, `febre-dor-resposta-neuroendocrina`, `agressoes-fisicas-quimicas` (trauma, radiação, frio/calor, intoxicações)
  - Lote 4: `hipersensibilidades`, `autoimunidade-tolerancia`, `imunodeficiencias`, `resposta-imune-agentes-infecciosos` (vírus, bactérias, fungos, protozoários, helmintos)
- **ASE4 – Funções Biológicas II:** organização do SN; potencial de membrana e de ação; sinapses e neurotransmissores; junção neuromuscular; reflexos; SN autônomo; eixo hipotálamo-hipófise e controle neuroendócrino; formação da urina (✔ `filtracao-glomerular`; reabsorção/secreção tubular); SRAA e controle da PA; equilíbrio hidroeletrolítico; estresse/fatores ambientais.
- **ASE5 – Metabolismo e Nutrição:** motilidade e secreção digestivas; digestão e absorção; glândulas anexas; metabolismo de carboidratos (glicólise, glicogênio, gliconeogênese, Cori); lipídios; proteínas/ciclo da ureia; bioenergética; insulina, glucagon e incretinas; tireoide; adrenais; fome/saciedade; obesidade, DM, dislipidemia, síndrome metabólica; desnutrição e terapia nutricional; erros inatos; farmacocinética; fármacos do TGI e antieméticos; álcool.
- **ASE3 – Funções Biológicas I:** ciclo cardíaco; atividade elétrica; regulação da PA; circulação; mecânica ventilatória; V/Q; transporte de gases; ✔ `equilibrio-acido-base`; músculos; esqueleto.
- **ASE2 – Proliferação, Alteração do Crescimento e Diferenciação Celular:** célula e membrana; organelas; DNA/transcrição/tradução; ciclo celular, mitose/meiose; herança; adaptações celulares; neoplasia/oncogenes; mutações; célula-tronco.
- **ASE1 – Introdução ao Estudo da Medicina:** SUS e níveis de atenção; sistemas de informação e indicadores; história natural da doença; bioética e relação médico-paciente; tecidos epitelial/conjuntivo; planimetria.

Links planejados em `relacionados` que ainda não existem geram apenas aviso no validador — é esperado.
