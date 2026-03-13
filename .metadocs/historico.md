# Historico

## 2026-03-06

- [Limpeza inicial de dependencias fora do escopo e validacao via Docker](.metadocs/walkthrough/limpeza_dependencias.md): removeu `express`, `@types/express`, `better-sqlite3`, `dotenv` e `@google/genai`, moveu `@vitejs/plugin-react` para `devDependencies`, sincronizou o `package-lock.json` no container e validou a tipagem com `npm run lint`.

## 2026-03-12

- [Feedbacks UX e Parsing](.metadocs/walkthrough/feedbacks_ux_parsing.md): implementou resiliência no parsing de CSV ignorando lixo inicial, melhorou a recuperação de erro no upload, passou a exibir o nome original de imagens adicionadas, centralizou o texto nas colunas de acompanhamento e aumentou o limite de tamanho da fonte de conteúdo para 40.
- [Melhorias de Upload e Exibição de Imagens](.metadocs/walkthrough/melhorias_upload_imagens.md): removeu o prefixo "IMAGEM: " na listagem de slides lateral, habilitou o upload múltiplo de imagens para capas/transições, refatorou a leitura para `Promise.all` e corrigiu tipagem do estado para evitar *race conditions*.
- [Quebras de Linha e Exclusão Drag-out](.metadocs/walkthrough/texto_e_dragout.md): removeu filtro restritivo na normalização de dados para preservar quebras de linha (`\n`) do CSV em textos longos e implementou detecção de coordenadas e limites imune a zoom do navegador para exclusão ágil de blocos arrastados para fora do Layout Personalizado.
- [Exclusão de Slide via Drag & Drop](.metadocs/walkthrough/exclusao_slide_dnd.md): adicionou exclusão dos slides na lista lateral ao arrastá-los para fora ('destination' undefined), ajustando o preview dinâmico para evitar quebras e removendo os flashes visuais do drop com animação (`isDropAnimating`).

## 2026-03-13

- [Correção do Travamento de Exportação](.metadocs/walkthrough/correcao_exportacao_pdf_pptx.md): implementou fallbacks de segurança em `aguardarFrame` (timeout para backgrounds) e `aguardarLayoutEstavel` (limite de tentativas) para evitar loop infinito e pausas de navegador que impediam a conclusão da exportação (PDF e PPTX).
