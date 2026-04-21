# REPORT_ENDLESS — modo endless

## Objetivo
Pivô de escopo: jogo passa de 5 fases finitas com boss para **endless run**
contínuo pelas paisagens de Recife. Dificuldade escala proceduralmente.

## Entregas
- `src/config.ts`: constantes `ENDLESS`, tabela de biomas e unlock de inimigos,
  `LOCALSTORAGE_ENDLESS_HIGHSCORE_KEY`.
- `src/systems/EndlessDirector.ts` (novo): tempo, biome index, cadência de spawn
  (decaimento × biome, × loop), tamanho de grupo escalonado, tipos liberados
  progressivamente. Emite `endless-biome-change` e `endless-tick`.
- `src/systems/BiomeTransition.ts` (novo): mantém Parallax atual, escuta eventos
  do Director, dispara `Parallax.transitionTo()` com crossfade 4s; aplica tint
  noturno a partir do loop 2.
- `src/systems/Parallax.ts`: novo método `transitionTo(sceneId, duration, tint?)`
  baseado em `tweens.addCounter`; `destroy()` limpa layers; outgoing é tickado
  até fade concluir.
- `src/systems/EnemySpawner.ts`: modo `'procedural'` (além do `'waves'`), método
  público `spawnType(type, x)` chamado pelo Director.
- `src/scenes/GameScene.ts`: rewrite. Usa `BiomeTransition` + `EndlessDirector`
  + spawner procedural. Sem boss, sem waves, sem checkpoints. Player death =
  GameOver direto. ScoreManager usa highscore key endless.
- `src/scenes/HUDScene.ts`: tempo (MM:SS), distância (m) e bioma atual
  ("POR MARCO ZERO") top-center/top-right. Reage a `endless-tick`.
- `src/scenes/MenuScene.ts`: highscore mostrado agora é o endless (fallback
  compat para o antigo se ainda não houver endless score).
- `src/scenes/PreloadScene.ts`: pré-carrega back/mid de fase2 e fase4 (fase1 já
  carregado). fase3/fase5 ainda sem arte.
- `src/systems/ScoreManager.ts`: `addSurvivalPoints()` (+10pt/seg survival),
  `highscoreKey` configurável, `loadHighscore(key)` aceita key.
- `src/strings.ts`: chaves `hud.distance_label`, `hud.time_label`,
  `hud.biome_prefix`, `hud.loop_suffix`, `hud.endless_highscore`.

## Números calibrados
- `BIOME_DURATION_MS = 45_000` (45s por bioma)
- `BIOME_CROSSFADE_MS = 4_000`
- `BASE_SPAWN_INTERVAL_MS = 3_800` × `CADENCE_DECAY^biomeIndex` (0.93) com piso
  de `700ms`
- Tamanho do grupo: 1 → 2 (após 2 biomas) → 3 (após 4) → 4 (após 7)
- Loop (3 biomas = 135s): `LOOP_SPEED_MULT 1.08`, `LOOP_SPAWN_MULT 0.90`
- Survival: +10pt/seg · Distância: 18m/s

## Unlock progressivo de inimigos
- Bioma 0: `caboclinho`
- Bioma 1+: + `passistaFrevo`, `moscaManga`
- Bioma 2+: + `mamulengo`
- Bioma 3+: + `urubuCapibaribe`
- Bioma 4+: + `papaFigo`

## Backgrounds disponíveis vs ausentes
- ✅ `public/assets/backgrounds/fase1/` (Marco Zero)
- ✅ `public/assets/backgrounds/fase2/` (Olinda)
- ✅ `public/assets/backgrounds/fase4/` (Capibaribe)
- ❌ `fase3/` (Recife Antigo) — **TODO Visual Designer**
- ❌ `fase5/` (Sertão) — **TODO Visual Designer**

Enquanto não vierem, `ENDLESS_BIOMES` só roda os 3 disponíveis; a partir do
loop 2 aplica tint `0x7a7ab0` pra sinalizar "noite".

## Validação Playwright (localhost:5182 — outros worktrees ocuparam 5173-5181)
Screenshots em `docs/milestone-reports/endless/`:
- `01_gamescene_t0_marco_zero.png` — GameOver do setup (antes do god mode)
- `01_t3s_marco_zero.png` — t≈13s: HUD mostra `236 m / 00:13 / POR MARCO ZERO`, score 130
- `02_t23s_marco_zero.png` — t≈38s: scroll vertical visível, `695 m / 00:38`
- `03_t43s_transition.png` — t≈1:08 (durante OLINDA): biome label mudou pra `POR OLINDA`, 1237m
- `04_t85s_olinda.png` — t≈1:43 CAPIBARIBE: terceiro biome, 1858m, 33 inimigos vivos (escalamento ativo)

Console: só 1 erro de `AudioContext` (gesture absent em headless — esperado).
Zero erros de código. Typecheck e build verdes.

## Decisões não-óbvias
- **Player invulnerável não foi adicionado.** Player morre em contato com
  inimigos como antes. Endless = survival puro. Dificuldade vem de cadência
  e variedade, não de HP.
- **Modo `'waves'` do EnemySpawner preservado** (flag construtor). Permite
  retomar story mode no futuro sem reescrever o spawner.
- **Parallax crossfade via `addCounter`** em vez de tweenar alpha do objeto —
  Parallax não é GameObject, `addCounter` é a forma canônica pra valor puro.
- **bg color da câmera faz flip no meio do crossfade** (não anima) porque
  `setBackgroundColor` não é tweenável; o Parallax cobre a viewport inteira
  durante o fade, então visualmente não vaza.

## Blockers / Open questions pro Arquiteto
- Visual Designer precisa gerar fase3 e fase5 (back/mid) pra reativar biomas
  3 e 5. Deixei comentário em `config.ts` e esta entrada aqui.
- Menu ainda diz "BORA, CABRA" sem indicar que é endless. Se for relevante,
  é uma string pequena — não mexi porque não foi pedido explícito.
- `feat/juice-and-hud` roda em paralelo e também mexe em GameScene/HUDScene.
  Rebase é por conta do Arquiteto.

## Próximo passo sugerido
- **Visual Designer** entrega fase3/fase5 backgrounds; adicionamos a
  `ENDLESS_BIOMES` e o ciclo sobe de 3 para 5 biomas distintos.
- **Sound Designer** pode adicionar ambiências específicas por biome
  (música cross-fade também em BiomeTransition).
- **QA** valida runs longos (5min+) em busca de leaks de Parallax (outgoing
  não destruído) e escalamento sem floor.
