# Report — Gameplay Dev — Hotfix: strings + depth + player invisível

> Branch: `fix/critical-strings-depth`. Data: 2026-04-19 (consolidação dos hotfixes do visual-pivot + bugs críticos de produção).

## Objetivo

Três bugs críticos reportados pelo usuário pós-merge do `feat/visual-pivot`:

1. **"ARROCHA AÍ" ainda no menu** — `src/strings.ts` desatualizado em relação ao glossário revisado (PR #23 trocou "ARROCHA" porque é gíria baiana, não PE).
2. **Parallax cobrindo player/HUD** — camadas sem `setDepth` explícito na hierarquia certa.
3. **Nave invisível** — descoberto durante debug do bug 2: player renderizava frame 0 do spritesheet, que é um frame vazio. Sprite sheet `player.png` tem 17 frames mas vários são placeholders sem conteúdo.

Os 4 fixes anteriores do visual-pivot (nave fora de FS, bob, tiro diamante, parallax PNG) já estão aqui.

## O que foi feito

### 1. `src/strings.ts` ressincronizado chave-a-chave com `docs/GLOSSARY_PT_BR.md`

Mudanças principais (baseadas no glossário pós-revisão):

| Chave | Antes | Depois |
|---|---|---|
| `menu.play` | ARROCHA AÍ | **BORA, CABRA** |
| `menu.quit` | VAZAR | **SAIR** |
| `dialog.quit_confirm` | VAZAR MESMO? | SAIR MESMO? |
| `feedback.chain10` | TÁ ARRASANDO | **TÁ DOIDO!** |
| `feedback.damage` | AÍ, VIU? | **EITA!** |
| `feedback.life_up` | TÁ COM TUDO | **NOVA VIDA** |
| `pause.quit` | VAZAR PRO MENU | **VOLTAR PRO MENU** |
| `stage_end.quit` | VAZAR | SAIR |
| `gameover.4` | VOLTA ESSA FITA | **DANOU-SE** |

Também adicionadas as chaves que estavam só no glossário e não no ts: `codes.*`, `victory.*` (stats, poem, continue), `stage_end.stat_*`, `enemy.*`, `error.*`, `gameover.share_hint/shortcuts/retry/new_record`, etc. E removido `pickup.massa`, adicionados `pickup.danou` e `pickup.bicho`.

Sem hardcoded strings nas scenes — `grep -rn "'ARROCHA\|'VAZAR\|'TÁ COM TUDO" src/` retorna vazio.

### 2. Tabela de depths em `src/config.ts`

```ts
export const DEPTH = {
  PARALLAX_BACK:   -300,
  PARALLAX_MID:    -200,
  PARALLAX_FORE:   -100,
  ENEMY_BULLET:    0,
  ENEMY:           10,
  PLAYER_BULLET:   15,
  PLAYER:          20,
  VFX:             50,
  HUD:             1000,
  HUD_OVERLAY:     1100,
  PAUSE:           2000,
  FULLSCREEN_BTN:  3000
};
```

Aplicado em:
- `Parallax.ts`: 3 camadas nos depths corretos (antes -30/-20/-10, agora -300/-200/-100).
- `Player.ts`, `Bullet.ts`, `EnemyBullet.ts`, `Enemy.ts`, `BossMember.ts`: `setDepth(DEPTH.*)` no construtor.
- `HUDScene.ts`: `HUD_DEPTH = DEPTH.HUD`, `OVERLAY_DEPTH = DEPTH.HUD_OVERLAY`.
- `PauseScene.ts`: dim + textos em `DEPTH.PAUSE` / `DEPTH.PAUSE + 1`.
- `Effects.ts`: ParticleEmitter em `DEPTH.VFX`.
- `Fullscreen.ts`: botão em `DEPTH.FULLSCREEN_BTN`.

### 3. Bug da nave invisível — frame 0 vazio

Debuggin descobri durante a validação: `player.png` spritesheet (128×128, 17 frames de 32×32) tem frames **majoritariamente vazios**. Frame 0 (default quando `new Sprite(scene, x, y, 'player')`) é um dos vazios. Frame 10 é o que mostra o galo colorido (penas pink/turquoise/orange).

Fix: `super(scene, x, y, 'player', 10)` no `Player` constructor. Comentário avisa pra troca quando o Visual Designer padronizar as poses em `art/milestone-4`.

Testei frames 0-11 via `gs.add.image(x, y, 'player', i)` em linha (screenshot `hotfix-16-frames.png`). Só frames ~4-5 e ~9-10 têm conteúdo. Os outros renderizam vazio.

## Arquivos alterados

```
src/config.ts                          # DEPTH enum
src/strings.ts                         # ressync completo com glossário
src/entities/Player.ts                 # frame 10 + setDepth
src/entities/Bullet.ts                 # setDepth
src/entities/EnemyBullet.ts            # setDepth
src/entities/Enemy.ts                  # setDepth
src/bosses/BossMember.ts               # setDepth
src/systems/Parallax.ts                # depths centralizados
src/systems/Effects.ts                 # VFX depth
src/systems/Fullscreen.ts              # FS btn depth
src/scenes/HUDScene.ts                 # HUD_DEPTH central
src/scenes/PauseScene.ts               # PAUSE depths
docs/REPORT_GAMEPLAY_DEV_HOTFIX_STRINGS_DEPTH.md
docs/milestone-reports/hotfix/*.png
```

## Fixes herdados do visual-pivot PR anterior (ainda não mergeados antes deste branch)

1. **CSS #game sem `display:flex`** — evita conflito com `Scale.FIT + CENTER_BOTH`
2. **BOB idle** — `Player.startBob()` tween y±8px 1.2s Sine.easeInOut, pausa em i-frames
3. **Tiro diamante "Recife"** — `generateDiamondBullet` em PreloadScene (pink superior + amarelo inferior + outline roxo)
4. **Parallax PNGs** — `load.image('bg-fase1-{back,mid,fore}', …)` no Preload

## Validação Playwright

- **1920×1080 + 1024×768 + 800×600** testados
- [`hotfix-01-menu-sem-arrocha-1920.png`](milestone-reports/hotfix/hotfix-01-menu-sem-arrocha-1920.png): **menu agora mostra "BORA, CABRA"** com bg do galo + bandeirinhas de cordel. "OS CABRA" no topo, hint [ENTER] pra começar.
- [`hotfix-16-frames.png`](milestone-reports/hotfix/hotfix-16-frames.png): prova do bug — 12 frames do sprite sheet exibidos em linha, só frames 4 e 10 mostram galo, os outros vazios.
- [`hotfix-17-player-frame10-1920.png`](milestone-reports/hotfix/hotfix-17-player-frame10-1920.png): **após fix, player galo colorido VISÍVEL em x=400, y~540**, sobre o Marco Zero background, em 1920×1080.
- Console sem errors em gameplay normal (só AudioContext warning pré-gesture, esperado).
- HP bar do boss aparece por bug menor (staleness entre restarts do GameScene/HUDScene) — cosmético, não bloqueia. Anotado pra M3 reparar.

## Dívidas remanescentes

1. **HUDScene state leak**: boss HP bar renderiza antes do boss spawnar quando o GameScene é reiniciado via Menu→Game (instance field persists). Fix: reset em `create()` ou destroy em `scene.stop`. Cosmético, não urgente.
2. **Spritesheet do player com frames vazios**: fix temporário é usar frame 10. Visual Designer precisa padronizar em `art/milestone-4` — todos frames válidos ou documentar quais são idle/fire/hit.
3. **Parallax Fase 1 com layout que deixa metade inferior branca**: é característica do PNG atual do Visual Designer; o scroll mostra branco em certos momentos. Ajuste do PNG (conteúdo distribuído verticalmente) ou de `tileScaleY`.

## Próximo passo

- Aguardar review + merge deste PR consolidado.
- Fechar PR #26 (`fix/visibility-bob-bullet-parallax`) como obsoleto, apontando pra este.
- Rebasear `feat/milestone-3-boss-maracatu` (PR #14) em main após merge.
