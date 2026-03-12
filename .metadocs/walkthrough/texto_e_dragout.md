# Walkthrough: Quebras de Linha e Exclusão Drag-out

## Objetivo

Implementar preservação de quebras de linha em textos vindos do CSV (FB11) e exclusão de blocos por drag-out no layout Personalizado (FB12).

## Contexto

1. **FB11 (Quebras de Linha):** Os blocos de texto (Descrição, Ações, etc.) não estavam respeitando a formatação original do CSV porque a função de normalização de dados filtrava as quebras e colapsava os espaços em branco de forma agressiva.
2. **FB12 (Excluir por Drag-out):** O layout `Personalizado` precisava de uma forma ágil de remover blocos não utilizados pelo usuário. O método natural desejado era arrastar o bloco para fora do layout.

## O que foi feito

1. **[FB11] Suporte a Quebras de Linha** (`src/config/regrasSlide.ts`):
   - A função `limparTextoLongo` foi ajustada. A chamada `.filter(Boolean)` (que removia linhas em branco entre parágrafos) foi retirada. 
   - A string agora é reunida fielmente com `join('\n')` e as sobras nas extremidades são eliminadas com `trim()`, preservando a intenção de formatação original da planilha em campos multilinhas.

2. **[FB12] Exclusão por Drag-out** (`src/components/templates/Personalizado.tsx`):
   - Adicionado o evento `onDragStop` no componente `ResponsiveGridLayout`.
   - Incluída uma referência (`useRef`) ao contêiner pai para capturar os limites reais via `getBoundingClientRect()`.
   - Adicionada detecção inteligente via API de eventos (suportando mouse e touch) comparando `clientX`/`clientY` com os limites do container, com uma margem de tolerância.
   - Caso o bloco seja solto fora dos limites, ele é removido nativamente do estado atual de `layout`.
   - Esta abordagem com `clientX` é imune a quebras causadas pelo zoom do navegador, mantendo a previsibilidade exigida.

## Resultado

- Os parágrafos extraídos de CSVs complexos agora quebram corretamente dentro dos limites do CSS `whitespace-pre-wrap` sem perder o estilo do texto.
- O usuário agora possui um fluxo de deleção de blocos orgânico e flexível, bastando empurrá-los para fora do quadro customizável para sumirem.

## Observações

- Atualizado `roadmap.md` com status concluído.
- Mantida a estrutura intacta no `csvParser.ts`, focando apenas na lógica da inteligência de limpeza.
