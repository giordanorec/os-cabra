# Report — Gameplay Dev — Milestone 1 (Spike técnico)

> Branch: `feat/milestone-1-spike`. Data: 2026-04-19.

## Objetivo

Spike técnico: Player controlável na faixa inferior atirando em inimigo estático no topo. Zero arte final — retângulos coloridos com a paleta do `ART_BIBLE` (`#d4a04c` player, `#b84a2e` inimigo, `#f4e4c1` tiro).

## O que foi implementado

- **Fluxo de cenas** parcial: `BootScene → PreloadScene → GameScene`. Menu/HUD/GameOver ficam pro M2 conforme roadmap.
- **`PreloadScene`**: gera placeholders via `Graphics.generateTexture` para `player`, `bullet-player` e `enemy-static`. Sprites reais entrarão via Visual Designer em M8.
- **`Player`** (`src/entities/Player.ts`): `Phaser.Physics.Arcade.Sprite` com `setCollideWorldBounds(true)`. Move horizontal em 320 px/s (constante `PLAYER_SPEED`), dispara com cooldown 220ms (`PLAYER_FIRE_COOLDOWN_MS`).
- **`Bullet` + `BulletGroup`** (`src/entities/Bullet.ts`): pool `Phaser.Physics.Arcade.Group` com `maxSize: 32`, `runChildUpdate: true`. `Bullet.preUpdate` desativa corpo ao sair da tela. Nada destruído — tudo reciclado.
- **`Enemy`** (`src/entities/Enemy.ts`): base estática com HP, ponto e callback `onDeath`. Piscar branco 80ms em cada hit (`setTint(0xf4e4c1)` + delayedCall clearing). No M1, é estático no topo, HP=3, 100pts, respawna 400ms após morte (só pra validar loop).
- **`InputManager`** (`src/systems/InputManager.ts`): enum `Action` com MOVE_LEFT/RIGHT, FIRE, PAUSE, CONFIRM. Abstrai `addKey` do Phaser por keycodes. Seguindo `TECH_SPEC.md §6`.
- **`GameScene`**: orquestra Player + BulletGroup + Enemy. `physics.add.overlap(enemy, bullets)` trata hits (ver decisão abaixo). HUD de score temporário em `monospace 18px` (o HUD oficial entra em M2).
- **`main.ts`**: registra as três cenas, expõe `window.__osCabra` só em `import.meta.env.DEV` para facilitar debug no Playwright.

## Decisões técnicas

1. **Ordem dos args em `physics.add.overlap(group, sprite, cb)` em Phaser 4**. Quando o primeiro arg é group e o segundo é sprite, internamente Phaser chama `collideSpriteVsGroup(sprite, group, cb)` e invoca `cb(sprite, bulletFromGroup)` — **a ordem que chega na callback é invertida em relação à assinatura que o dev passa**. Fix adotado: **sempre registrar sprite primeiro, group depois**. Vale propagar pro padrão (enemies serão sprites individuais no M2-M3; enemy waves serão groups em M2, onde a ordem `group, group` evita a ambiguidade porém cabe reconfirmar).
2. **`setTintFill` não compila com tipos do Phaser 4**. Usado `setTint(color)` — efeito visual equivalente o bastante pro placeholder. Revisitar em M7 (polish) se o flash não tiver peso suficiente.
3. **`emit(event, arg)` recusado pelo TS** em `Phaser.GameObjects.Sprite`. Trocado por callback direto no config do Enemy (`onDeath: (points) => …`). Mais simples e tipado; só reavaliar se virar N consumidores por evento.
4. **Cena Menu pulada no M1**. O prompt descreve M1 como spike técnico "sem arte"; adicionar Menu só pra passar por ele em 30s é desperdício. Menu entra em M2 junto com HUD oficial e Game Over.
5. **`window.__osCabra` só em DEV**. Usado pra fechar o loop de inspeção no Playwright (consultar `scene.score`, `enemy.hp`, etc.). Stripado em build de produção por `import.meta.env.DEV`.

## Validação no Playwright (loop fechado)

- `npm run dev` em background na porta 5173, `npm run typecheck` limpo, `npm run build` OK (warning de chunk size é do scaffold, não é bloqueio).
- Abri http://localhost:5173/. Screenshot inicial: fundo marrom `#1a0f08`, player dourado 32×32 embaixo-centro (x=400, y=540), inimigo vermelho 36×36 no topo (x=400, y=120), "SCORE 000000" top-left, dica "[SETAS] move [ESPAÇO] atira" no rodapé. ([screenshot 01](milestone-reports/m1/m1-01-initial.png))
- **Movimento OK**: segurando ArrowRight via `window.dispatchEvent(keydown)` por 400ms, player saiu do centro pra borda direita. ArrowLeft por 550ms devolveu pra esquerda. ([screenshot 02](milestone-reports/m1/m1-02-after-right.png))
- **Tiro**: primeira rodada detectou bug — bullets fired (`bulletGroup.getLength()` subia de 0 pra N) mas score ficava em 0 e enemy sumia sem causa aparente. Rastreei via `console.log('[M1] overlap fired')` dentro da callback → **TypeError: e.takeHit is not a function**. Causa: ordem dos args invertida em Phaser 4 (detalhe acima). Fix: reordenar `overlap(enemy, playerBullets, …)`.
- **Depois do fix**: segurando SPACE por 2.5s, `scene.score = 200` e no frame seguinte `SCORE 000300` na tela (3 kills, cooldown 220ms + respawn 400ms). Enemy volta ativo após cada morte. ([screenshot 06](milestone-reports/m1/m1-06-collision-ok.png))
- Console sem erros reais após fix; único warning é `favicon.ico 404`, irrelevante pro gameplay. Pode virar microtarefa do DevOps adicionar `/public/favicon.ico`.

## Blockers / dúvidas pro arquiteto

- Nenhum blocker. A regra de ordem de args do `overlap` em Phaser 4 é contra-intuitiva e merece virar nota no `TECH_SPEC` — vou pedir ao arquiteto pra endossar e adiciono no §4 do spec em M2.
- Em aberto (resposta não urgente): **respawn do enemy estático em M1 é só pra provar o loop**. No M2 o spawn vem do `EnemySpawner` via waves JSON; posso descartar o `respawnEnemy` do GameScene sem cerimônia quando o spawner entrar.

## Próximo passo

M2 — Fase 1 jogável completa: spawner de ondas, inimigos Passista/Caboclinho/Mosca, colisão player×inimigo, vidas + i-frames, HUD oficial, Menu, Game Over, checkpoint a 50% das ondas.
