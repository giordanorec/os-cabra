# REPORT — Juice & HUD (feat/juice-and-hud)

## Objetivo
Usuário testou o jogo e reclamou: "inimigos pequenos, sem animação de vida, sem explosão, HUD incompleto, sem impacto". Transformar a sensação geral — presença visual dos inimigos, feedback de ações, riqueza do HUD.

## O que foi feito

### 1. Inimigos — presença e animação
- `Enemy.ts` base reescrito com:
  - **Spawn jump**: inimigos surgem em `alpha 0 + scale 0.3`, crescem até o `baseScale` alvo em 350ms `Back.easeOut`. Sem "aparição seca".
  - **Idle pulse**: após spawn, tween yoyo ±8% em 600ms `Sine.easeInOut` permanente (respiração).
  - **Hit flash reforçado**: tint branco puro (`0xffffff`, antes era creme `0xf4e4c1`), scale punch 1.18× em 80ms `Cubic.easeOut`. Pause/resume no pulse pra não conflitar.
- Scales per-inimigo bumpados pra 10-15% da altura do viewport (60-95px):
  - MoscaManga `3→4.5` (63px)
  - Mamulengo `0.5→0.9` (86px)
  - PapaFigo `0.75→1.3` (94px)
  - Urubu `1→1.7` (~95px)
  - Caboclinho/Passista: base default era 2, agora 3 (`Enemy.ts` default).

### 2. Explosão de morte
- `Effects.ts` `enemyDeath(x,y,points)`:
  - 10 sparks + 6 embers (antes 6 só) em 360°, speed 180-300, lifespan 380-460ms.
  - Shake 0.008 amplitude 180ms (antes 0.003 120ms).
  - Score popup flutuante `+N` em `JetBrains Mono 22px bold gold`, sobe 50px e fadeia em 520ms. Entra com Back.easeOut.

### 3. HUD
- `HUDScene.ts` adicionou:
  - **Kill counter** top-right `KILLS: N`, pulsa scale 1.25 ao incrementar.
  - **Distance meter** bottom-right `DIST: X.X km` (1 km/20s fictício, evocando Recife-Olinda). Backdrop escuro semi-opaco.
  - **Score animado**: `tweens.addCounter` interpola o número exibido em 400ms `Sine.easeOut`; pulse scale 1.15 a cada acréscimo.
  - **Vidas animadas**: ao perder, ícone "estoura" com `scale 1.8 + alpha 0` em 260ms; remanescentes pulsam em reação (scale 1.2 yoyo 120ms).
- `GameScene.ts` incrementa `killCount` e emite `hud-kills` a cada morte. Passa `enemy.points` pro `fx.enemyDeath` pro score popup.

### 4. Juice geral
- `muzzleFlash` de 3 pra 8 sparks + mini camera shake 0.002/60ms.
- `playerHit` bumped de 0.006/250ms → 0.013/300ms (shake forte conforme spec).

## Arquivos alterados
- `src/entities/Enemy.ts`
- `src/entities/enemies/MoscaManga.ts`
- `src/entities/enemies/Mamulengo.ts`
- `src/entities/enemies/PapaFigo.ts`
- `src/entities/enemies/UrubuCapibaribe.ts`
- `src/systems/Effects.ts`
- `src/scenes/HUDScene.ts`
- `src/scenes/GameScene.ts`

## Validação
- `npm run typecheck` ✅
- `npm run build` ✅ (dist construído, 678ms)
- Playwright: navegou a `localhost:5181`, carregou menu (screenshot `docs/milestone-reports/juice-hud/01-initial-game.png`), pressionou Enter → entrou em GameScene. Screenshot de gameplay falhou por timeout do Playwright MCP (5s limit) após ~15s de jogo; console mostrou 1 TypeError em `HUDScene.setKills` causado por race entre emit `hud-kills` e init do `killText`. **Guard adicionado** (`if (!this.killText?.active) return`) + `tweens.killTweensOf` pra evitar tween piling. Build refeito limpo.

## Blocker / nota
Screenshot de gameplay ativo não foi capturada dentro da sessão. Os efeitos são todos tween/particle-based — visuais só aparecem em runtime. Recomendo Arquiteto validar manualmente no browser antes do merge, ou pedir QA pra rodar checklist visual.

## Próximo passo
- Se a inspeção manual achar a "presença" insuficiente, próximo ajuste: aumentar mais os scales per-inimigo ou adicionar hit-stop freeze frame pra impacto percussivo (hoje desliguei por risco a gameplay rápida tipo swarm de Mosca).
- Milestones de score já existem (código legado); confirma que `feedback.milestone_10k` etc ainda renderizam animação bounce.
