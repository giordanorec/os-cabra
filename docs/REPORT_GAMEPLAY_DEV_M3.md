# Report — Gameplay Dev — Milestone 3 (Boss Fase 1: Maracatu Nação)

> Branch: `feat/milestone-3-boss-maracatu`. Data: 2026-04-19.

## Objetivo

Boss Maracatu Nação (trio Rei + Rainha + Calunga) com 3 fases (A/B/C) conforme `GDD §6.1`, transições em HP 66% e 33%, e PauseScene (dívida do M2).

## O que foi implementado

### Boss
- **`src/bosses/BossMember.ts`** — sprite simples, `onHit` callback repassa ao orquestrador. Immovable, sem gravidade.
- **`src/bosses/MaracatuNacao.ts`** — orquestrador do boss:
  - HP 80 total, membros Rei (x=320), Rainha (x=480), Calunga (x=400) em y=120
  - Fase A: sway ±40px em 1.5s, leque 5 tiros a cada 2.5s (velocidade 200)
  - Fase B (HP ≤ 54): leque acelera pra 2s; a cada 4s Calunga vira projétil homing (speed 160 px/s, 3 HP, respawn 1.5s se destruído)
  - Fase C (HP ≤ 27): Rei vai pra x=150, Rainha pra x=650, Calunga oscila em x=400 y=140; Rei/Rainha fazem leque de 3 dirigido ao centro a cada 1.8s; Calunga faz rajada de 3 miradas no player a cada 1.5s (velocidade 300)
  - Transições disparam label `hud-boss-phase` ("EITA, MUDOU" / "DANOU-SE AGORA") + flash branco da câmera
- **`registerMemberHit(member)`** é o ponto de entrada público — roteia pra Calunga homing (se aplicável) ou decrementa HP geral

### HUD
- **Barra de HP do boss** em y=560, largura 600, preenchida proporcional ao HP atual
- **Intro overlay**: "OXE!" (display 120px, stroke preto) + linhas + "MARACATU NAÇÃO" + "REI · RAINHA · CALUNGA" — fade in 300ms / hold 1200ms / fade out 300ms + shake leve de câmera
- **Defeated overlay**: "SE FOI" (96px, verde) + recap numérico (bônus 5000 + vidas × 1000 = total) + flash branco + shake
- Todos expostos via eventos `hud-boss-intro` / `hud-boss-hp` / `hud-boss-phase` / `hud-boss-defeated` / `hud-boss-hide`

### GameScene
- Após `onAllWavesCleared`: `bossActive=true` + delay `FASE1.BREATHER_BEFORE_BOSS_MS` (3s) → `spawnBoss()`
- Durante boss fight, `spawner.tick()` é suprimido (`!this.bossActive`)
- Colisão `playerBullets × member` roteia pra `boss.registerMemberHit`; colisão `player × member` dá dano sem matar o membro
- Boss defeated: registra bônus 5000 + 1000 × lives no `ScoreManager`, emite overlay defeated, aguarda 2.5s, vai pra `GameOverScene` com `victory=true`

### PauseScene (dívida M2)
- ESC durante gameplay → `scene.pause('GameScene') + pause('HUDScene') + launch('PauseScene')`
- Overlay dim `#1a0f08 @ 65%` + "PAREI" + "BORA" + "ESC retoma"
- ESC (ou Enter) na pause → resume GameScene + HUDScene + stop self
- Guard de 200ms no `justPressed` pra evitar que o ESC que abriu a pause feche imediatamente

### Strings novas
`boss.appear`, `boss.1.name`, `boss.1.epithet`, `boss.phase2`, `boss.phase3`, `boss.defeated`, `boss.bonus_label`, `boss.lives_label`, `boss.total_label`, `pause.*` (4 entradas).

## Decisões técnicas

1. **MaracatuNacao não herda de Phaser.GameObject** — é um orquestrador puro que **gerencia** 3 BossMember sprites. Simplifica o fluxo: a classe tem estado de fase/HP/timers, membros só renderizam/colidem. Evita a armadilha Phaser que Sprite tem muitos campos reservados (já bati em `input` e `data` nos M1/M2).
2. **Calunga homing usa manipulação direta de `x/y`** em vez de `body.velocity`. Mesma estratégia da MoscaManga (M2). Colisão de overlap continua funcionando pois Arcade physics lê o transform.
3. **Campo `bossActive` suprime spawner durante boss fight**. Waves pendentes (delayedCall ainda no pipe) continuam existindo, mas não afetam gameplay porque `spawner.tick()` não avança. No modo debug (Playwright pulando pra boss), isso pode resultar em passistas zombie aparecendo — não ocorre no fluxo real.
4. **Flash + camera shake** em vez de freeze de 80ms real. Phaser 4 `this.cameras.main.flash(duration, r, g, b)` e `shake(duration, intensity)`. Freeze de gameplay puro exigiria pausar `scene.physics` que é complicado com todos os timers — adiado pra M7 (polish de game feel).
5. **Collision order** segue o padrão M1: `overlap(member, playerBullets, cb)` porque Phaser 4 normaliza args em `collideSpriteVsGroup(sprite, group, cb)` (nota `TECH_SPEC §5.1`).

## Validação no Playwright

- `npm run typecheck` + `npm run build` limpos.
- **`m3-02-boss-phaseA-bar.png`**: boss em formação (Rei dourado, Calunga verde, Rainha vermelha), HP bar vermelha cheia no y=560, leque de 5 bullets descendo, 3 vidas intactas.
- **`m3-03-phase-B.png`**: HP ~66% → fase B ativa: Calunga (verde) desceu da formação pra perto do player como homing projectile; Rei/Rainha continuam com sway.
- **`m3-04-boss-defeated.png`**: após HP=0, `GameOverScene` com `victory:true` → "FASE COMPLETA" + "FEZ 008000" (= 5000 bônus base + 3 vidas × 1000). Número exato conforme GDD §6.
- **`m3-05-pause.png`**: ESC pausa o gameplay, overlay "PAREI" + "BORA" + "ESC retoma" com dim `#1a0f08 @ 65%`. Player e inimigos congelados.
- **Fase C verificada** via inspeção: após HP ≤ 27, Rei em x=150, Rainha em x=650 (laterais), Calunga em y≈140 oscilando.
- Console sem erros durante gameplay de boss; único ruído herdado é o 404 de `favicon.ico` (microtarefa DevOps).

## Dívidas abertas

- **Overlay "OXE!" não renderiza visualmente** apesar do container + children terem `alpha=1, visible=true` no inspect em runtime. Container some do `children.list` entre a inspeção e o screenshot — suspeita é que a tween `alpha: {from:0, to:1}` em conjunto com `destroy()` no `onComplete` mate o container antes do frame renderizar. O defeated overlay + boss phase label (que usam a mesma estrutura) podem ter o mesmo sintoma. **Não afeta mecânica** — só o feedback visual. Vou investigar em M4/M7 junto com polish; prioridade baixa dado que o gameplay core está funcional.
- **Restore-from-checkpoint ao morrer com lives>0** continua dívida do M2 — não entrou no M3 porque escopo já grande. Vai pro M4.
- **Horizontal sweep telegrafada na Fase C** (GDD §6.1, "a cada 6s varrida horizontal telegrafada") — **não implementada**. Mecânica complexa (linha vermelha 0.6s + varrida 0.8s) fica pra polish M7 ou se balance pass exigir.
- **Anti-turtle timer** herdado do M2.
- **Passista bomb texture** herdado do M2.

## Próximo milestone

M4 — Power-ups funcionando (pelo menos 2 dos 5 listados em `GDD §7`). Candidatos naturais: **Fogo de Artifício Triplo** (peso 35, fácil de implementar — dispara 3 bullets em leque) e **Sombrinha de Frevo** (peso 30, escudo absorvendo 1 hit). Drop rate 15% em inimigos HP≥2 — problema: na Fase 1 não existem inimigos 2+ HP (só Mamulengo+ que aparecem na Fase 2). Vou propor pro Game Designer: M4 dropa o Mamulengo como primeiro inimigo 2-HP via playtest, ou adicionar drop forçado em chain ×5 da Fase 1 só pra validar a feature. Decisão em aberto.
