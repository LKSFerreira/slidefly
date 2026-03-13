# Walkthrough: Correção do Travamento de Exportação (PDF/PPTX)

## O Problema
O feedback `FB14` reportava um problema crítico onde a exportação não concluía, mesmo com apresentações de poucos slides. A exportação travava indefinidamente, impedindo o usuário de gerar os arquivos finais.

## A Causa Raiz
A falha ocorria devido a dois comportamentos combinados dentro de `src/utils/capturarSlidesComoImagens.tsx`:
1. **Pausa em background:** A função `aguardarFrame` usava exclusivamente o `requestAnimationFrame`, que é pausado ou severamente estrangulado pelos navegadores quando o usuário muda de aba, travando o progresso da captura.
2. **Loop de instabilidade microscópica:** A função `aguardarLayoutEstavel` exigia 4 frames seguidos de precisão exata nas dimensões (`scrollHeight`/`scrollWidth`) sem limite de tentativas. Qualquer oscilação fracionária causada por renderização deixaria a aplicação presa em um loop infinito.

## A Solução Implementada

Para resolver esses pontos, foram aplicados fallbacks de segurança:

1. **Timeout Híbrido:**
Na função `aguardarFrame`, foi adicionado um `setTimeout(finalizar, 50)` competindo com o `requestAnimationFrame`. Com isso, mesmo que a aba vá para background e o navegador silencie as animações, a exportação continua avançando garantidamente a cada 50ms.

2. **Limite de Tentativas:**
Na função `aguardarLayoutEstavel`, foi adicionada uma trava de segurança (`const maxTentativas = 40`). Se após 40 ciclos o layout não reportar estabilidade "perfeita", a execução força a sequência do fluxo, evitando travamentos eternos por divergências irrisórias nos pixels do navegador.

## Arquivos Afetados
- `src/utils/capturarSlidesComoImagens.tsx`: Correção de lógica em `aguardarFrame` e `aguardarLayoutEstavel`.
- `.metadocs/roadmap.md`: Atualização do status do item FB14 para `[x] Concluido`.