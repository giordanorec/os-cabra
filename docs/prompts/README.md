# Prompts para sessões de especialistas

Esta pasta contém **prompts prontos** pra colar em sessões Claude Code novas, uma por especialista. Cada prompt é auto-suficiente — não precisa explicar o projeto manualmente.

## Como usar

1. Abra uma nova sessão Claude Code no diretório `/home/grec/Documentos/Test_Phaser`
2. Escolha o agente (ex: `02-gameplay-dev.md`)
3. Copie **todo** o conteúdo do prompt (exceto o header e o separador `---`)
4. Cole como primeira mensagem pro Claude
5. O Claude vai ler os docs indicados e começar a trabalhar

## Ordem sugerida de acionamento

| # | Agente | Quando acionar | Depende de |
|---|---|---|---|
| 1 | [Game Designer](01-game-designer.md) | Agora | GDD base já escrito |
| 2 | [Gameplay Developer](02-gameplay-dev.md) | Após Game Designer fechar decisões-chave | GDD refinado |
| 3 | [Visual Designer](03-visual-designer.md) | Em paralelo com Gameplay Dev (Milestone 2+) | ART_BIBLE |
| 4 | [UI/UX Designer](04-ux-designer.md) | Em paralelo com Visual Designer | UX_SPEC |
| 5 | [Sound Designer](05-sound-designer.md) | Paralelo; acionar quando Milestone 2 estiver perto | SOUND_SPEC |
| 6 | [QA/Tester](06-qa-tester.md) | A cada milestone entregue pelo Gameplay Dev | QA_PLAN + build funcional |
| 7 | [DevOps](07-devops.md) | Fase 1 agora (CI, branch protection); Fase 2 após Milestone 2 | DEVOPS |

## Fluxo de retorno

Cada especialista entrega numa branch `feat/<dominio>-v1` ou similar, escreve um `docs/REPORT_<AGENTE>.md` e avisa o orquestrador. O orquestrador (Claude na sessão raiz, com o usuário) revisa, integra e abre PR para `main`.

## Notas

- **Sempre trabalhar em branch separada** — nunca commit direto na `main`
- **Atualizar docs** quando tomar decisão nova — `docs/` é fonte de verdade
- **Relatório ao final** — `docs/REPORT_<AGENTE>.md` ajuda o orquestrador a entender o que mudou
