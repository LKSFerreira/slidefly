# Historico

## 2026-03-06

- [Limpeza inicial de dependencias fora do escopo e validacao via Docker](.metadocs/walkthrough/limpeza_dependencias.md): removeu `express`, `@types/express`, `better-sqlite3`, `dotenv` e `@google/genai`, moveu `@vitejs/plugin-react` para `devDependencies`, sincronizou o `package-lock.json` no container e validou a tipagem com `npm run lint`.
