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

---

## Adendo: fullscreen + sprite sizing (2026-04-19, append)

Dois pontos adicionais do arquiteto pós-PR inicial.

### 5. Browser fullscreen real (F)

- **`src/systems/Fullscreen.ts`** novo: `attachFullscreenToggle(scene)` adiciona `keydown-F` → `scene.scale.toggleFullscreen()`. Função `addFullscreenButton(scene, x, y, size?)` retorna um `Container` interativo com ícone de 4-corners (hover → fill amarelo, click → toggle) — requer user gesture (Chrome), teclado + clique ambos contam.
- Integrado em `MenuScene`, `GameScene`, `GameOverScene`.
- HUD hint `"[F] tela cheia"` adicionado ao final de `controls.hint` (strings).
- **`MenuScene`**: botão clicável em `(GAME_WIDTH - 24, 24)` com texto `[F] TELA CHEIA` logo abaixo.
- Documentado em `docs/UX_SPEC.md §4.1` (nova subseção "Mapa de teclas").

### 6. Sprite sizing — 8-12% da altura

- **`Player`**: `setScale(2)` no construtor (32×32 → 64×64 ≈ 10.7% de 600). `body.setSize(32, 32).setOffset(0, 0)` mantém hitbox proporcional.
- **`Enemy`** base: novo campo `scale?: number` no `EnemyConfig` (default 2). Aplica em todas subclasses sem duplicar código.
- **`MoscaManga`**: override `scale: 3` (14×14 → 42×42, ~7% altura — suficiente pro swarm ainda parecer nuvem sem dominar).
- Caboclinho e Passista herdam default scale 2 → 56×56 e 64×64 respectivamente.
- Boss members continuam nos tamanhos originais (Rei/Rainha 48×56, Calunga 36×44) porque já estão na faixa visível. Vão ser substituídos quando atlas boss-maracatu for separado.

### Validação (Playwright 1920×1080)

- [`vp-06-menu-with-fs-btn.png`](milestone-reports/visual-pivot/vp-06-menu-with-fs-btn.png) — botão FS top-right + "[F] TELA CHEIA" hint
- [`vp-07-gameplay-scaled.png`](milestone-reports/visual-pivot/vp-07-gameplay-scaled.png) — player escalado (64×64 visível no canto inferior), hint do HUD com "[F] tela cheia"
- [`vp-08-gameplay-enemies-scaled.png`](milestone-reports/visual-pivot/vp-08-gameplay-enemies-scaled.png) — wave 2 em ação: **3 Passistas com sombrinha vermelha + 1 Caboclinho amarelo com arco**, silhuetas totalmente reconhecíveis, não mais pontinhos

Limitação: Playwright não consegue simular browser fullscreen do SO (chama a API mas não ativa F11-like). A integração está validada via: tecla F disparando no keyboard plugin + botão clicável existe + hint visível. Confirmação final requer teste manual no browser desktop.

---

## Adendo 2: bugfix pós-deploy (2026-04-19 tarde)

Quatro bugs reportados pelo usuário testando a branch antes de mergear. Todos corrigidos no mesmo PR.

### Bug 1: Nave invisível fora do fullscreen
**Root cause**: `#game { display:flex; align-items:center; justify-content:center }` no CSS conflitava com `Phaser.Scale.FIT + CENTER_BOTH` (Phaser posiciona canvas via `position:absolute` — flex layout no parent confundia o cálculo).
**Fix**: remover `display:flex` do `#game`, deixar só `width/height:100vw/100vh; position:relative`. Phaser agora gerencia posicionamento sozinho via CENTER_BOTH.
Validado em 800×600, 1024×768 e 1920×1080 (`fx-01`, `fx-04`, `fx-06`) — player sempre visível.

### Bug 2: BOB idle da nave
`Player.startBob()` tween `y: baseY - 8 → baseY + 8` em 600ms (metade de 1200ms), `Sine.easeInOut`, `yoyo: true`, `repeat: -1`.
Em `takeDamage`: `bobTween.pause()` e reseta `y = baseY` pra blink rodar clean. Em fim de i-frames: `bobTween.resume()`. Playwright confirma `player.y = 535` (baseY=540, bobando).

### Bug 3: Tiro "Recife" placeholder
`PreloadScene.generateDiamondBullet()` cria textura 12×18 de bandeirinha/diamante (triângulo superior rosa `#f06aa8` + inferior amarelo `#f0c840` + outline roxo). Substitui o retângulo cream. Troca pra sprite real quando Visual Designer entregar pena/milho/confete — só mudar `generateDiamondBullet` por `load.image('bullet-player', '...').`.

### Bug 4: Parallax PNGs carregados
`PreloadScene.BACKGROUND_IMAGES` agora faz `load.image('bg-menu-back', 'assets/backgrounds/menu.png')` e `bg-fase1-{back,mid,fore}` apontando pra `public/assets/backgrounds/fase1/*.png`. `loaderror` handler silencia os logs quando o arquivo não existe (Parallax detecta `textures.exists` e cai pro procedural).

**Dependência art/milestone-3**: os PNGs vivem na branch `art/milestone-3` (ainda não mergeada em main). Pra validar localmente, copiei da origem com `git checkout origin/art/milestone-3 -- public/assets/backgrounds/` + `git reset HEAD` (untracked no meu worktree, não vão no PR pra evitar conflito quando art/m3 mergear). **Quando `art/milestone-3` entrar em main + rebase deste PR**, o Preload pega os PNGs e console fica zero errors. Enquanto isso, o Vite dev server loga 404 (esperado — tem `loaderror` handler mas o log é do Vite, não do Phaser).

### Evidências (viewports + FS)

- [`fx-01-game-800x600.png`](milestone-reports/visual-pivot/fx-01-game-800x600.png) — 800×600, nave no bottom center, ainda com parallax procedural (antes de copiar PNGs)
- [`fx-02-menu-with-bg.png`](milestone-reports/visual-pivot/fx-02-menu-with-bg.png) — menu com `menu.png` real: galo gigante + bandeirinhas + coqueiros
- [`fx-03-game-800x600-bg.png`](milestone-reports/visual-pivot/fx-03-game-800x600-bg.png) — gameplay Marco Zero (farol + casas + rio) em 800×600
- [`fx-04-game-1024x768.png`](milestone-reports/visual-pivot/fx-04-game-1024x768.png) — 1024×768, scroll parallax em posição avançada
- [`fx-05-game-1920x1080.png`](milestone-reports/visual-pivot/fx-05-game-1920x1080.png) — game over "VOLTA ESSA FITA" (variante sorteada) em roxo, zero errors
- [`fx-06-game-1920-full.png`](milestone-reports/visual-pivot/fx-06-game-1920-full.png) — gameplay em 1920×1080 ocupando viewport, Marco Zero cordel colorido, HUD + hint [F] tela cheia

Console final: **0 errors** (com PNGs locais). Warnings continuam só do AudioContext pré-gesture.
