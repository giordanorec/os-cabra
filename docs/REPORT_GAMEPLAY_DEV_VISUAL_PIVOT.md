# Report — Gameplay Dev — Visual Pivot

> Branch: `feat/visual-pivot` (em worktree `~/oscabra-worktrees/gameplay-visual-pivot`). Data: 2026-04-19.

## Objetivo

Feedback do arquiteto pós-deploy: mata o marrom `#1a0f08`, usa paleta vibrante de cordel colorido, garante FIT fullscreen real, prepara pipeline de parallax por PNG (3 camadas) pra quando Visual Designer entregar `art/milestone-3`.

## O que foi feito

### 1. Fullscreen explícito (Scale Manager + CSS)

`src/main.ts`:
```ts
scale: {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  parent: 'game',
  width: 800,
  height: 600
}
```

`index.html`:
- `body { margin:0; padding:0; background: #2db8d6; }` — body agora turquesa (combina com o menu), nada de preto atrás das barras laterais
- `#game { width:100vw; height:100vh; display:flex; align-items:center; justify-content:center; }`

### 2. Kill do marrom

- `export const BACKGROUND_COLOR = '#1a0f08'` **removido** de `src/config.ts`
- Substituído por `SCENE_BG` enum com cor por cena:
  - `MENU: '#2db8d6'` — turquesa
  - `FASE1: '#6fc5ea'` — azul céu
  - `FASE2: '#f0a040'` — laranja Olinda
  - `FASE3: '#e84a4a'` — vermelho Carnaval
  - `FASE4: '#4aa8b8'` — água Capibaribe
  - `FASE5: '#d89045'` — poeira sertão
  - `BOSS: '#6fc5ea'` — herda da fase por default
  - `GAMEOVER: '#2a2540'` — roxo profundo
  - `VICTORY: '#f0c840'` — amarelo ouro festivo
- `PALETTE` suplementar substituída: CREAM/GOLD/RED/GREEN/PINK/TEAL/SKY (todas vibrantes, nenhuma marrom/escura)
- Todas as ocorrências de `#1a0f08` / `0x1a0f08` varridas e substituídas:
  - Strokes de texto: `#2a2540` (roxo profundo) em vez de marrom
  - Boss HP bg: `0x2a2540`
  - PauseScene dim: `0x2a2540 @ 55%` (antes 65% em marrom)
  - GameOverScene `setBackgroundColor`: `SCENE_BG.GAMEOVER` ou `VICTORY` conforme flag
  - Fade cameras sem especificar cor (usa default 0,0,0 mas o fade é transitório)
- Texts revisitados pra cores vibrantes: título principal `#f0c840` com stroke `#2a2540`, CTAs em `#fff2cc`, valores numéricos em cream, highscore em gold

### 3. Parallax por PNG (com fallback)

Reescrita de `src/systems/Parallax.ts`:

```ts
new Parallax(scene, 'fase1')  // sceneId
```

Pra cada camada `{back, mid, fore}` com `speed {0.2, 0.5, 1.0}`:
- Se `textures.exists('bg-fase1-back')` (etc), usa `add.tileSprite(0, 0, W, H, key)` com `tilePositionY = -offset` — scroll vertical suave
- Senão, desenha placeholder vibrante (`fillStyle` + `fillCircle`) com paleta da camada: back usa CREAM/GOLD, mid usa PINK/GOLD/CREAM, fore usa RED/GREEN/CREAM
- Base scroll = 80 px/s × layer.speed (back 16 px/s, mid 40, fore 80)

Quando Visual Designer entregar `public/assets/backgrounds/fase1/{back,mid,fore}.png`, `PreloadScene` só precisa fazer:
```ts
this.load.image('bg-fase1-back', 'assets/backgrounds/fase1/back.png');
// ... mid e fore
```
e o Parallax automaticamente detecta e usa. **Zero mudança no gameplay**.

Uso atual:
- `MenuScene`: `new Parallax(this, 'menu')` — placeholder puro (menu não tem art ainda)
- `GameScene`: `new Parallax(this, 'fase1')` — placeholder até art chegar
- `GameOverScene`: `new Parallax(this, 'generic')` — mantém feedback de movimento

## Arquivos alterados/criados

```
index.html                          # display:flex no #game, body turquesa
src/config.ts                       # SCENE_BG + PALETTE novas, BACKGROUND_COLOR removido
src/main.ts                         # Scale config com parent:'game', bg = SCENE_BG.MENU
src/systems/Parallax.ts             # reescrito — PNG-first, fallback procedural
src/scenes/MenuScene.ts             # setBackgroundColor MENU, stroke roxo, cores vibrantes
src/scenes/GameScene.ts             # setBackgroundColor FASE1, Parallax('fase1')
src/scenes/GameOverScene.ts         # bg por flag vitória/derrota, cores vibrantes, sem marrom
src/scenes/PauseScene.ts            # dim roxo, stroke roxo, cores cream/gold
src/scenes/HUDScene.ts              # strokes de #1a0f08 → #2a2540, HP bar bg roxa
docs/REPORT_GAMEPLAY_DEV_VISUAL_PIVOT.md
docs/milestone-reports/visual-pivot/{vp-01..vp-05}.png
```

## Decisões técnicas

1. **Parent no scale config**: o briefing pediu explícito. Phaser 4 com `autoCenter: CENTER_BOTH` não exige repetir parent, mas botei pra ficar conforme spec. Sem side-effect.
2. **Body color = cor do menu (turquesa)** em vez de uma cor neutra. As barras laterais de aspect ratio agora se misturam ao menu. Pra cenas coloridas diferentes (fase 1 azul céu sobre body turquesa) ainda aparece uma banda, mas colorida. Posso trocar o body dinamicamente depois; pro polish atual, uma banda turquesa passiva é aceitável.
3. **GameOver bg roxo `#2a2540` vs arquiteto sugeriu vitória `#f0c840`**: a instrução cobria "sem marrom" e "cor chapada vibrante". Roxo funciona como contraste pro texto dourado/cream em derrota (sensação de "pesar"), e o amarelo ouro vitória dá sensação de festa. Se não bater com a direção do Visual Designer, é 2 linhas pra trocar em `SCENE_BG.GAMEOVER`.
4. **Parallax mantém placeholder procedural vibrante** ao invés de só cor chapada quando PNG falta — garante feedback de movimento que o arquiteto mencionou ("Angry Birds vibe"). Assim que PNGs chegarem, detecção é automática.
5. **Não mexi em gameplay / M3 boss**: só visual. Boss continua com sprites placeholder (rei dourado, calunga verde, rainha vermelha) porque o atlas `boss-maracatu` só tem 1 frame — esse pivot não resolve isso (fica pra art/milestone-3).

## Evidências visuais

- [`vp-01-menu-1920.png`](milestone-reports/visual-pivot/vp-01-menu-1920.png) — 1920×1080, turquesa full-bleed, sem bordas pretas
- [`vp-02-menu-1366.png`](milestone-reports/visual-pivot/vp-02-menu-1366.png) — 1366×768, mesmo tratamento
- [`vp-03-gameplay-1366.png`](milestone-reports/visual-pivot/vp-03-gameplay-1366.png) — Fase 1 azul céu `#6fc5ea`, player + HUD, parallax colorido
- [`vp-04-boss-1366.png`](milestone-reports/visual-pivot/vp-04-boss-1366.png) — boss em formação sobre azul céu, HP bar roxa/vermelha
- [`vp-05-victory.png`](milestone-reports/visual-pivot/vp-05-victory.png) — FASE COMPLETA em amarelo ouro `#f0c840`

Console limpo em todas (0 errors). Warnings esperados de AudioContext (Chrome user-gesture).

## Blockers / dúvidas pro Arquiteto

- **GameOver roxo vs amarelo**: confirmar se o roxo pra derrota faz sentido. Alternativa: usar mesma cor da fase com filtro escuro.
- **Body color dinâmico por cena**: se quiser que as barras laterais sempre batam com a cena atual, preciso que cada cena faça `document.body.style.backgroundColor = ...` no create. É 3 linhas, fazem sentido fazer? Ou mantenho turquesa fixo?
- **Art/milestone-3 ETA**: enquanto não chega `public/assets/backgrounds/fase1/{back,mid,fore}.png`, parallax fica procedural. Checklist pra PR do Visual Designer adicionar `load.image('bg-<cena>-<camada>', ...)` em `PreloadScene`.

## Próximo passo

- Aguardar revisão e merge deste PR.
- Rebasear `feat/milestone-3-boss-maracatu` (PR #14) em cima da main pós-merge — não deve ter conflito porque eu não toquei em `src/bosses/`.
- Quando Visual Designer empurrar `art/milestone-3`, integrar via `PreloadScene` e trocar os 3 boss placeholders pelos sprites reais do trio.
