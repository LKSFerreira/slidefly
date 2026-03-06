---
trigger: model_decision
description: Convencoes TypeScript, estrutura de projeto, nomenclatura, testes e formatacao com ESLint/Prettier.
---

# Regras para TypeScript:

## 1: Runtime e Versao
- **Node.js**: 20.x LTS (ou superior).
- **Package Manager**: npm por padrao. Se houver lock alternativo, siga o arquivo oficial do repositorio.
- **TypeScript**: Assuma `strict: true` como diretriz do projeto. Priorize tipagem estatica, evite `any` e prefira tipos explicitos quando a inferencia nao for suficiente.

## 2: Estrutura de Projeto
A estrutura pode variar conforme frontend ou backend. Adapte-se ao contexto real.

**Exemplo Frontend (React/Vite):**
```text
src/
|-- components/     # Componentes visuais
|-- services/       # Logica de negocio e chamadas de API
|-- hooks/          # Custom hooks
|-- types/          # Tipagens globais
`-- utils/          # Funcoes utilitarias
```

**Exemplo Backend (Node.js):**
```text
src/
|-- controllers/    # Lida com requisicoes e respostas
|-- services/       # Regras de negocio
|-- routes/         # Definicao de rotas
|-- models/         # Tipos, contratos e modelos
`-- utils/          # Funcoes utilitarias
```

## 3: Convencoes de Codigo

### Nomenclatura (Sempre em pt-BR)
- **Variaveis e funcoes**: camelCase (`calcularTotal`, `usuarioAtual`).
- **Componentes React**: PascalCase (`FormularioProduto`, `ListaCarrinho`).
- **Constantes**: SCREAMING_SNAKE_CASE (`CHAVE_STORAGE`, `URL_API`).
- **Tipos, interfaces e aliases**: PascalCase sem prefixos (`Produto`, `UsuarioProps`).

### Tipagem
- Prefira `type` ou `interface` de forma consistente com o contexto do arquivo.
- Nao use `any` sem justificativa tecnica real.
- Modele unions e literais para estados previsiveis da aplicacao.
- Tipos compartilhados devem ficar centralizados em `src/types/` quando fizer sentido.
- Props de componentes devem ser nomeadas com clareza e evitar estruturas anonimas extensas inline.

### Declaracao e Assincronicidade
- Use `const` por padrao. Use `let` apenas quando houver reatribuicao.
- Nunca use `var`.
- Priorize `async/await` com `try/catch`.
- Prefira `function` para exports nomeados reutilizaveis e arrow functions para callbacks e handlers locais.

### Imports
- Use imports absolutos quando a configuracao do projeto suportar.
- Ordem de agrupamento: bibliotecas externas -> modulos internos -> utils -> tipos.

## 4: Testes
- **Framework**: Vitest para projetos Vite, salvo decisao formal contraria.
- **Nomenclatura**: `<arquivo>.test.ts`, `<arquivo>.test.tsx`, `<arquivo>.spec.ts` ou `<arquivo>.spec.tsx`.
- **Cobertura**: priorizar comportamento, regras de negocio e transformacoes de dados.

## 5: Formatacao e Linting
- Respeite `.prettierrc`, `eslint.config.js` ou equivalentes quando existirem.
- Na ausencia de configuracao formal, use ponto e virgula e aspas simples.
- Corrija warnings de tipagem e imports nao utilizados durante a implementacao.

## 6: Ambiente de Desenvolvimento
- **Dev Container**: Docker Compose com Node.js, conforme as regras do projeto.
- **Variaveis de Ambiente**: use arquivos de ambiente apropriados por contexto e nunca versione segredos reais.
- **Hot Reload**: manter via Vite, `tsx watch` ou ferramenta equivalente do stack atual.

## 7: Documentacao
- Use **TSDoc/JSDoc** em funcoes publicas, contratos e trechos com regra de negocio relevante.
- Comentarios devem explicar o por que de decisoes nao obvias.
- Mantenha `README.md` e `.metadocs/` coerentes com a stack real do projeto.
