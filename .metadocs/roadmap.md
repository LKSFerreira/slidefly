# Slidefly Roadmap

> Documento vivo do produto.
> Ultima atualizacao: 2026-03-06.
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
| Identidade do produto | Ainda existem referencias antigas como `react-example` e `AutoReport Web` | Marca inconsistente no codigo e na interface |
| Roadmap | Arquivo atual estava vazio | Falta de rastreabilidade e prioridade clara |
| Dados | Nao existe fluxo de correcao leve sem recarregar todo o CSV | Ajustes pequenos ficam caros e lentos |
| Tratamento antes do gerador | Parsing atual faz apenas mapeamento basico | Risco de lixo visual, textos ruins e dados mal formatados |
| Layout `Personalizado` | Move blocos, mas ainda nao cobre bem renomeacao, adaptacao automatica e regras de densidade | Experiencia incompleta frente ao PRD |
| Layout `Padrao` | Grade fixa e pouca adaptacao para campos vazios ou textos longos | Espaco mal aproveitado e menor legibilidade |
| Exportacao PDF | Fluxo depende de render oculto com espera fixa | Ponto provavel de travamento com lotes maiores |
| Exportacao PPTX | Saida simplificada e pouco fiel ao preview | Diferenca entre o que o usuario ve e o que exporta |
| Stack declarada x real | Regras do agente estao em `JavaScript`, mas o projeto atual esta em `TypeScript` | Divergencia de documentacao e convencoes |
| Escopo tecnico | Existem dependencias fora do escopo client-side, como `express` e `better-sqlite3` | Complexidade desnecessaria e ruido arquitetural |

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

- [ ] Corrigir o nome do produto para `Slidefly` em codigo, interface, metadados e documentacao.
- [ ] Revisar `package.json`, `metadata.json`, landing page, textos visiveis e arquivos auxiliares expostos ao usuario.
- [ ] Confirmar se o projeto seguira em `TypeScript` ou se havera migracao real para `JavaScript`.
- [ ] Alinhar `AGENTS.md`, regras de linguagem e documentacao tecnica com a stack efetivamente adotada.
- [ ] Mapear dependencias fora do escopo client-side e classificar o que deve ser removido.

**Criterios de saida**

- O nome `Slidefly` aparece de forma consistente em toda a aplicacao.
- Nao restam referencias visiveis ao nome antigo.
- A stack do projeto fica documentada sem contradicoes.

### Fase 1 - Dados, Parsing e Edicao Leve

**Objetivo**
Permitir que o usuario trate os dados com agilidade antes de gerar a apresentacao, sem precisar reimportar o CSV inteiro por pequenos ajustes.

**Entregas**

- [ ] Criar uma camada de normalizacao de dados antes do gerador de apresentacao.
- [ ] Permitir pequenos ajustes pontuais por slide e por campo sem recarregar todo o CSV.
- [ ] Permitir correcoes gramaticais e ajustes manuais de conteudo dentro da aplicacao.
- [ ] Padronizar limpeza de espacos extras, quebras desnecessarias e valores vazios.
- [ ] Fortalecer o mapeamento de colunas com aliases e nomes equivalentes.
- [ ] Garantir que campos vazios nao gerem blocos vazios no layout nem na exportacao.

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
- [ ] Aplicar limite maximo de configuracao para fonte: titulo `22` e texto `20`.
- [ ] Ocultar automaticamente blocos sem conteudo util.
- [ ] Redistribuir largura e altura para aproveitar melhor areas com mais texto.
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
- [ ] Revisar estados vazios, mensagens inline e feedback visual do fluxo.
- [ ] Refinar a experiencia de preview unico versus apresentacao completa.

**Criterios de saida**

- A interface continua usavel em telas menores sem desperdicarem espaco.
- A area principal de preview permanece dominante e clara.
- O fluxo de revisao fica mais rapido e previsivel para o usuario.

### Fase 5 - Limpeza Tecnica, Validacao e Release

**Objetivo**
Fechar o ciclo de reconstrucao com menos ruido tecnico e mais previsibilidade para deploy.

**Entregas**

- [ ] Remover dependencias e artefatos fora do escopo definido do produto.
- [ ] Revisar build, lint e consistencia geral do projeto.
- [ ] Validar cenarios reais com CSVs representativos.
- [ ] Atualizar documentacao minima de uso e manutencao.
- [ ] Preparar o projeto para deploy estatico na Vercel.

**Criterios de saida**

- O projeto compila de forma previsivel.
- O escopo tecnico fica coerente com o PRD.
- O repositorio fica pronto para ciclos menores de entrega.

---

## 5. Backlog Priorizado

| Prioridade | Tema | Resultado esperado |
|---|---|---|
| P0 | Nome oficial `Slidefly` | Nenhuma referencia antiga visivel no produto |
| P0 | Roadmap e baseline | Documento vivo sincronizado com PRD e codigo |
| P1 | Edicao leve de dados | Pequenas correcoes sem reimportar CSV |
| P1 | Tratamento de dados | Conteudo saneado antes do gerador |
| P1 | Exportacao estavel | PDF e PPTX sem travamento evidente |
| P1 | Layout `Personalizado` | Blocos moviveis, renomeaveis e reaplicaveis |
| P2 | Limites visuais | Titulo ate 22 e texto ate 20 dentro da regra definida |
| P2 | Responsividade adaptativa | Espaco redistribuido conforme densidade de texto |
| P2 | Limpeza tecnica | Dependencias fora do escopo removidas ou justificadas |

---

## 6. Riscos Abertos

| Risco | Impacto | Direcao de tratamento |
|---|---|---|
| Divergencia entre `JavaScript` e `TypeScript` | Regras e implementacao podem seguir em sentidos diferentes | Decidir stack oficial e alinhar a documentacao |
| Exportacao do layout `Personalizado` para PPTX | Alta chance de baixa fidelidade visual | Criar adaptador proprio ou documentar limites aceitaveis |
| Renderizacao PDF baseada em espera fixa | Travamento ou arquivo incompleto em lotes maiores | Trocar por fluxo deterministico de render/export |
| Dependencias fora do escopo do PRD | Complexidade desnecessaria e manutencao mais cara | Revisar necessidade real e remover o excedente |

---

## 7. Decisoes em Aberto

- [ ] Confirmar a stack oficial do projeto: manter `TypeScript` ou migrar de fato para `JavaScript`.
- [ ] Definir o nivel de fidelidade exigido do `PPTX` para o layout `Personalizado`.
- [ ] Validar se a regra `titulo 22 / texto 20` sera tratada apenas como limite de fonte ou se tambem exigira truncamento de conteudo.

---

## 8. Definicao de Pronto para o Proximo Marco

O proximo marco relevante do Slidefly sera considerado pronto quando:

- o nome do produto estiver corrigido no codigo e na interface;
- o roadmap estiver sendo usado como referencia real de trabalho;
- houver tratamento e edicao leve de dados antes do gerador;
- os layouts reagirem melhor a campos vazios e textos longos;
- PDF e PPTX funcionarem sem travamentos evidentes;
- a aplicacao estiver mais coerente com o PRD e com o escopo client-side.
