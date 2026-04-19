---
name: wireframes-index
description: Índice dos 14 wireframes em ASCII (800×600). Um arquivo por tela.
---

# Wireframes — Os Cabra

Esboço de todas as 14 telas do jogo (ver `UX_SPEC.md` seção 2). Cada arquivo é um wireframe em ASCII anotado com coordenadas reais do canvas 800×600, hierarquia visual e notas de interação.

> **Por que ASCII e não PNG/Figma?** Entrega via Claude Code não tem saída de imagem nativa; ASCII preserva as coordenadas exatas de um jeito que o Gameplay Dev pode ler direto. Se a equipe quiser PNGs depois, os arquivos aqui servem de briefing objetivo pra qualquer ferramenta (Figma, Excalidraw). Ver `REPORT_UX_DESIGNER.md` para decisão.

| # | Arquivo | Tela |
|---|---|---|
| 1 | [`01-splash.md`](01-splash.md) | Splash / Boot |
| 2 | [`02-menu-principal.md`](02-menu-principal.md) | Menu Principal |
| 3 | [`03-codigos.md`](03-codigos.md) | Códigos dos Cabra |
| 4 | [`04-preload.md`](04-preload.md) | Preload |
| 5 | [`05-intro-fase.md`](05-intro-fase.md) | Intro de Fase |
| 6 | [`06-gameplay.md`](06-gameplay.md) | Gameplay |
| 7 | [`07-hud.md`](07-hud.md) | HUD (detalhe) |
| 8 | [`08-pausa.md`](08-pausa.md) | Pausa |
| 9 | [`09-checkpoint.md`](09-checkpoint.md) | Checkpoint |
| 10 | [`10-boss-intro.md`](10-boss-intro.md) | Boss Intro |
| 11 | [`11-boss-defeated.md`](11-boss-defeated.md) | Boss Derrotado |
| 12 | [`12-fim-de-fase.md`](12-fim-de-fase.md) | Fim de Fase |
| 13 | [`13-game-over.md`](13-game-over.md) | Game Over |
| 14 | [`14-vitoria-final.md`](14-vitoria-final.md) | Vitória Final |

## Convenções

- Canvas 800×600 (origem top-left, x→, y↓)
- Todas as strings em `GLOSSARY_PT_BR.md` — wireframe usa a chave do glossário (ex: `menu.play`) ou a versão final quando já estável
- Fontes conforme `UI_STYLE_GUIDE.md`
- Cores em hex conforme `ART_BIBLE.md` §3 + `UI_STYLE_GUIDE.md`
- Transições e feedback em `UX_SPEC.md` §6 e §8

## Hierarquia visual (legend)

- **[[...]]** — título/display, atenção máxima
- **[...]** — botão interativo / CTA
- **(...)** — texto secundário
- **{{...}}** — arte ilustrada (responsabilidade do Visual Designer)
- **· · ·** — arte de fundo / parallax
