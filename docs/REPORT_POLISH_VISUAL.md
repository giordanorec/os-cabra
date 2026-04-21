# REPORT — Polish Visual (2026-04-21)

## Objetivo
Resolver 7 problemas visuais severos reportados pelo red team após deploy: menu ilegível/rolante, player invisível, HUD sem contraste, barras laterais turquesa.

## O que foi feito
- **Menu estático**: `MenuScene` não chama mais `parallax.tick(delta)`. Parallax é construído só para renderizar as camadas iniciais. Galo fica parado no centro.
- **Layout menu sem sobreposição (Opção A)**: título "OS CABRA" no topo (y=80), CTA "BORA, CABRA" embaixo (y=490), hint/highscore no rodapé. Galo (do `bg-menu-back`) ocupa o centro livre.
- **Backdrops escuros** (`#1a0f08` @ 0.55) atrás de todo texto do menu e do botão fullscreen — garante legibilidade sobre qualquer arte.
- **HUD top com backdrop**: faixa `#1a0f08` @ 0.6 cobrindo 800×52 em y=0. Score fonte 28px bold com stroke 3px + shadow. Vidas: slots com outline dourado `#f0c840`, ícone `setTint(0xffffff)` para destaque.
- **HUD bottom hint**: backdrop 800×24 em y=588, texto com stroke escuro.
- **Phase intro** com painel escuro por trás (sempre legível).
- **Player 1.0× (era 0.75)**: sprite 128×128 no canvas 800×600 (~21% altura). Hitbox `setSize(96,96)` `setOffset(16,24)` — mantém fair-play. Scale bob sutil (1.0 → 1.04 / 0.96 / 0.5s ping-pong) dá presença.
- **Body bg neutro**: `#2db8d6` (turquesa) → `#1a0f08` (escuro) em `index.html` + `theme-color`. Letterbox deixa de competir com o cenário. Mantido `Phaser.Scale.FIT` (ENVELOP cortaria HUD top/bottom em viewport 16:9).

## Arquivos alterados
- `index.html` — body `background: #1a0f08`; `theme-color #1a0f08`.
- `src/scenes/MenuScene.ts` — remove `parallax!` field, não tick mais, reorganiza layout com backdrops.
- `src/scenes/HUDScene.ts` — backdrops top/bottom, score/vidas com stroke e tint, painel em phase intro.
- `src/entities/Player.ts` — `setScale(1.0)`, `setSize(96,96).setOffset(16,24)`, scale-bob tween.

## Decisões técnicas
- **FIT em vez de ENVELOP**: ENVELOP preenche cortando — em 16:9 (1920×1080) sobre jogo 4:3 cortaria ~12% top/bottom, escondendo HUD score/hint. FIT + body dark mata a percepção de barras.
- **Parallax instanciado mas descartado no menu**: a ctor de Parallax já desenha camadas iniciais (Image/TileSprite colocados na scene). Ao não tick, nada se move. Evita reescrever Parallax com flag "paused".
- **Scale bob no lugar de glow FX**: `preFX.addGlow` exige WebGL e adiciona custo; bob por tween é zero-custo e dá movimento que chama atenção sem "shader mágico".

## Validação
- `npm run typecheck` ✅ verde
- `npm run build` ✅ verde (1.4MB bundle, mesmo de antes)
- Playwright em `localhost:5180`:
  - Menu: galo centralizado, título topo, CTA bottom, backdrops visíveis, zero movimento (ver `docs/milestone-reports/polish-visual/01_menu_after.png`)
  - Gameplay: HUD top com score legível (000120), 3 vidas com outline dourado, player (galo com sombrinha) grande no meio do cenário denso, sem faixas brancas laterais (`02_gameplay_after.png`)
- Console: sem errors nem warnings

## Próximo passo
- Visual Designer: `bg-fase1-fore` continua desativado. Reentregar como silhueta/overlay leve pra destacar player ainda mais.
- Game Designer: revisar se hitbox 96×96 mudou o game feel vs 72×72 (mais hits agora).

## Evidências
- `docs/milestone-reports/polish-visual/01_menu_after.png`
- `docs/milestone-reports/polish-visual/02_gameplay_after.png`
