# Historico

## 2026-03-06

- [Limpeza inicial de dependencias fora do escopo e validacao via Docker](.metadocs/walkthrough/limpeza_dependencias.md): removeu `express`, `@types/express`, `better-sqlite3`, `dotenv` e `@google/genai`, moveu `@vitejs/plugin-react` para `devDependencies`, sincronizou o `package-lock.json` no container e validou a tipagem com `npm run lint`.

## 2026-03-12

- [Feedbacks UX e Parsing](.metadocs/walkthrough/feedbacks_ux_parsing.md): implementou resiliência no parsing de CSV ignorando lixo inicial, melhorou a recuperação de erro no upload, passou a exibir o nome original de imagens adicionadas, centralizou o texto nas colunas de acompanhamento e aumentou o limite de tamanho da fonte de conteúdo para 40.

