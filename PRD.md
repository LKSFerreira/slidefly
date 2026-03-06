📄 PRD - Product Requirements Document
Produto: Slidefly
Data: Março/2026
Versão: v2 consolidada
Status: Aprovado para reconstrução
Licença: Open Source (MIT)

# 1. Visão do Produto

## 1.1 Resumo
O Slidefly é uma aplicação web SPA que transforma arquivos CSV de demandas em apresentações interativas, profissionais e exportáveis, diretamente no navegador.

## 1.2 Problema
Transformar dados tabulares de ferramentas como Azure DevOps, Jira e planilhas em apresentações de status ainda exige trabalho manual repetitivo em PowerPoint ou ferramentas semelhantes.

## 1.3 Proposta de Valor
O Slidefly reduz esse esforço ao converter automaticamente linhas de CSV em slides visuais, permitindo configuração de layout, ordenação manual, preview individual e exportação final sem depender de back-end.

## 1.4 Diferencial
- Processamento 100% client-side.
- Nenhum dado sai do navegador.
- Sem telemetria obrigatória.
- Código aberto e auditável.
- Fluxo visual simples, rápido e orientado a apresentação.

# 2. Objetivo do Produto

Permitir que gestores, PMOs, SDMs, Tech Leads e analistas gerem apresentações executivas de status a partir de CSVs em poucos minutos, com controle suficiente para personalizar o layout, revisar slide a slide, reorganizar a ordem e exportar em PDF e PPTX.

# 3. Personas

## 3.1 Persona principal
Gestores de Projeto, PMOs, SDMs, líderes técnicos e profissionais que precisam apresentar status de demandas para stakeholders, clientes ou liderança.

## 3.2 Necessidades principais
- Importar um CSV existente sem preparação complexa.
- Transformar dados em slides automaticamente.
- Ajustar visual e ordem dos slides.
- Revisar cada slide individualmente.
- Apresentar em tela cheia.
- Exportar em formatos compartilháveis.
- Garantir privacidade total dos dados.

# 4. Escopo do MVP

## 4.1 Dentro do escopo
- Landing page com upload de CSV.
- Parsing e validação do arquivo.
- Mapeamento automático de colunas.
- Configuração visual da apresentação.
- Seleção de layout.
- Seleção de paleta de cores.
- Ordenação manual dos slides.
- Preview no configurador.
- Preview individual em modo apresentação.
- Modo apresentação completo.
- Exportação em PDF.
- Exportação em PPTX.
- Processamento 100% local no navegador.

## 4.2 Fora do escopo
- Login e autenticação.
- Banco de dados.
- Persistência em nuvem.
- Colaboração em tempo real.
- Integrações diretas via API com Jira ou Azure DevOps.
- Templates baixados de marketplace.
- Histórico de versões salvo remotamente.

# 5. Jornada do Usuário

## 5.1 Landing
O usuário acessa a aplicação e encontra uma tela única com:
- pitch do produto;
- tagline clara;
- área central de Drag & Drop;
- botão alternativo para importar `.csv`.

## 5.2 Upload e validação
Ao importar um arquivo:
- o sistema detecta o separador `,` ou `;`;
- valida o encoding;
- identifica as colunas;
- limita o processamento às colunas suportadas;
- exibe erros inline de forma orientativa.

## 5.3 Configuração
Após a importação válida, o usuário vai para a tela de configuração, onde pode:
- escolher o layout;
- escolher a paleta;
- ver preview ao vivo;
- navegar entre slides;
- reordenar slides;
- abrir preview individual;
- iniciar apresentação completa.

## 5.4 Revisão
O usuário pode revisar a apresentação antes de apresentar:
- selecionando slides específicos na lista;
- navegando pelos previews;
- ajustando a ordem;
- editando o layout personalizado;
- abrindo um único slide em modo apresentação.

## 5.5 Apresentação
O usuário pode abrir a apresentação completa em tela cheia e navegar pelos slides com teclado.

## 5.6 Exportação
Ao final da apresentação completa, o sistema oferece exportação para:
- `.pdf`
- `.pptx`

# 6. Entradas e Regras de CSV

## 6.1 Colunas suportadas
O sistema aceita CSVs com até 10 colunas mapeadas.

| # | Coluna esperada | Label no slide | Obrigatória |
|---|------------------|----------------|-------------|
| 1 | ID | ID | Sim |
| 2 | Title | Título | Sim |
| 3 | Board Column | Fase / Sprint | Não |
| 4 | Assigned To | Responsável | Não |
| 5 | Priority | Prioridade | Não |
| 6 | Description | Descrição | Não |
| 7 | Status da Demanda | Status | Não |
| 8 | Ações Realizadas | Ações | Não |
| 9 | Próximas Atividades | Próximas Atividades | Não |
| 10 | Problemas e Pendências | Problemas | Não |

## 6.2 Regras de parsing
- Separadores aceitos: `,` e `;`.
- Detecção automática do separador.
- Encoding aceito: UTF-8.
- Encoding incompatível deve gerar erro inline.
- Colunas extras devem ser ignoradas.
- Colunas ausentes devem ficar ocultas no slide.
- Campos vazios não devem renderizar blocos vazios.
- 1 linha do CSV = 1 slide.
- A ordem inicial dos slides deve seguir a ordem do CSV.

## 6.3 Regras de validação
- `ID` e `Title` são obrigatórios.
- Se uma das colunas obrigatórias não existir, o usuário não pode avançar.
- O erro deve ser exibido inline com orientação objetiva.

# 7. Templates de Layout

## 7.1 Layouts disponíveis
O sistema deve oferecer apenas 2 layouts:
- **Padrão**
- **Personalizado**

## 7.2 Renomeações oficiais
- O antigo layout `Ficha Técnica` passa a se chamar `Padrão`.
- O antigo layout `Dashboard` passa a se chamar `Personalizado`.

## 7.3 Layouts removidos
Os layouts abaixo saem do escopo do produto:
- `Tabela Resumida`
- `Minimalista`

## 7.4 Layout Padrão
Layout pronto e consistente para uso rápido, com:
- ID e Título no topo;
- badge de status/prioridade;
- blocos informacionais organizados;
- scroll interno discreto em textos longos.

## 7.5 Layout Personalizado
O layout Personalizado é um editor visual de composição do slide.

O usuário deve poder:
- arrastar blocos;
- reposicionar blocos livremente;
- redimensionar blocos;
- montar sua própria composição visual;
- ver o resultado em tempo real.

## 7.6 Regras do layout Personalizado
- Os blocos devem respeitar os limites do slide.
- O sistema deve evitar estados inválidos sempre que possível.
- Campos sem valor continuam ocultos.
- O arranjo definido no layout personalizado deve ser aplicado aos demais slides.
- O modelo do layout deve ser serializável e previsível.
- A exportação deve respeitar esse layout o máximo possível.

# 8. Tela de Configuração

## 8.1 Estrutura
Tela com split layout:
- sidebar à esquerda;
- preview principal à direita.

## 8.2 Conteúdo da sidebar
A sidebar deve conter:
- seletor de layout;
- seletor de paleta;
- lista de ordem dos slides;
- botão principal de geração/apresentação.

## 8.3 Ordem dos slides
A seção "Ordem dos Slides" deve:
- ocupar todo o espaço vertical restante da sidebar;
- ter scroll interno;
- suportar drag and drop;
- permitir reordenação fluida mesmo com muitos slides.

## 8.4 Regras de reordenação
- O usuário pode arrastar qualquer slide para outra posição.
- A nova ordem deve ser salva no estado da aplicação.
- A ordem final deve ser usada no preview, na apresentação completa, no PDF e no PPTX.
- Se o slide atualmente selecionado mudar de posição, o sistema deve preservar o contexto e continuar mostrando o mesmo slide lógico.

## 8.5 Preview principal
A área principal deve exibir o slide selecionado com:
- layout aplicado;
- paleta aplicada;
- dados reais do CSV;
- indicador de progresso do preview;
- navegação anterior/próximo.

## 8.6 Navegação no preview
O usuário pode:
- clicar em itens da lista lateral para abrir um slide específico;
- usar setas do preview para avançar ou voltar;
- ver o indicador no formato `Preview: Slide X de Y`.

## 8.7 Preview individual
Ao clicar no botão ou badge de preview do slide atual, o sistema deve abrir um modo de apresentação focado apenas naquele slide.

Nesse modo:
- apenas um slide é exibido;
- não há navegação entre slides;
- a tela final com exportação não aparece;
- o usuário pode retornar ao configurador no mesmo contexto.

# 9. Modo Apresentação

## 9.1 Apresentação completa
Ao iniciar a apresentação completa, o sistema deve:
- usar Fullscreen API;
- exibir os slides na ordem final definida;
- permitir navegação com `←` e `→`;
- mostrar indicador discreto de progresso;
- aplicar transições suaves;
- manter um controle discreto para tela cheia.

## 9.2 Slide final
Na apresentação completa, deve existir um slide final com:
- botão `Salvar como PDF`;
- botão `Salvar como PPTX`.

## 9.3 Apresentação de slide único
Quando a apresentação for iniciada a partir do preview individual:
- somente o slide selecionado deve ser renderizado;
- próximo/anterior devem ficar desabilitados;
- o slide final de exportação não deve existir nesse fluxo;
- `ESC` ou ação de retorno deve levar o usuário ao configurador.

# 10. Exportação

## 10.1 PDF
O sistema deve exportar a apresentação para `.pdf` usando solução 100% client-side.

## 10.2 PPTX
O sistema deve exportar a apresentação para `.pptx` usando solução 100% client-side.

## 10.3 Regras da exportação
As exportações devem respeitar:
- a ordem final dos slides;
- o layout atual;
- a paleta atual;
- a ocultação de campos vazios;
- o conteúdo equivalente ao preview final.

## 10.4 Observação técnica
A fidelidade entre HTML e PPTX pode exigir uma camada de adaptação própria, principalmente para o layout Personalizado.

# 11. Requisitos Funcionais

- [RF01] Permitir upload de CSV por Drag & Drop.
- [RF02] Permitir upload de CSV por botão de seleção de arquivo.
- [RF03] Validar extensão do arquivo.
- [RF04] Detectar separador `,` ou `;`.
- [RF05] Validar encoding do arquivo.
- [RF06] Validar presença das colunas obrigatórias `ID` e `Title`.
- [RF07] Mapear automaticamente as colunas suportadas para os campos do slide.
- [RF08] Ignorar colunas extras acima do limite suportado.
- [RF09] Ocultar campos vazios sem renderizar blocos vazios.
- [RF10] Gerar 1 slide por linha do CSV.
- [RF11] Manter a ordem inicial igual à ordem do CSV.
- [RF12] Permitir seleção de layout entre `Padrão` e `Personalizado`.
- [RF13] Permitir seleção de paleta de cores.
- [RF14] Exibir preview ao vivo com dados reais.
- [RF15] Permitir reordenação manual dos slides por drag and drop.
- [RF16] Garantir que a ordem reordenada seja refletida no preview.
- [RF17] Garantir que a ordem reordenada seja refletida na apresentação completa.
- [RF18] Garantir que a ordem reordenada seja refletida nas exportações PDF e PPTX.
- [RF19] Permitir clicar em qualquer slide da lista lateral para abrir seu preview.
- [RF20] Permitir navegação entre slides pelo preview principal.
- [RF21] Exibir o indicador `Preview: Slide X de Y`.
- [RF22] Permitir abrir o preview do slide atual em modo apresentação de slide único.
- [RF23] No modo de slide único, desabilitar navegação entre slides.
- [RF24] No modo de slide único, ocultar o fluxo final de exportação.
- [RF25] Permitir apresentação completa com Fullscreen API.
- [RF26] Permitir navegação por teclado na apresentação completa.
- [RF27] Exibir indicador de progresso na apresentação completa.
- [RF28] Exibir slide final com exportação para PDF e PPTX apenas na apresentação completa.
- [RF29] No layout Personalizado, permitir arrastar blocos livremente.
- [RF30] No layout Personalizado, permitir redimensionar blocos.
- [RF31] Reaplicar o layout personalizado configurado aos demais slides.
- [RF32] Exibir erros inline orientativos para CSV inválido, encoding incompatível e ausência de colunas obrigatórias.

# 12. Requisitos Não Funcionais

- [RNF01 - Client-Side Only] Todo processamento deve ocorrer no navegador.
- [RNF02 - Privacy First] Nenhum dado do CSV deve ser enviado para servidores externos por padrão.
- [RNF03 - Open Source] O projeto deve ser público sob licença MIT.
- [RNF04 - Deploy Estático] A aplicação deve funcionar em hospedagem estática.
- [RNF05 - Responsividade Base] O foco do MVP é desktop moderno.
- [RNF06 - Performance] Preview, reordenação e navegação devem permanecer fluidos com volumes moderados de slides.
- [RNF07 - Consistência Visual] Preview, apresentação e exportação devem manter consistência estrutural.
- [RNF08 - Acessibilidade Base] Os controles principais devem ter operação por teclado.
- [RNF09 - Estado Local] As configurações devem permanecer vivas durante a sessão.
- [RNF10 - Sem Branding Fixo] A interface deve ser neutra e reutilizável.

# 13. UX e Design

## 13.1 Landing
- Viewport 100vh.
- Sem scroll desnecessário.
- Título centralizado.
- Tagline: `CSV → Apresentação em segundos`.
- Subtítulo: `Seus dados nunca saem do navegador`.
- Área central de upload.
- Rodapé discreto com GitHub e mensagem de privacidade.

## 13.2 Configurador
- Sidebar funcional e compacta.
- Preview grande e central.
- Lista de slides ocupando o espaço vertical restante.
- Botões de navegação claros, porém discretos.
- Badge/botão de preview individual visível no preview.

## 13.3 Slides
- Hierarquia clara entre título e conteúdo.
- Destaque para status e prioridade.
- Textos longos com scroll interno discreto.
- Visual profissional e limpo.

## 13.4 Paleta base dark
- Fundo: `#0F172A`
- Superfícies: `#1E293B`
- Texto: `#F8FAFC`
- Acento: `#06B6D4`
- Sucesso: `#22C55E`

## 13.5 Tipografia
- Fonte: `Inter` ou `Outfit`
- Corpo mínimo: `16px`

# 14. Arquitetura Funcional

## 14.1 Módulos principais
- Parser de CSV
- Mapeador de colunas
- Store de estado da apresentação
- Engine de layout
- Renderizador de preview
- Renderizador de apresentação
- Exportador PDF
- Exportador PPTX

## 14.2 Estado mínimo necessário
A aplicação deve manter em memória:
- dados parseados do CSV;
- ordem dos slides;
- slide selecionado;
- layout escolhido;
- paleta escolhida;
- configuração do layout personalizado;
- estado do preview individual;
- estado da apresentação completa.

## 14.3 Diretriz técnica
O modelo de layout personalizado deve ser desacoplado da UI, serializável e previsível, para facilitar manutenção, exportação e evolução futura com agentes de LLM.

# 15. Stack Técnica Sugerida

- Frontend: React + Vite + TypeScript
- Estilização: Tailwind CSS
- Animações: Framer Motion
- Parsing CSV: PapaParse
- Reordenação de slides: biblioteca de drag and drop compatível com React
- Editor visual do layout personalizado: biblioteca de drag/resize ou engine própria
- Exportação PDF: html2pdf.js
- Exportação PPTX: PptxGenJS

# 16. Critérios de Aceite

## 16.1 Upload
- Dado um CSV válido com `ID` e `Title`, o sistema deve importar e permitir configuração.
- Dado um CSV inválido, o sistema deve bloquear o avanço e informar o erro inline.

## 16.2 Ordenação
- O usuário deve conseguir reordenar slides por drag and drop.
- A ordem final deve refletir no preview, apresentação, PDF e PPTX.

## 16.3 Preview
- Ao clicar em um slide da lista, o preview deve mudar corretamente.
- Ao navegar pelas setas, o índice deve ser atualizado corretamente.
- Ao clicar no badge de preview, apenas o slide selecionado deve abrir em modo apresentação.

## 16.4 Layout Personalizado
- O usuário deve conseguir arrastar blocos.
- O usuário deve conseguir redimensionar blocos.
- O layout configurado deve ser aplicado aos demais slides.
- Campos vazios não devem ocupar espaço visual indevido.

## 16.5 Apresentação
- A apresentação completa deve funcionar em tela cheia.
- A navegação por teclado deve responder corretamente.
- O slide final com exportação deve aparecer apenas na apresentação completa.

## 16.6 Exportação
- O PDF deve refletir a ordem e aparência final.
- O PPTX deve refletir a ordem e estrutura final da apresentação.

# 17. Riscos Técnicos

- Exportar com fidelidade total um layout livre para PPTX pode exigir simplificações.
- Overlap entre blocos no layout personalizado precisa de regras claras.
- É necessário garantir consistência entre renderização HTML e saída exportada.
- A engine de layout deve nascer bem definida para evitar retrabalho futuro.

# 18. Diretriz para Reconstrução

A reconstrução do Slidefly deve ser orientada por arquitetura modular, separando claramente:
- parsing de dados;
- mapeamento de colunas;
- gerenciamento de estado;
- configuração visual;
- renderização do slide;
- apresentação;
- exportação.

Layout, ordenação e preview individual devem ser tratados como requisitos centrais do produto, e não como extensões opcionais.
