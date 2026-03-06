# Walkthrough: Limpeza de Dependencias

## Objetivo

Executar a primeira limpeza segura de dependencias fora do escopo client-side do Slidefly, mantendo o repositrio coerente com o PRD e com o fluxo Docker oficial do projeto.

## Contexto

O `package.json` continha dependencias herdadas de um projeto anterior que nao possuem uso no codigo atual e nao fazem sentido para uma SPA client-side sem backend e sem banco de dados.

Dependencias auditadas como fora do escopo:

- `express`
- `@types/express`
- `better-sqlite3`
- `dotenv`
- `@google/genai`

Ajuste estrutural adicional:

- `@vitejs/plugin-react` foi movido de `dependencies` para `devDependencies`

## O que foi feito

1. Foi realizada uma auditoria de uso real das dependencias no codigo.
2. O `package.json` foi atualizado para remover o grupo fora do escopo.
3. O `package-lock.json` foi sincronizado usando Docker, conforme a regra do projeto.
4. A validacao foi executada no container com:

```bash
docker compose -f .docker/compose.yaml run --rm app sh -lc "npm install && npm run lint"
```

5. O `roadmap.md` foi atualizado preservando historico com `~~ ~~` e `[x]`.

## Resultado

- O projeto ficou mais alinhado ao escopo client-side do Slidefly.
- O lockfile foi atualizado sem recorrer a instalacao no host.
- A checagem de tipagem executou com sucesso no container.

## Observacoes

- Ainda existem dependencias suspeitas ou potencialmente herdadas para uma segunda rodada de limpeza, como `clsx`, `tailwind-merge`, `tsx` e `autoprefixer`.
- A limpeza futura deve continuar em lotes pequenos para reduzir risco de regressao.
