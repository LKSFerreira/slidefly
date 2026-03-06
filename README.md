# Slidefly

Aplicacao web para transformar CSVs de demandas em apresentacoes profissionais, navegaveis e exportaveis direto no navegador.

## Visao Geral

- Upload de CSV com validacao basica
- Preview e configuracao de slides
- Layouts `padrao` e `personalizado`
- Reordenacao manual dos slides
- Exportacao para PDF e PPTX
- Processamento client-side

## Stack

- React
- Vite
- TypeScript
- PapaParse
- html2pdf.js
- PptxGenJS

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Docker

O fluxo oficial de desenvolvimento deste projeto usa Docker Compose com os arquivos em `.docker/`.

### Subir o ambiente

```bash
bash dev.sh
```

### Rebuild do ambiente

Use quando houver alteracao de Dockerfile, imagem base ou dependencia de sistema:

```bash
bash dev.sh --build
```

### Instalar dependencias no container

Com o ambiente ja rodando, instale dependencias sempre no container `app`:

```bash
docker compose -f .docker/compose.yaml exec app npm install <pacote>
docker compose -f .docker/compose.yaml exec app npm install -D <pacote>
```

### Regra importante

Nao use `npm install` no host para corrigir problema de runtime do ambiente Docker.

## Status Atual

O projeto esta em reconstrucao guiada por `PRD.md` e `/.metadocs/roadmap.md`.

As prioridades atuais incluem:

- consolidar a identidade do produto
- melhorar o tratamento dos dados antes do gerador
- evoluir layouts e responsividade
- estabilizar exportacoes PDF e PPTX

## Referencias

- [PRD.md](PRD.md)
- [.metadocs/roadmap.md](.metadocs/roadmap.md)
