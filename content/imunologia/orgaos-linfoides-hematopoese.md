---
id: orgaos-linfoides-hematopoese
titulo: Órgãos linfoides e linhagens hematopoéticas
materia: imunologia
semestre: 2
ordem: 1
modulos: [ase6]
tags: [hematopoese, granulócitos, linfócitos, timo, linfonodo, baço, MALT, hemograma, leucograma]
relacionados: [imunidade-inata, imunidade-celular-mhc-linfocitos-t, sistema-complemento, imunidade-humoral-anticorpos, inflamacao-aguda]
atualizado: 2026-11-18
---

## Objetivos do tópico {#objetivos}

Ao final, você deve ser capaz de:

1. Descrever a hematopoese a partir da célula-tronco hematopoética e as duas grandes linhagens: **mieloide** (que inclui os granulócitos) e **linfoide**.
2. Reconhecer as etapas de maturação da linhagem granulocítica e interpretar **leucocitose, desvio à esquerda, eosinofilia e linfocitose** no hemograma.
3. Diferenciar órgãos linfoides **primários** (medula óssea e timo: onde os linfócitos *nascem e são educados*) e **secundários** (linfonodos, baço, MALT: onde os linfócitos *encontram o antígeno*).
4. Explicar a organização funcional do linfonodo, do baço e do MALT e por que essa arquitetura torna a resposta imune eficiente.
5. Aplicar esses conceitos a situações clínicas: asplenia, síndrome de DiGeorge, linfadenopatia, neutropenia febril e reação leucemoide.

::: referencias
Abbas, Lichtman & Pillai – Imunologia Celular e Molecular, 10ª ed., cap. "Células e tecidos do sistema imune" · Junqueira & Carneiro – Histologia Básica, 13ª ed., caps. "Hemocitopoese" e "Sistema imune e órgãos linfoides".
:::

## Conceitos-base {#conceitos-base}

### A lógica do sistema {#logica-do-sistema}

O sistema imune enfrenta um problema de **logística**: há poucos linfócitos específicos para cada antígeno (cerca de 1 em 10⁵–10⁶ células), e o micróbio pode entrar por qualquer ponto do corpo. A solução tem três partes:

1. **Produzir** grande diversidade de células na medula óssea (hematopoese).
2. **Educar** os linfócitos em órgãos primários, eliminando os que reagem contra o próprio corpo.
3. **Concentrar** antígenos e linfócitos em órgãos secundários estrategicamente posicionados — linfonodos drenando tecidos, baço filtrando o sangue, MALT vigiando as mucosas — onde o encontro raro entre o linfócito certo e seu antígeno se torna provável.

Guardar essa lógica ajuda a prever as consequências clínicas: se a **produção** falha → aplasia/neutropenia; se a **educação** falha → imunodeficiência ou autoimunidade; se o **local de encontro** falta → infecções típicas (por exemplo, asplenia e bactérias encapsuladas).

### Valores de referência do leucograma {#leucograma}

| Célula | Valor relativo típico | Valor absoluto típico (adulto) | Aumenta tipicamente em |
|---|---|---|---|
| Leucócitos totais | — | ~4.000–11.000/mm³ | Infecções, inflamação, corticoides, leucemias |
| Neutrófilos | ~50–70% | ~1.800–7.500/mm³ | Infecção bacteriana, inflamação aguda, estresse, corticoide |
| Linfócitos | ~20–40% | ~1.000–4.000/mm³ | Infecções virais (mononucleose), coqueluche, LLC |
| Monócitos | ~2–8% | ~200–800/mm³ | Infecções crônicas (TB), recuperação de neutropenia |
| Eosinófilos | ~1–4% | ~50–500/mm³ | **Helmintos**, alergia, asma, reações a fármacos |
| Basófilos | ~0–1% | ~0–100/mm³ | Neoplasias mieloproliferativas (LMC) |

Os valores variam com o laboratório e a idade (crianças pequenas têm predomínio linfocitário). **Interprete sempre o valor absoluto**, não só a porcentagem.

::: referencias
Abbas, 10ª ed., cap. "Propriedades e visão geral das respostas imunes" e "Células e tecidos do sistema imune" · Hoffbrand – Fundamentos em Hematologia, 7ª ed., cap. "Leucócitos: granulócitos, monócitos e seus distúrbios benignos".
:::

## Explicação detalhada {#explicacao}

### Hematopoese: da célula-tronco às linhagens {#hematopoese}

A **célula-tronco hematopoética (CTH)**, CD34⁺, reside em nichos da medula óssea. Duas propriedades a definem: **autorrenovação** e **multipotência**. Ela origina dois progenitores comprometidos:

```mermaid
flowchart TD
  CTH["Célula-tronco hematopoética<br/>(CD34⁺, autorrenovação)"] --> PMC["Progenitor mieloide comum"]
  CTH --> PLC["Progenitor linfoide comum"]
  PMC --> GM["Progenitor granulócito-monócito"]
  PMC --> ME["Progenitor megacariócito-eritrocitário"]
  GM --> N["Neutrófilo"]
  GM --> E["Eosinófilo"]
  GM --> B["Basófilo / mastócito"]
  GM --> MO["Monócito → macrófago,<br/>célula dendrítica"]
  ME --> HE["Hemácia"]
  ME --> PL["Plaquetas"]
  PLC --> LB["Linfócito B (medula)"]
  PLC --> LT["Precursor T → timo"]
  PLC --> NK["Célula NK e ILCs"]
```

**O controle é feito por citocinas (fatores de crescimento hematopoéticos)**, e entender quais atuam em cada ramo explica vários fármacos:

| Fator | Ação principal | Uso/Correlação |
|---|---|---|
| Eritropoetina (EPO, renal) | Eritropoese | Anemia da doença renal crônica; EPO recombinante |
| G-CSF | Neutrófilos | **Filgrastim** na neutropenia pós-quimioterapia; mobilizar CTH para transplante |
| GM-CSF | Granulócitos e monócitos | — |
| M-CSF | Monócitos/macrófagos | — |
| Trombopoetina (TPO, hepática) | Megacariócitos/plaquetas | Agonistas de TPO na trombocitopenia imune |
| IL-7 | Desenvolvimento de linfócitos | Mutações no receptor (cadeia γ comum, IL-7Rα) → imunodeficiência combinada grave |
| IL-5 | Eosinófilos | Anti-IL-5 (mepolizumabe) na asma eosinofílica |

::: referencias
Abbas, 10ª ed., cap. "Células e tecidos do sistema imune" · Junqueira & Carneiro, 13ª ed., cap. "Hemocitopoese".
:::

### Linhagem granulocítica {#linhagem-granulocitica}

A maturação do neutrófilo na medula leva cerca de **10–14 dias** e segue esta sequência:

> **Mieloblasto → promielócito → mielócito → metamielócito → bastonete → segmentado**

- Até o **mielócito**, a célula ainda se divide (compartimento mitótico). Do metamielócito em diante, só amadurece (compartimento de maturação/reserva).
- Os **grânulos primários (azurófilos)** — mieloperoxidase, defensinas, elastase — surgem no promielócito; os **secundários (específicos)** — lactoferrina, lisozima, colagenase — no mielócito.
- O neutrófilo maduro vive **horas a poucos dias** no sangue e tecidos. Por isso a neutropenia aparece rapidamente quando a medula é suprimida (quimioterapia).

**Desvio à esquerda:** quando a demanda por neutrófilos é intensa (infecção bacteriana, sepse), a medula libera formas jovens da reserva → aumentam os **bastonetes** (e, em casos graves, metamielócitos e mielócitos) no sangue periférico. Granulações tóxicas e corpúsculos de Döhle reforçam o sinal de infecção.

**Os outros granulócitos:**

| Célula | Grânulos / mediadores | Função principal |
|---|---|---|
| **Neutrófilo** | MPO, elastase, lactoferrina; NADPH oxidase | Fagocitose e destruição de bactérias e fungos; primeira célula da inflamação aguda |
| **Eosinófilo** | Proteína básica principal, peroxidase eosinofílica, proteína catiônica | Defesa contra **helmintos** (grandes demais para fagocitar); inflamação alérgica (via IL-5 e Th2) |
| **Basófilo** | Histamina, heparina; receptor de alta afinidade para IgE (FcεRI) | Circulante; reações alérgicas |
| **Mastócito** | Histamina, triptase, prostaglandinas, leucotrienos; FcεRI | Residente nos tecidos (pele, mucosas); hipersensibilidade tipo I e anafilaxia |

**Monócitos** saem da medula, circulam ~1–3 dias e migram para os tecidos, onde se tornam **macrófagos** (células de Kupffer no fígado, micróglia no SNC, macrófagos alveolares, osteoclastos derivam da mesma linhagem). Macrófagos fagocitam, apresentam antígenos e produzem citocinas.

::: referencias
Junqueira & Carneiro, 13ª ed., cap. "Hemocitopoese" · Hoffbrand – Fundamentos em Hematologia, 7ª ed.
:::

### Linhagem linfoide {#linhagem-linfoide}

Do progenitor linfoide comum surgem:

- **Linfócitos B** — completam a maturação na **medula óssea**. Reconhecem antígenos nativos pelo BCR (imunoglobulina de membrana) e se diferenciam em **plasmócitos** produtores de anticorpos.
- **Linfócitos T** — os precursores migram para o **timo**, onde rearranjam o TCR e passam pelas seleções positiva e negativa. Saem como CD4⁺ (auxiliares) ou CD8⁺ (citotóxicos).
- **Células NK** — linfócitos da imunidade **inata**, sem receptor rearranjado; matam células infectadas por vírus e tumorais que perderam MHC I.
- **Células linfoides inatas (ILCs)** — residentes em mucosas; espelham as funções dos subtipos de linfócitos T auxiliares, mas sem especificidade antigênica.

Marcadores úteis (imunofenotipagem por citometria de fluxo): **CD3** (todos os T), **CD4** e **CD8**, **CD19/CD20** (B), **CD16/CD56** (NK).

::: referencias
Abbas, 10ª ed., caps. "Células e tecidos do sistema imune" e "Desenvolvimento dos linfócitos".
:::

### Órgãos linfoides primários {#orgaos-primarios}

#### Medula óssea {#medula-ossea}

Local da hematopoese e da maturação dos **linfócitos B**. Os B imaturos que reconhecem com alta avidez antígenos próprios presentes na medula são eliminados ou "editam" seu receptor (**tolerância central de B**). Abriga também plasmócitos de vida longa, que mantêm níveis de anticorpos por anos após uma infecção ou vacina.

#### Timo {#timo}

Órgão bilobado no mediastino anterior, organizado em **córtex** (denso, cheio de timócitos imaturos) e **medula** (menos densa, com os **corpúsculos de Hassall**).

```mermaid
flowchart LR
  A["Precursor T chega<br/>da medula óssea"] --> B["Córtex: timócito<br/>duplo-negativo → duplo-positivo<br/>(CD4⁺CD8⁺)"]
  B --> C{"Seleção POSITIVA<br/>(epitélio cortical)<br/>Reconhece MHC próprio?"}
  C -- "Não (~90%)" --> X["Morte por<br/>negligência"]
  C -- "Sim" --> D["Simples-positivo<br/>CD4⁺ (MHC II) ou CD8⁺ (MHC I)"]
  D --> E{"Seleção NEGATIVA<br/>(medula; AIRE)<br/>Reage forte a antígeno próprio?"}
  E -- "Sim" --> Y["Apoptose<br/>(ou vira Treg)"]
  E -- "Não" --> F["Linfócito T maduro<br/>naïve → periferia"]
```

- **Seleção positiva (córtex):** sobrevivem só os timócitos cujo TCR reconhece fracamente o **MHC próprio** — garante **restrição ao MHC**. O tipo de MHC reconhecido define a linhagem: MHC II → CD4; MHC I → CD8.
- **Seleção negativa (medula):** timócitos que reagem fortemente a peptídeos próprios são eliminados por apoptose. O fator de transcrição **AIRE** faz as células epiteliais medulares expressarem proteínas de outros órgãos (insulina, tireoglobulina…), permitindo eliminar clones autorreativos contra tecidos periféricos. Parte dos clones autorreativos vira **T reguladora (Treg, FOXP3⁺)**.
- O timo é maior na infância e sofre **involução** progressiva (substituição por gordura) após a puberdade, mas continua funcional em baixa escala.

::: clinica Quando a educação falha
- **Mutação de AIRE** → síndrome poliglandular autoimune tipo 1 (APECED): hipoparatireoidismo, insuficiência adrenal e candidíase mucocutânea crônica.
- **Aplasia tímica (síndrome de DiGeorge, deleção 22q11.2)** → deficiência de linfócitos T, com hipocalcemia (paratireoides ausentes) e cardiopatia conotruncal, pois todos derivam das 3ª e 4ª bolsas faríngeas.
:::

::: referencias
Abbas, 10ª ed., caps. "Desenvolvimento dos linfócitos" e "Tolerância imunológica e autoimunidade" · Junqueira & Carneiro, 13ª ed., cap. "Sistema imune e órgãos linfoides".
:::

### Órgãos linfoides secundários {#orgaos-secundarios}

#### Linfonodos {#linfonodos}

Filtram a **linfa** que vem dos tecidos. A linfa entra pelos vasos **aferentes** (na cápsula), percorre os seios e sai pelo vaso **eferente** no hilo. Arquitetura:

| Região | Quem está lá | Função |
|---|---|---|
| **Córtex** | **Folículos de linfócitos B** (primários; secundários com **centro germinativo** após estímulo) e células dendríticas foliculares | Ativação de B, troca de classe, maturação de afinidade |
| **Paracórtex** | **Linfócitos T** e células dendríticas; **vênulas de endotélio alto (HEV)** | Apresentação de antígeno a T; entrada de linfócitos do sangue |
| **Medula** | Cordões medulares com **plasmócitos** e macrófagos | Secreção de anticorpos, filtração |

**Como os linfócitos chegam e saem:** linfócitos naïve expressam **L-selectina (CD62L)** e o receptor de quimiocinas **CCR7**. Eles aderem às **HEV** do paracórtex e entram no linfonodo, guiados por quimiocinas (CCL19/CCL21). Se não encontram seu antígeno em algumas horas, saem pela linfa eferente seguindo um gradiente de **esfingosina-1-fosfato (S1P)** e voltam ao sangue — a **recirculação**. O fingolimode (usado na esclerose múltipla) bloqueia o receptor de S1P e "aprisiona" os linfócitos nos linfonodos.

As células dendríticas capturam antígenos nos tecidos, amadurecem, passam a expressar CCR7 e migram pelos linfáticos para o paracórtex, onde apresentam o antígeno aos T naïve — veja [imunidade celular](#/imunologia/imunidade-celular-mhc-linfocitos-t#apresentacao-antigeno).

#### Baço {#baco}

Filtra o **sangue** (não tem linfáticos aferentes). Dois compartimentos:

- **Polpa vermelha** (~75%): cordões esplênicos e sinusoides. Os macrófagos removem **hemácias senescentes ou alteradas**, partículas e bactérias **opsonizadas**. É também reservatório de plaquetas (~1/3 delas).
- **Polpa branca**: tecido linfoide ao redor das arteríolas centrais — **bainha periarteriolar (PALS)** rica em linfócitos T, e **folículos de B**. A **zona marginal**, na transição, contém **linfócitos B da zona marginal** e macrófagos especializados em capturar **antígenos polissacarídicos** do sangue e produzir rapidamente IgM.

::: clinica Asplenia e bactérias encapsuladas
Sem baço (esplenectomia, anemia falciforme com autoesplenectomia), perdem-se: (1) a filtração de bactérias opsonizadas, (2) a resposta rápida de **IgM contra polissacarídeos capsulares** da zona marginal. O resultado é risco de **sepse fulminante por bactérias encapsuladas** — *Streptococcus pneumoniae*, *Haemophilus influenzae* tipo b e *Neisseria meningitidis*. Por isso pacientes asplênicos devem ser **vacinados** contra esses agentes (idealmente ≥2 semanas antes de esplenectomia eletiva) e orientados a procurar atendimento imediato se tiverem febre. No esfregaço, aparecem **corpúsculos de Howell-Jolly** (restos nucleares que o baço normalmente removeria).
:::

#### Tecido linfoide associado a mucosas (MALT) {#malt}

As mucosas (intestino, vias aéreas, trato urogenital) somam uma área enorme exposta a antígenos. O MALT inclui as **placas de Peyer** (íleo), tonsilas, apêndice e agregados difusos na lâmina própria.

- **Células M** no epitélio sobre as placas de Peyer transportam antígenos do lúmen para as células dendríticas subjacentes (transcitose).
- A resposta típica é de **IgA secretora**, transportada através do epitélio pelo **receptor poli-Ig**; ela neutraliza micróbios e toxinas no lúmen sem causar inflamação.
- O intestino também é rico em Treg e mecanismos de **tolerância oral** a alimentos e à microbiota.

::: referencias
Abbas, 10ª ed., caps. "Células e tecidos do sistema imune" e "Imunidade regional" · Junqueira & Carneiro, 13ª ed., cap. "Sistema imune e órgãos linfoides".
:::

## Correlação clínica {#correlacao-clinica}

### Lendo o leucograma {#leucograma-clinico}

| Padrão | Mecanismo | Pense em |
|---|---|---|
| Neutrofilia com **desvio à esquerda** e granulações tóxicas | Liberação da reserva medular por G-CSF, IL-1, TNF | **Infecção bacteriana**, sepse |
| Neutrofilia **sem** desvio | Desmarginação (neutrófilos aderidos ao endotélio voltam à circulação) | **Corticoide**, adrenalina, estresse, exercício |
| **Linfocitose com linfócitos atípicos** | Linfócitos T CD8⁺ ativados contra células B infectadas | Mononucleose (EBV) |
| **Eosinofilia** | IL-5 de Th2 | **Helmintos** (estrongiloidíase, ancilostomíase…), alergia, fármacos |
| **Neutropenia** < 500/mm³ | Supressão medular, destruição | Quimioterapia → **neutropenia febril** é emergência |
| **Linfopenia** | Destruição/redistribuição | HIV, corticoide, sepse |

**Reação leucemoide × leucemia mieloide crônica (LMC):** ambas podem ter leucocitose >50.000/mm³ com formas jovens. Na reação leucemoide (infecção grave, por exemplo) há causa identificável e predomínio de bastonetes e metamielócitos; na LMC há **basofilia**, cromossomo Filadélfia (BCR-ABL) e esplenomegalia.

### Neutropenia febril {#neutropenia-febril}

Em paciente com neutrófilos < 500/mm³ (ou com previsão de cair abaixo disso) e febre, a falta de neutrófilos impede a formação de pus e a localização da infecção — os sinais clássicos podem estar ausentes. Por isso, a conduta é **antibiótico de amplo espectro empírico imediato**, idealmente na primeira hora, após coleta de culturas. O G-CSF (filgrastim) pode encurtar a duração da neutropenia em situações selecionadas.

### Linfadenopatia {#linfadenopatia}

O linfonodo aumenta por **hiperplasia reativa** (folículos com centros germinativos — resposta B; paracórtex — resposta T, como em infecções virais), por **infiltração** (metástases, linfomas) ou por inflamação do próprio linfonodo (linfadenite). Sinais de alarme: linfonodo **> 2 cm, endurecido, aderido, indolor, supraclavicular**, persistente por mais de 4–6 semanas, ou acompanhado de febre, sudorese noturna e perda de peso → investigar com biópsia.

::: referencias
Hoffbrand – Fundamentos em Hematologia, 7ª ed. · Harrison – Medicina Interna, 21ª ed., caps. "Distúrbios dos granulócitos e monócitos" e "Linfadenopatia e esplenomegalia" · Ministério da Saúde – Calendário de vacinação dos Centros de Referência para Imunobiológicos Especiais (CRIE).
:::

## Pontos de alta cobrança em prova {#alta-cobranca}

::: prova
- CTH → **progenitor mieloide comum** (granulócitos, monócitos, hemácias, plaquetas) e **linfoide comum** (B, T, NK, ILCs).
- Maturação do neutrófilo: **mieloblasto → promielócito → mielócito → metamielócito → bastonete → segmentado**. Divide-se só até o mielócito.
- **Desvio à esquerda** = ↑ bastonetes → infecção bacteriana. Neutrofilia sem desvio → corticoide/estresse (desmarginação).
- **Eosinofilia → helmintos e alergia** (IL-5). **Basofilia → pensar em LMC.**
- Órgãos **primários**: medula óssea (B) e **timo** (T). **Secundários**: linfonodos, baço, MALT.
- Timo: **seleção positiva no córtex** (restrição ao MHC; define CD4 × CD8) e **negativa na medula** (tolerância central; **AIRE**).
- Linfonodo: **folículos B no córtex**, **T no paracórtex**, plasmócitos na medula; entrada pelas **HEV** (L-selectina, CCR7); saída por **S1P**.
- Baço: **polpa vermelha filtra hemácias**; **polpa branca** = PALS (T) + folículos (B); **zona marginal** → IgM contra polissacarídeos.
- **Asplenia → encapsulados** (pneumococo, Hib, meningococo); vacinar; Howell-Jolly.
- MALT: **células M**, placas de Peyer, **IgA secretora**.
- **DiGeorge (22q11.2)**: aplasia tímica + hipocalcemia + cardiopatia.
:::

## Armadilhas comuns {#armadilhas}

::: armadilha
- **Confundir órgão primário com secundário.** O linfonodo **não** produz linfócitos a partir de células-tronco; ele é local de **ativação e proliferação** de linfócitos já maduros.
- **Achar que o linfócito T amadurece na medula óssea.** Ele **nasce** lá, mas **amadurece no timo**.
- **Inverter as seleções tímicas.** Positiva = sobrevive quem reconhece **MHC próprio** (córtex). Negativa = morre quem reage **forte a peptídeo próprio** (medula).
- **Interpretar porcentagem em vez de valor absoluto.** "Linfocitose de 60%" pode ser apenas neutropenia com linfócitos absolutos normais.
- **Toda neutrofilia é infecção.** Corticoide, estresse e exercício causam neutrofilia **sem desvio à esquerda** por desmarginação.
- **Esquecer que o baço não recebe linfa.** Ele filtra **sangue**; linfonodos filtram **linfa**.
- **Achar que basófilo e mastócito são a mesma célula.** Compartilham FcεRI e histamina, mas o basófilo circula e o mastócito reside nos tecidos.
:::

## Resumo para revisão rápida {#resumo}

- **Lógica:** produzir (medula) → educar (medula para B, timo para T) → concentrar antígeno e linfócitos (linfonodos, baço, MALT).
- **Hematopoese:** CTH CD34⁺ → mieloide comum (neutrófilo, eosinófilo, basófilo/mastócito, monócito/macrófago/dendrítica, hemácia, plaqueta) e linfoide comum (B, T, NK, ILC). Citocinas: EPO, G-CSF (filgrastim), GM-CSF, TPO, IL-5, IL-7.
- **Neutrófilo:** 10–14 dias de maturação; vida curta; **desvio à esquerda** em infecção bacteriana; neutropenia febril = antibiótico imediato.
- **Eosinófilo** → helmintos e alergia; **basófilo/mastócito** → FcεRI, histamina, hipersensibilidade I.
- **Timo:** córtex (seleção positiva, restrição ao MHC) → medula (seleção negativa, AIRE, Treg). DiGeorge = sem timo.
- **Linfonodo:** córtex (B, centros germinativos), paracórtex (T, HEV), medula (plasmócitos). Recirculação: L-selectina/CCR7 para entrar, S1P para sair.
- **Baço:** polpa vermelha (filtra hemácias e bactérias opsonizadas), polpa branca (PALS-T, folículos-B), zona marginal (IgM anti-polissacarídeo). **Asplenia → encapsulados → vacinar.**
- **MALT:** células M, placas de Peyer, IgA secretora, tolerância oral.

::: referencias
Abbas, 10ª ed., caps. "Células e tecidos do sistema imune" e "Desenvolvimento dos linfócitos" · Junqueira & Carneiro, 13ª ed. · Hoffbrand, 7ª ed.
:::
