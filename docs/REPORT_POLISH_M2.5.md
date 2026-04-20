# Report — Polish M2.5 — Deploy-Ready

> Branch: `feat/polish-m2.5`. Feedback do arquiteto após deploy `os-cabra.vercel.app`.

## Objetivos atendidos

### 1. Tela cheia
- `Phaser.Scale.FIT` + `Phaser.Scale.CENTER_BOTH` em `main.ts`, mantendo aspect 800×600
- `index.html`: body `display:block`, canvas/game `100vw/100vh`, margins zeradas
- Validado em Playwright: 1920×1080 e 1366×768 — jogo ocupa todo o viewport com faixas pretas laterais (aspect 4:3 vs widescreen é inevitável sem mudar resolução lógica)

### 2. Integração de assets já produzidos
- **Sprites reais** via `load.spritesheet`: `player`, `enemy-caboclinho`, `enemy-passista`, `enemy-mosca`, `boss-maracatu` (5 atlas carregados; Rei/Rainha/Calunga ainda placeholders — Visual Designer não separou trio)
- **SFX** (45 keys) via `load.audio` — todos os arquivos `public/assets/sfx/*.ogg` relevantes pra gameplay atual: player_fire, enemy_hit, explosões, boss_*, chain_multiplier, checkpoint, pickups, voc_oxe/arretado/egua/visse/pai_degua/se_lascou/ta_com_tudo/ai_viu/bora, pause_in/out, ui_select/confirm/cancel
- **BGM** (5 tracks): `music_menu`, `music_phase1`, `music_boss`, `music_gameover`, `music_victory` com crossfade
- **Ambience** (1): `amb_marco_zero_crowd`
- **AudioManager** (`src/systems/AudioManager.ts`) carrega `audio_config.json`, aplica volumes por categoria + overrides; `play(key)` one-shot, `playMusic(key, crossfadeMs)` com tween, `stopMusic(fadeMs)`
- **Strings do glossário**: `src/strings.ts` agora cobre ~90 chaves (boot, menu, dialog, tips, stages 1-5, HUD, feedback, pickup, powerup, pause, checkpoint, boss 1-5, gameover 1-7, stage_end, controls) com interpolação `%n/%s` e helpers `getGameOverTitle()` / `getPickupTaunt()` que sorteiam variantes
- **Fontes**: `@fontsource/rye`, `@fontsource/inter`, `@fontsource/jetbrains-mono` via `src/fonts.ts` + `waitForFonts()` antes do `new Phaser.Game()`. Constantes `FONTS.DISPLAY` (Rye), `FONTS.BODY` (Inter), `FONTS.MONO` (JetBrains Mono)
- Todas as cenas revisadas pra consumir `FONTS.*` e strings via `getString(key)` — nada hardcoded restante no pipeline crítico

### 3. Angry Birds vibe (polish)
- **Parallax procedural 3 camadas** (`src/systems/Parallax.ts`): gradiente escuro + 2 camadas de pontos coloridos na paleta `ART_BIBLE` com velocidades diferentes. Rodando em Menu / Game / GameOver. Hook pronto pra substituir por sprites reais de background quando Visual Designer entregar
- **Logo real**: `OS CABRA` em Rye 88px, pulsa sutilmente (Sine.easeInOut 1.0↔1.04 em 1500ms). Imagem real vai entrar quando Visual Designer entregar PNG
- **Partículas** (`src/systems/Effects.ts`) em: muzzle flash (player atira), enemy death, player hit, boss hit, boss phase change, boss defeated, power-up pickup. Usa `Phaser.GameObjects.Particles.ParticleEmitter` com texturas placeholder `vfx-spark` / `vfx-ember`
- **Screen shake / flash / tint** conforme `UX_SPEC §6`: player_hit (flash vermelho 120ms + shake 250ms 0.006), boss_hit (flash branco 60ms + tint 80ms), boss_phase_change (flash 150ms + shake 250ms), boss_defeated (flash 150ms + shake 500ms), enemy_death (shake 120ms + partículas)
- **Tweens de easing** em transições de UI: MenuScene fadeOut `Cubic.easeIn` 300ms pra iniciar jogo, GameOverScene `Back.easeOut` 600ms entrada + fadeIn 400ms, PauseScene `Back.easeOut` no "PAREI" 250ms, HUD multiplier `Back.easeOut` entrada + pulsa 1.06 loop
- **HUD**: lives agora como `Phaser.GameObjects.Image` de `ui-life-icon` (placeholder procedural vermelho 24×24) — quando sprite real de galinho chegar, troca só o texture key. Multiplier com fade + scale pulse. Boss HP bar com preenchimento animado

### 4. Validação Playwright
- 1920×1080: menu renderiza com tipografia Rye/Inter/Mono + parallax + RECORDE: 008000 (herdado do M3 defeat do boss). `m25-04-menu-clean.png`
- 1366×768: mesma coisa — FIT acomoda perfeitamente. `m25-05-menu-1366.png`
- Gameplay em 1366×768 com HUD, sprites reais, parallax. `m25-06-gameplay-1366.png`
- Boss em formação + HP bar. `m25-07-boss-intro.png`
- `g.sound.sounds` mostra `music_menu` + `music_phase1` tocando simultaneamente durante crossfade (AudioManager funcionando)
- 22 sprites e 52 audio keys carregados (via `cache.audio.entries` e `textures.list`)
- Console: **0 erros**, 2 warnings esperados ("AudioContext was not allowed to start" — Chrome exige user gesture, tocam OK depois do primeiro input)
- Sem 404 nem "Missing texture" em console

## Arquivos novos / modificados

```
index.html                                 # FIT scale CSS
src/fonts.ts                               # novo — @fontsource + waitForFonts
src/main.ts                                # Scale.FIT config, bootstrap async
src/strings.ts                             # ~90 chaves do glossário + helpers
src/systems/AudioManager.ts                # novo — SFX/BGM/Ambience + config
src/systems/Parallax.ts                    # novo — 3 camadas procedurais
src/systems/Effects.ts                     # novo — shake/flash/tint/partículas
src/systems/ScoreManager.ts                # onChainStart callback pra SFX
src/entities/Player.ts                     # onFire callback
src/scenes/PreloadScene.ts                 # atlas + SFX + BGM + ambience + loading bar
src/scenes/MenuScene.ts                    # Rye/Inter, música, parallax, fade transitions
src/scenes/GameScene.ts                    # audio + parallax + fx hooks em cada evento
src/scenes/HUDScene.ts                     # FONTS, OVERLAY_DEPTH, refactor overlays sem Container
src/scenes/GameOverScene.ts                # músicas + vocalize + parallax + bounce
src/scenes/PauseScene.ts                   # pause_in/out SFX + back.easeOut title
package.json                               # + @fontsource/{rye,inter,jetbrains-mono}
```

## Dívidas que ficam

- **Sprites separados de Rei/Rainha/Calunga**: atlas `boss-maracatu` tem 1 frame apenas; seguimos com placeholders procedurais diferenciados. Hook no código só requer trocar 3 strings em `PreloadScene.PLACEHOLDERS` por `load.spritesheet` quando Visual Designer separar.
- **`public/assets/backgrounds/`, `ui/`, `vfx/` vazias**: `Parallax` procedural + `Effects` com `vfx-spark/ember` placeholders. Hook ready pra substituir quando art entregar.
- **Overlay "OXE!" / phase-intro / boss-defeated ainda não renderiza visualmente**: refactor de Container → elementos diretos com `setDepth(2000)` não resolveu. Elementos existem em display list com alpha=1, mas não aparecem em screenshot. Suspeita: conflito entre scene camera + alpha tween + HUD scene overlay. Não afeta mecânica (boss derrotado vira GameOver corretamente, HP bar anima, etc). Próximo ciclo de debug.
- **Logo como imagem**: enquanto não chega PNG real do Visual Designer, fica como `Text(boot.title)` em Rye. Substituição é uma linha quando o asset chegar.

## Ordem recomendada de merge

1. `feat/polish-m2.5` (este PR) → `main`
2. `feat/milestone-3-boss-maracatu` rebase em main + merge
3. Art PR do Visual Designer (backgrounds + logo + VFX + trio separado) rebase em main

Sem conflito previsto — polish toca em arquivos diferentes do M3 (que é só `src/bosses/` + MaracatuNacao integrada no GameScene que já existia).
