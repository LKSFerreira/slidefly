# Slidefly Roadmap

> Documento vivo do produto.
> Ultima atualizacao: 2026-03-12.
> Fonte de verdade para prioridades, gaps tecnicos e criterios de aceite da reconstrucao do Slidefly.

---

## 1. Norte do Produto

| Item | Definicao |
|---|---|
| Produto | Slidefly |
| Objetivo | Transformar CSVs de demandas em apresentacoes profissionais, navegaveis e exportaveis direto no navegador |
| Escopo funcional | Upload de CSV, configuracao visual, preview, apresentacao completa, exportacao PDF e PPTX |
| Diretriz tecnica | Processamento 100% client-side, sem banco de dados e sem dependencia obrigatoria de backend |
| Stack encontrada no codigo | React + Vite + TypeScript |
| Deploy alvo | Vercel |
| Fonte de verdade | `PRD.md` + codigo atual do repositorio |

---

## 2. Diagnostico Atual

### O que ja existe

- Upload de arquivo CSV na landing.
- Parsing basico com validacao inicial de colunas obrigatorias.
- Fluxo de configuracao com preview.
- Dois layouts disponiveis: `padrao` e `personalizado`.
- Reordenacao de slides.
- Modo apresentacao com preview unico e apresentacao completa.
- Exportacao para PDF e PPTX.

### Gaps ja identificados

| Area | Estado atual | Impacto |
|---|---|---|
| ~~Identidade do produto~~ | ~~Ainda existem referencias antigas como `react-example` e `AutoReport Web`~~ | ~~Marca inconsistente no codigo e na interface~~ |
| Identidade do produto | [x] Nome oficial `Slidefly` alinhado em codigo, metadados e documentacao visivel | Ajuste concluido e mantido no historico do roadmap |
| Roadmap | Arquivo atual estava vazio | Falta de rastreabilidade e prioridade clara |
| Dados | Nao existe fluxo de correcao leve sem recarregar todo o CSV | Ajustes pequenos ficam caros e lentos |
| Tratamento antes do gerador | Parsing atual faz apenas mapeamento basico | Risco de lixo visual, textos ruins e dados mal formatados |
| Layout `Personalizado` | Move blocos, mas ainda nao cobre bem renomeacao, adaptacao automatica e regras de densidade | Experiencia incompleta frente ao PRD |
| Layout `Padrao` | Grade fixa e pouca adaptacao para campos vazios ou textos longos | Espaco mal aproveitado e menor legibilidade |
| Preview x apresentacao | Preview do configurador e apresentacao usavam escalas diferentes | Ajuste visual no configurador nao refletia o slide final |
| Exportacao PDF | Fluxo depende de render oculto com espera fixa | Ponto provavel de travamento com lotes maiores |
| Exportacao PPTX | Saida simplificada e pouco fiel ao preview | Diferenca entre o que o usuario ve e o que exporta |
| ~~Stack declarada x real~~ | ~~Regras do agente estavam em `JavaScript`, mas o projeto real estava em `TypeScript`~~ | ~~Divergencia de documentacao e convencoes~~ |
| Stack declarada x real | [x] Documentacao oficial alinhada para `TypeScript` em `AGENTS.md` e `/.agents/rules/typescript.md` | Divergencia resolvida e mantida no historico do roadmap |
| ~~Escopo tecnico~~ | ~~Existem dependencias fora do escopo client-side, como `express` e `better-sqlite3`~~ | ~~Complexidade desnecessaria e ruido arquitetural~~ |
| Escopo tecnico | [x] Auditoria realizada e dependencias fora do escopo inicial classificadas para remocao | Limpeza tecnica iniciada com historico preservado |

---

## 3. Prioridades Imediatas

1. Consolidar a identidade `Slidefly` no codigo e nos metadados.
2. Criar uma camada de tratamento e edicao leve de dados antes do gerador de apresentacao.
3. Evoluir o motor de layout para aproveitar melhor espaco, ocultar vazios e suportar configuracao mais flexivel.
4. Estabilizar a exportacao PDF e PPTX para evitar travamentos e reduzir diferencas com o preview.
5. Melhorar responsividade e densidade visual para cenarios reais de uso.

---

## 4. Roadmap por Fases

### Fase 0 - Baseline e Identidade

**Objetivo**
Alinhar o repositorio com a identidade oficial do produto e remover ruido herdado do projeto antigo.

**Entregas**

- [x] Corrigir o nome do produto para `Slidefly` em codigo, interface, metadados e documentacao visivel.
- [x] Revisar `package.json`, `metadata.json`, `Landing.tsx` e `README.md` para alinhar os textos visiveis ao usuario.
- [x] Confirmar `TypeScript` como stack oficial do projeto.
- [x] Alinhar `AGENTS.md`, `code.md` e `/.agents/rules/typescript.md` com a stack efetivamente adotada.
- [x] Mapear dependencias fora do escopo client-side e classificar a remocao de `express`, `@types/express`, `better-sqlite3`, `dotenv` e `@google/genai`.

**Criterios de saida**

- O nome `Slidefly` aparece de forma consistente em toda a aplicacao.
- Nao restam referencias visiveis ao nome antigo.
- A stack do projeto fica documentada sem contradicoes.

### Fase 1 - Dados, Parsing e Edicao Leve

**Objetivo**
Permitir que o usuario trate os dados com agilidade antes de gerar a apresentacao, sem precisar reimportar o CSV inteiro por pequenos ajustes.

**Entregas**

- [x] Criar uma camada central de normalizacao de registros antes do preview, apresentacao e exportacoes.
- [ ] Permitir pequenos ajustes pontuais por slide e por campo sem recarregar todo o CSV.
- [ ] Permitir correcoes gramaticais e ajustes manuais de conteudo dentro da aplicacao.
- [x] Padronizar limpeza de espacos e quebras, remover prefixo numerico da fase e aplicar fallbacks configuraveis para prioridade e campos curtos.
- [ ] Fortalecer o mapeamento de colunas com aliases e nomes equivalentes.
- [ ] Garantir que campos vazios nao gerem blocos vazios no layout nem na exportacao.
- [x] **[Feedback User]** Implementar resiliencia no parsing de CSV para identificar e pular linhas de lixo antes do cabecalho (usando regex e suportando `,` e `;`).

**Criterios de saida**

- O usuario consegue corrigir um unico registro sem nova importacao.
- O estado editado permanece consistente no preview, apresentacao e exportacoes.
- O gerador recebe dados sanitizados e previsiveis.

### Fase 2 - Layout, Conteudo e Personalizacao

**Objetivo**
Tornar os layouts mais inteligentes, legiveis e adaptativos ao conteudo real de cada slide.

**Entregas**

- [ ] Permitir mover blocos e colunas no layout `Personalizado`.
- [ ] Permitir renomear colunas ou rotulos visuais no layout `Personalizado`.
- [ ] Centralizar o conteudo e alinhar os blocos no meio quando a composicao pedir esse comportamento.
- [x] Aplicar limite maximo de configuracao para fonte: titulo `22` e texto `22`.
- [x] **[Feedback User]** Aumentar o limite do tamanho do texto (conteudo) para `40`.
- [x] **[Feedback User]** Centralizar o conteudo das colunas: `Ações Realizadas`, `Próximas Atividades` e `Problemas Pendentes`.
- [ ] Ocultar automaticamente blocos sem conteudo util.
- [x] Redistribuir largura e altura do layout `Padrao` conforme a densidade de texto, usando auto-reducao de fonte apenas como ultimo recurso.
- [ ] Fazer colunas com pouco ou nenhum conteudo ocuparem menos espaco ou nenhum espaco.
- [ ] Garantir que o layout configurado seja reaplicado aos demais slides com previsibilidade.

**Criterios de saida**

- O layout `Personalizado` reflete as configuracoes de reposicionamento e rotulos no preview.
- O layout `Padrao` aproveita melhor o espaco quando houver campos vazios.
- Slides com mais densidade textual recebem mais area util sem quebrar a hierarquia visual.

### Fase 3 - Exportacao PDF/PPTX e Estabilidade

**Objetivo**
Eliminar travamentos e aproximar a exportacao final da experiencia vista no preview.

**Entregas**

- [ ] Investigar travamentos na exportacao de PDF.
- [ ] Investigar travamentos na exportacao de PPTX.
- [ ] Remover dependencias de espera fixa onde isso gerar fragilidade.
- [ ] Exibir estado de progresso ou bloqueio controlado durante a exportacao.
- [ ] **[Feedback User]** Melhorar feedback visual durante a exportacao e impedir disparo duplo/concorrente de PDF/PPTX.
- [ ] **[Feedback User]** Corrigir perda de padding/espacamento no cabecalho e colunas durante a exportacao para PDF e PPTX (texto "grudado").
- [ ] **[Feedback User]** Otimizar performance de exportacao para grandes volumes (80+ slides), reduzindo tempo de processamento.
- [ ] Garantir que PDF e PPTX respeitem ordem final, paleta, ocultacao de vazios e conteudo tratado.
- [ ] Definir estrategia clara para exportar o layout `Personalizado` com fidelidade aceitavel no PPTX.

**Criterios de saida**

- A exportacao funciona sem travamento em um lote representativo de slides.
- O arquivo exportado respeita a ordem final definida pelo usuario.
- O usuario percebe consistencia entre preview, apresentacao e arquivos gerados.

### Fase 4 - UX, Responsividade e Fluxo de Revisao

**Objetivo**
Melhorar legibilidade, uso do espaco e conforto operacional no configurador e na apresentacao.

**Entregas**

- [ ] Aplicar responsividade para aproveitar melhor o espaco horizontal e vertical.
- [ ] Ajustar sidebar, preview e lista de slides para cenarios com muitos dados.
- [ ] Melhorar a navegacao entre slides e a preservacao de contexto apos reordenacao.
- [x] **[Feedback User]** Melhorar o feedback e o reset de estado quando um arquivo invalido (nao CSV) e carregado, permitindo nova tentativa sem recarregar a pagina.
- [x] **[Feedback User]** Usar o nome do arquivo da imagem como titulo do slide no painel lateral ao carregar capas ou transicoes.
- [ ] **[Feedback User]** Remover prefixo "IMAGEM: " do titulo do card de slides de imagem.
- [ ] **[Feedback User]** Habilitar upload multiplo de imagens para capas e transicoes.
- [ ] Revisar estados vazios, mensagens inline e feedback visual do fluxo.
- [x] Unificar o canvas 16:9 do preview e da apresentacao para manter escala proporcional entre modos.
- [x] Adicionar zoom de visualizacao discreto no preview do configurador sem alterar a fonte nem o layout real do slide.
- [ ] Refinar a experiencia de preview unico versus apresentacao completa.

**Criterios de saida**

- A interface continua usavel em telas menores sem desperdicarem espaco.
- A area principal de preview permanece dominante e clara.
- O fluxo de revisao fica mais rapido e previsivel para o usuario.

### Fase 5 - Limpeza Tecnica, Validacao e Release

**Objetivo**
Fechar o ciclo de reconstrucao com menos ruido tecnico e mais previsibilidade para deploy.

**Entregas**

- [x] Remover o primeiro lote seguro de dependencias fora do escopo: `express`, `@types/express`, `better-sqlite3`, `dotenv` e `@google/genai`.
- [x] Mover `@vitejs/plugin-react` para `devDependencies`.
- [x] Remover dependencias e artefatos fora do escopo definido do produto em lotes seguros e validar o impacto no build (clsx, tailwind-merge, tsx, autoprefixer).
- [ ] Revisar build, lint e consistencia geral do projeto.
- [ ] Validar cenarios reais com CSVs representativos.
- [ ] Atualizar documentacao minima de uso e manutencao.
- [ ] Preparar o projeto para deploy estatico na Vercel.

**Criterios de saida**

- O projeto compila de forma previsivel.
- O escopo tecnico fica coerente com o PRD.
- O repositorio fica pronto para ciclos menores de entrega.

---

## 5. Feedback User (Priorizado)

Sessao dedicada aos feedbacks diretos do usuario para implementacao imediata ou organizada por prioridade técnica.

| ID | Descricao | Fase | Prioridade | Status |
|---|---|---|---|---|
| FB01 | **Resiliencia no Parsing de CSV:** Identificar linha de cabecalho pulando lixo inicial (Regex + suporte a `,` e `;`). | Fase 1 | P1 | [x] Concluido |
| FB02 | **Recuperacao de Erro no Upload:** Resolver trava de estado que exige reload ao subir arquivo invalido. | Fase 4 | P1 | [x] Concluido |
| FB03 | **Nome da Imagem como Titulo:** Exibir nome do arquivo original no botao do slide em vez de "IMAGEM". | Fase 4 | P2 | [x] Concluido |
| FB04 | **Centralizacao de Conteudo:** Centralizar texto de Acoes, Proximas Atividades e Problemas. | Fase 2 | P2 | [x] Concluido |
| FB05 | **Aumento de Limite de Fonte:** Permitir que o tamanho do conteudo chegue ate `40` (atual 30). | Fase 2 | P2 | [x] Concluido |
| FB06 | **Remocao de Prefixo IMAGEM:** Exibir apenas o nome do arquivo no card, sem o prefixo "IMAGEM: ". | Fase 4 | P2 | [x] Concluido |
| FB07 | **Upload Multiplo de Imagens:** Permitir carregar varias imagens de uma vez para capas/transicoes. | Fase 4 | P1 | [x] Concluido |
| FB08 | **Fidelidade de Espacamento na Exportacao:** Corrigir perda de padding/layout no PDF e PPTX (texto "grudado"). | Fase 3 | P1 | [ ] Pendente |
| FB09 | **Performance de Exportacao:** Reduzir tempo de geracao para volumes altos (80+ slides). | Fase 3 | P1 | [ ] Pendente |
| FB10 | **Feedback de Exportacao e Trava Visual:** Melhorar estados de carregamento e evitar clique duplo em PDF/PPTX. | Fase 3 | P1 | [ ] Pendente |

---

## 6. Backlog Priorizado

| Prioridade | Tema | Resultado esperado |
|---|---|---|
| P0 | Nome oficial `Slidefly` | Nenhuma referencia antiga visivel no produto |
| P0 | Roadmap e baseline | Documento vivo sincronizado com PRD e codigo |
| P1 | **[FB08/09]** Estabilidade Exportacao | Fidelidade de padding e performance em lotes grandes |
| P1 | **[FB10]** UX Exportacao | Feedback claro de processamento e trava de botoes |
| P1 | **[FB07]** Upload Multiplo | Agilidade na inclusao de capas e transicoes |
| P1 | **[FB01]** Resiliencia CSV | Parsing robusto mesmo com lixo no inicio do arquivo |
| P1 | **[FB02]** Reset de Upload | Fluxo de erro amigavel sem necessidade de F5 |
| P1 | Edicao leve de dados | Pequenas correcoes sem reimportar CSV |
| P1 | Tratamento de dados | Conteudo saneado antes do gerador |
| P1 | Exportacao estavel | PDF e PPTX sem travamento evidente |
| P1 | Layout `Personalizado` | Blocos moviveis, renomeaveis e reaplicaveis |
| P2 | **[FB04/05]** Refino Layout | Centralizacao de colunas e fonte ate 40 |
| P2 | **[FB03/06]** UX Imagens | Nomes de arquivos limpos e preservados na lista de slides |
| P2 | Responsividade adaptativa | Espaco redistribuido conforme densidade de texto |
| P2 | Limpeza tecnica | Dependencias fora do escopo removidas ou justificadas |

---

## 7. Riscos Abertos

| Risco | Impacto | Direcao de tratamento |
|---|---|---|
| Exportacao do layout `Personalizado` para PPTX | Alta chance de baixa fidelidade visual | Criar adaptador proprio ou documentar limites aceitaveis |
| Renderizacao PDF baseada em espera fixa | Travamento ou arquivo incompleto em lotes maiores | Trocar por fluxo deterministico de render/export |
| Dependencias fora do escopo do PRD | [x] Auditoria concluida e primeira limpeza aprovada | Prosseguir com remocoes seguras e validacao tecnica |

---

## 8. Decisoes em Aberto

- [x] `TypeScript` confirmado como stack oficial do projeto.
- [ ] Definir o nivel de fidelidade exigido do `PPTX` para o layout `Personalizado`.
- [x] Regra fechada para o layout atual: titulo `22`, texto `22` (ajustado para 40 conforme feedback) e auto-reducao de fonte apenas quando a redistribuicao de espaco nao resolver.

---

## 9. Definicao de Pronto para o Proximo Marco

O proximo marco relevante do Slidefly sera considerado pronto quando:

- o nome do produto estiver corrigido no codigo e na interface;
- o roadmap estiver sendo usado como referencia real de trabalho;
- houver tratamento e edicao leve de dados antes do gerador;
- os feedbacks criticos de parsing e reset de upload estiverem implementados;
- os layouts reagirem melhor a campos vazios e textos longos;
- PDF e PPTX funcionarem sem travamentos evidentes;
- a aplicacao estiver mais coerente com o PRD e com o escopo client-side.
