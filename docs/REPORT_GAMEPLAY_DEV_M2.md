# Report — Gameplay Dev — Milestone 2 (Fase 1 jogável)

> Branch: `feat/milestone-2-fase1`. Data: 2026-04-19.

## Objetivo

Fase 1 completa: menu → gameplay com waves, HUD, colisão + vidas + i-frames, game over e fase completa. Sem arte final (placeholders seguem da M1).

## O que foi implementado

### Fluxo de cenas
`BootScene → PreloadScene → MenuScene ↔ GameScene (+ HUDScene paralela) → GameOverScene → MenuScene`.

### Novos sistemas
- **`src/strings.ts`** — subset do `GLOSSARY_PT_BR.md` com `getString(key, ...args)`. Substitui `%n` por argumentos. Expansível.
- **`src/systems/InputManager.ts`** — mantido do M1 (já centralizava `Action.CONFIRM`/`FIRE`/`PAUSE`).
- **`src/systems/ScoreManager.ts`** — score + chain multiplier (×1.5 após 5 kills sem dano, reset após 4s sem kill ou ao tomar dano) + highscore localStorage (chave `os_cabra_highscore`).
- **`src/systems/EnemySpawner.ts`** — consome `waves/fase1.ts` em ordem; entre waves respeita `delayAfterPreviousMs` apenas quando todos os inimigos da wave anterior foram limpos (mortos ou saíram da tela). Dispara callbacks `onEnemySpawned`, `onEnemyKilled`, `onCheckpoint`, `onAllWavesCleared`.
- **`src/systems/waves/fase1.ts`** — 5 waves conforme `docs/waves/fase1.md`: abertura (3 Caboclinhos), vai-e-vem (4 Passistas), enfeite com checkpoint (2+2 mix), enxame da manga (10 Moscas + 1 Caboclinho), cortejo (5 Passistas em V + 2 Caboclinhos diagonais).

### Entidades
- **`Player`** agora tem `lives`, `takeDamage(time)` com i-frames 1.2s e blink 8Hz (alpha 1↔0.3), callbacks `onDamage`/`onDeath`.
- **`Enemy`** base com hook `protected onTick(time, delta)` sobrescrito por subclasses + auto-cleanup quando sai da tela.
- **`Caboclinho`** — descida reta 150 px/s, fogo 1 flecha ao cruzar `y=200` se `canFire` true, suporta `diagonalInward` (30° em relação ao eixo y).
- **`PassistaFrevo`** — zigzag senoidal amplitude 150 / período 2.2s, descida 95 px/s, bombinha parabólica (vy=160, g=400) a cada 2.5s; `zigzagStartDir` controla fase inicial.
- **`MoscaManga`** — orbital ao redor de um centro virtual descendo 100 px/s, amplitude 40, período 1.2s, 10 pts, só colisão.
- **`EnemyBullet` + `EnemyBulletGroup`** — pool com 2 modos: `fireLinear(x,y,vx,vy)` (flecha) e `fireParabolic(x,y,vx,vy,gravityY)` (bombinha). Auto-disable offscreen.

### UI
- **`MenuScene`** — título pulsando (Sine.easeInOut 1.0↔1.06), `[ENTER] pra começar`, `RECORDE: %n` se `localStorage > 0`.
- **`HUDScene`** — 3 slots de vida (cor sólida quando cheia + silhueta @ 30% alpha quando perdida), SCORE 6 dígitos, `×1.5` condicional (só aparece com chain ativo), dica de controles no rodapé. Bottom strip de power-up fica pra M4. Comunicação via `events.emit('hud-lives'/'hud-score'/'hud-phase-intro'/'hud-checkpoint')` da `GameScene`.
- **`GameOverScene`** — dupla função: "SE LASCOU" (`victory:false`, vermelho) vs "FASE COMPLETA" (`victory:true`, dourado). Score final em mono bold. `[ENTER]` volta pro menu.

## Decisões técnicas

1. **Menu super-minimal**. Entregue só "Play" por enquanto. Códigos/Créditos/Sair (itens 2-4 do `UX_SPEC §2.Menu`) ficam em milestone posterior (M8/M9). Justificativa: menu extenso ainda não tem valor sem códigos implementados. Quando `ShareCodeScene` entrar, volto ao menu.
2. **Pause ainda não implementada**. ESC hint aparece no HUD, mas a cena `PauseScene` fica pra M4/M7 junto com polish. M2 foca em ondas-jogáveis.
3. **Checkpoint implementado como snapshot + resume, mas sem death-mid-stage ainda**. `onCheckpoint` salva `{waveIndex, lives, score}` e dispara HUD flash "ONDE EU TAVA". Porém a restauração real acontece no `create()` da `GameScene` apenas se `this.checkpoint != null`, o que **nunca acontece** no fluxo atual porque o restart envolve `scene.start('GameScene')` sem passar checkpoint. Isso é uma **dívida M2**: o fluxo certo é restart = `scene.restart` preservando campo. Vou fechar isso no M3 junto com reviver-do-checkpoint pós-death mas ainda vidas > 0 (cena não precisa ser totalmente recriada).
4. **Bullet textures não diferenciadas**. `EnemyBulletGroup` recebe um só texture (`enemy-bullet-flecha` por enquanto). Bombinha do Passista compartilha o sprite da flecha — visualmente não-ótimo. Fix em M7 (polish): ou um pool por tipo, ou um field `textureOverride` em `fireParabolic`.
5. **Colisão player × enemy também mata o inimigo** — para inimigos comuns. Fez sentido pelo GDD §5.1 ("colisão direta com inimigo: 1 vida perdida + inimigo também morre"). O bloco de código usa `enemy.takeHit(99)` pra garantir a morte. Boss (M3) vai ignorar isso.
6. **Mosca Manga com orbital direto setando x/y**. Subclasse zera a velocidade do body e escreve em `this.x/this.y` por frame. Arcade physics ainda atualiza `body.position` a partir do transform, colisões funcionam normalmente. Confirmado no Playwright — moscas causam dano quando encostam no player.
7. **`data` e `input` do Scene são ocupados**. Já tinha batido no M1 (`input`). Agora no `GameOverScene` usei `this.overData` porque `this.data` é o `DataManager` do Phaser. Vale ficar no radar: campos do Scene reservados incluem `scene`, `cameras`, `add`, `make`, `input`, `anims`, `cache`, `registry`, `sound`, `textures`, `events`, `scale`, `plugins`, `tweens`, `time`, `physics`, `data`.
8. **Vite reiniciou no meio do teste**. O dev server foi pra porta 5174 porque outra instância zumbi ocupava 5173. Sem impacto no código — só relevante durante debug. Reiniciei a sessão e rodou limpo.

## Validação no Playwright

- `npm run typecheck` limpo; `npm run build` OK.
- `m2-01-menu.png`: Menu com OS CABRA, tagline, ARROCHA AÍ pulsando, hint.
- `m2-03-wave2-playing.png`: HUD com `SCORE 000120` + 2 vidas cheias + 1 silhueta (vida perdida), player embaixo, sem inimigos no meio (wave 1 limpa, wave 2 em cooldown de 10s).
- `m2-05-wave2-passista.png`: 4 Passistas laranja escuros em posições zigzag diferentes, múltiplas balas do player em voo, HUD `SCORE 000120` com 3 vidas.
- `m2-06-victory.png`: Após limpar todas as 5 waves: "FASE COMPLETA" dourado + "FEZ 001240".
- `m2-07-se-lascou.png`: Forcei lives=0 + takeDamage → "SE LASCOU" vermelho + "FEZ 000999".
- `m2-08-menu-with-highscore.png`: Enter volta ao menu, aparece `RECORDE: 001240` no rodapé (localStorage persistiu).
- Console: zero errors em gameplay normal. Único log é `Phaser v4.0.0 (WebGL | Web Audio)` + o `favicon.ico 404` (microtarefa DevOps).

### Playthrough sintético

`EnemySpawner.currentWaveIndex` observado subindo 0→1→2→3→4→5 ao longo de ~80s (com cooldowns respeitados). Score final 1240 ≈ 57% dos ~2160 pontos máximos da fase (passei por waves 4 e 5 sem mirar com precisão no teste automatizado).

## Dívidas / próximos passos pro M3

- **Restaurar vidas a partir do checkpoint quando player morre com lives>0**: hoje Game Over manda pra MenuScene. No M3 preciso: ao `lives=0` olhar checkpoint → se existe, fazer `scene.restart` preservando checkpoint e vidas salvas; só ir pra GameOver se sem checkpoint. GDD §8.
- **PauseScene** — entra no M3 junto com menu de pause + "PAREI".
- **Passista bomb texture** — pool com textureOverride ou 2 groups.
- **Anti-turtle timer** (fase1.md §Contingências) — se 30s sem spawn novo, inserir 2× Caboclinho extras a cada 10s. Não é crítico pra M2 mas pode entrar em polish.

## Próximo milestone

M3 — Boss Maracatu Nação (Fase A/B/C com transições HP 66/33%, letreiro "OXE!", barra de HP) conforme `GDD §6.1`.
