# Report — QA — Milestone 1 (spike técnico)

> Branch: `qa/milestone-1-report`. Data: 2026-04-19. QA: giordanorec.
> **Sinal**: 🟢 **VERDE** — M1 aceito pelo QA.

## Escopo do ciclo

M1 entrega o spike técnico de gameplay (player móvel na faixa inferior atirando em inimigo estático no topo). Sem Menu, HUD oficial, Game Over, pausa, áudio, nem persistência — tudo isso está explicitamente adiado pro M2 em `REPORT_GAMEPLAY_DEV_M1.md`. O QA validou o que **existe** e fixou placeholders de teste pro que vai entrar depois.

Commit validado: `21f3a26` (merge `feat/milestone-1-spike`).

## O que foi testado

### Suíte automatizada (`tests/smoke/`)

Foi scaffoldada a primeira suíte de smoke do projeto usando `@playwright/test@1.59.1` contra Chromium headless (1366×768). Rodando em ~16s, 6 tests:

| # | Caso | Arquivo | Resultado |
|---|---|---|---|
| 1 | TC-001 — movimento horizontal respeita world bound | `tc001-move-and-fire.spec.ts` | ✅ |
| 2 | TC-001 — Space dispara com cooldown e sobe score | `tc001-move-and-fire.spec.ts` | ✅ |
| 3 | TC-002 (adaptado M1) — estado inicial consistente | `tc002-enemy-collision-m1.spec.ts` | ✅ |
| 4 | TC-002 (adaptado M1) — kill → respawn 400ms sem pageerror | `tc002-enemy-collision-m1.spec.ts` | ✅ |
| 5 | TC-007 — ESC não pausa em M1 (regressão guard) | `tc007-pause-m1.spec.ts` | ✅ |
| 6 | TC-007 — ESC pausa/retoma (M2) | `tc007-pause-m1.spec.ts` | ⏭ `.fixme` |

**Reproduzir**: `npm install && npx playwright test` (o `webServer` do `playwright.config.ts` sobe Vite em `--strictPort 5173`).

### Screenshots de referência (`docs/qa_screenshots/milestone_1/`)

Gerados pela própria suíte — ground truth pra comparação visual em milestones futuros:

- `tc001-01-after-right.png` — player na borda direita após ArrowRight 500ms.
- `tc001-02-after-left.png` — player na borda esquerda após ArrowLeft 700ms.
- `tc001-03-after-fire.png` — HUD `SCORE 000200`, 2 bullets em voo, enemy acertado.
- `tc002-respawn.png` — enemy respawnado após 2500ms de firing + 1200ms de wait.

### Adaptações feitas

- **TC-002 adaptado**: o caso original cobre colisão player×enemy com vidas + i-frames. M1 não tem sistema de vidas; o spec valida o overlap que **existe** (bullet×enemy + respawn) e marca lacuna pra M2.
- **TC-007 dobrado**: um teste afirma o comportamento atual (ESC não pausa) pra detectar regressão acidental. Outro está `.fixme` com o assert invertido, pronto pra ser ativado quando M2 implementar pausa.
- **TCs 003/004/005/006/008 não têm smoke**: features ainda não existem no código. Ficarão pendentes até o milestone correspondente.

## Decisões de QA

1. **Estratégia de validação via worktree isolado**. A working tree compartilhada (memory `feedback_shared_worktree`) pegou o momento em que outra sessão estava modificando arquivos M2 — rodar tests ali contaminaria a validação. Solução: `git worktree add /tmp/oscabra-m1-qa 21f3a26` pra validar contra o commit exato de M1, sem interferir nos arquivos modificados da outra sessão. **Padrão a repetir** em QA de milestones futuros.
2. **Playwright headless em vez do MCP**. O MCP do Playwright estava com lock travado por outra sessão; em vez de forçar kill, migrei pra `@playwright/test` local com `webServer` automático — além de destravar, esse entregável agora fica no repo e pode rodar em CI. Ver `playwright.config.ts`.
3. **`window.__osCabra` como hook de QA**. O Gameplay Dev já expôs `window.__osCabra` só em `import.meta.env.DEV`. Uso direto nos specs pra ler `scene.score`, `enemy.hp`, `player.x`, etc. — mais estável que OCR em screenshot e não polui build de produção. Recomendo manter e documentar no `TECH_SPEC.md` como contrato de testabilidade.
4. **Tempo de wait pós-firing**. Primeira versão do TC-002 esperava só 600ms pós-release — flaky porque bullets ainda em voo (tempo de trajeto ~720ms a `BULLET_SPEED=560`) colidiam com o enemy recém-respawnado. Subido pra 1200ms (voo + 400ms de delayedCall + margem). Registrado em comentário no próprio spec.

## Bugs reportados

**Nenhum.** Todas as falhas vistas durante o ciclo foram de origem identificada fora do código M1:

- **Score corruption (`"0[object Object][object Object]"`)** — apareceu rodando contra a working tree enquanto outra sessão tinha código M2 em progresso (novo `ScoreManager`, `EnemySpawner`, etc.). Reproduz apenas naquele estado; **não reproduz no commit M1**. Pode reaparecer no QA de M2 se o código seguir esse caminho — flag pro próximo ciclo.
- **`favicon.ico 404`** — já reconhecido no `REPORT_GAMEPLAY_DEV_M1.md` e ativamente corrigido na branch `art/favicon` (outra sessão). Não abri issue pra não duplicar.

## Recomendações pro arquiteto

- **Pode mergear e partir pra M2.** M1 atinge o que se propôs (spike de viabilidade) e a suíte automatizada garante que regressões nesse mínimo sejam detectadas.
- **Eleger `window.__osCabra` como contrato de QA** no `TECH_SPEC`. Descrever quais campos são estáveis (scene, player.x/y, enemy.hp/active, score) — quando M2 introduzir `ScoreManager`, manter a API de leitura pra não quebrar a suíte.
- **Adicionar `tests/smoke/` ao CI** assim que houver CI (hoje `npm run build` roda só manualmente). Sugestão: GitHub Action rodando `npm run typecheck && npm run build && npx playwright test`.
- **Marcar pausa (ESC) como primeira feature do M2 checklist**. O `.fixme` do TC-007 já está pronto pra ativar.

## Próximo ciclo

M2 vai triplicar a superfície: Menu + HUD + Game Over + spawner de ondas + 3 inimigos + pausa + vidas/i-frames + checkpoint. Checklist QA vai cobrir TC-002 completo, TC-003 (power-ups, se entrarem), TC-004 (checkpoint), TC-007 (pausa real). Provavelmente serão ~15-20 specs. Reaproveitar `helpers.waitForGameReady` — o contrato do `window.__osCabra` é o que garante isso.
