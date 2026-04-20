# Report — QA — Milestone 2 (Fase 1 jogável)

> Branch: `qa/milestone-2-report`. Data: 2026-04-19. QA: giordanorec.
> **Sinal**: 🟡 **AMARELO** — M2 aceito com 1 bug P2 aberto (#15) + 1 dívida reconhecida pelo dev (checkpoint).

## Escopo do ciclo

M2 entrega Fase 1 jogável inteira: Menu → GameScene (com spawner de 5 waves, HUDScene paralela, colisão player×inimigo com i-frames e sistema de vidas, ScoreManager com chain multiplier + highscore via localStorage) → GameOverScene. Validação contra `db97f38` (merge `feat/milestone-2-fase1`), re-rodada contra main tip `c1a5138` (só adiciona assets de arte que não afetam suíte).

## O que foi testado

### Suíte automatizada (`tests/smoke/`)

Reestruturada pra cobrir a nova superfície. **16 passed, 1 skipped (`.fixme`), 0 failed** em ~50s.

| # | Caso | Arquivo | Resultado |
|---|---|---|---|
| 1 | TC-001 — movimento horizontal respeita bounds | `tc001-move-and-fire.spec.ts` | ✅ |
| 2 | TC-001 — Space dispara e ScoreManager sobe; HUD sincroniza | `tc001-move-and-fire.spec.ts` | ✅ |
| 3 | TC-002 — estado inicial: 3 vidas, 3 ícones HUD | `tc002-collision-m2.spec.ts` | ✅ |
| 4 | TC-002 — dano debita 1 vida + liga i-frames; hit durante i-frame não debita | `tc002-collision-m2.spec.ts` | ✅ |
| 5 | TC-002 — 3 hits válidos zeram vidas e disparam endGame | `tc002-collision-m2.spec.ts` | ✅ |
| 6 | TC-004 — wave 0 spawna 3 caboclinhos após ~1500ms | `tc004-waves-m2.spec.ts` | ✅ |
| 7 | TC-004 — limpar waves 0-2 grava checkpoint em waveIndex=3 | `tc004-waves-m2.spec.ts` | ✅ |
| 8 | TC-005 — Game Over grava `{best, updatedAt}` no localStorage | `tc005-highscore-m2.spec.ts` | ✅ |
| 9 | TC-005 — score menor NÃO sobrescreve recorde maior | `tc005-highscore-m2.spec.ts` | ✅ |
| 10 | TC-005 — após reload, MenuScene mostra `RECORDE: \d{6}` | `tc005-highscore-m2.spec.ts` | ✅ |
| 11 | HUD — estrutura inicial (3 vidas, 000000, mult oculto) | `hud-m2.spec.ts` | ✅ |
| 12 | HUD — chain de 5 kills liga ×1.5 com score 550 | `hud-m2.spec.ts` | ✅ |
| 13 | HUD — chain expira após `CHAIN_RESET_MS` e mult some | `hud-m2.spec.ts` | ✅ |
| 14 | Game Over — zerar vidas leva à scene com score preservado | `gameover-m2.spec.ts` | ✅ |
| 15 | Game Over — Enter volta pra MenuScene | `gameover-m2.spec.ts` | ✅ |
| 16 | TC-007 — ESC não pausa (regressão guard) | `tc007-pause.spec.ts` | ✅ |
| 17 | TC-007 — ESC pausa/retoma (M3+) | `tc007-pause.spec.ts` | ⏭ `.fixme` |

### Screenshots (`docs/qa_screenshots/milestone_2/`)

Ground truth visual — 9 imagens:

- `tc001-01-after-right.png`, `tc001-02-after-fire.png` — player move + 4s de firing.
- `tc002-after-hit.png` — HUD após 1 vida perdida (2 ícones sólidos + 1 silhueta).
- `tc004-01-wave0-spawned.png`, `tc004-02-checkpoint-saved.png` — wave 0 com caboclinhos no topo + estado pós-checkpoint.
- `tc005-menu-highscore.png` — menu com `RECORDE: 012345`.
- `hud-01-initial.png`, `hud-02-chain-multiplier.png` — HUD vazia vs HUD com `×1.5` ativo.
- `gameover-01-se-lascou.png` — tela "SE LASCOU" vermelha + `FEZ 000500`.

### Estratégia

- **Worktree isolado** em `/tmp/oscabra-m2-qa` pra não disputar a working tree com a sessão de M3 que roda em paralelo (memory `feedback_shared_worktree` em ação).
- **APIs de runtime via `window.__osCabra`** em vez de simular colisões físicas. Razão: a topologia de waves varia no tempo (delays de 1500ms+), e scripts que dependem de inimigo cruzar o player ficam flaky. Usar `player.takeDamage(now)` e `scoreManager.registerKill(pts, now)` torna os asserts determinísticos. Cobre o **efeito** (vidas caem, i-frames ligam, HUD atualiza) que é o que interessa pro QA.
- **Phaser `JustDown` exige up→down entre updates** — `keyboard.press` do Playwright é rápido demais. Helpers `waitForGameplay` e `gameover-m2` usam `down + 50ms + up`. Descoberto debugando — agora documentado em `helpers.ts`.

## Decisões de QA

1. **TC-002 original (vidas + i-frames) agora validável de ponta a ponta**. Em M1 era placeholder; em M2 `takeDamage` + `invulnUntilMs` + `lifeIcons.setVisible` cobrem o caso do QA_PLAN palavra por palavra.
2. **TC-004 adaptado**. O caso original ("morrer, voltar pro checkpoint") não é validável em M2 — o próprio dev declarou dívida no REPORT_GAMEPLAY_DEV_M2 §Decisões #3: `saveCheckpoint` grava mas `scene.start('GameScene')` no restart não passa o checkpoint. Em M2 o caminho é *Game Over*, não *respawn*. A cobertura fica dividida: **TC-004 hoje** valida que o checkpoint é criado; **M3 amplia** pra validar restauração.
3. **TC-003 (power-ups)** e **TC-008 (boss)** — não existem no M2 por design. Specs vão entrar em M4 e M3 respectivamente.
4. **TC-007 com assert inverso (regressão guard)**. A hint `[ESC] pausa` está presente na HUD, mas o dev já declarou dívida — hoje ESC não faz nada. Spec guarda `isPaused === false`. Quando pausa entrar, removemos o guard e ativamos o `.fixme`.
5. **localStorage é limpo a cada TC-005** via `beforeEach`. Testes de highscore viajavam entre si quando a chave persistia — importante pra confiabilidade em CI.
6. **`_debug-*.spec.ts` temporários** foram usados pra mapear comportamento do ESC e do Enter — removidos antes do commit. Deixei o aprendizado em comentários do `helpers.ts`.

## Bugs reportados

- **[#15](https://github.com/giordanorec/os-cabra/issues/15)** — **P2 UX** — HUD promete `[ESC] pausa` mas pausa não está implementada. Recomendação: implementar em M3 ou remover a string da hint. `tc007-pause.spec.ts` já tem `.fixme` pronto pra ativar quando a feature entrar.

**Dívidas declaradas pelo dev** (não filei issues — acompanhadas no REPORT_GAMEPLAY_DEV_M2):
- §Decisões #3 — restauração do checkpoint pós-death. Escopo: M3.
- §Decisões #4 — bombinha do Passista compartilha textura da flecha. Escopo: M7 (polish).

## Recomendações pro arquiteto

- **Pode mergear a QA (este PR)**. M2 tá estável e coberto pela suíte — se M3 introduzir regressão nos pontos cobertos, a gente pega imediatamente.
- **Decidir issue #15 antes de fechar M3**. Implementar pausa é barato (scene.pause + scene.launch PauseScene) se for fazer agora, evita a dissonância UX continuar.
- **Eleger o contrato `window.__osCabra`** no TECH_SPEC (repetindo recomendação do M1): quais campos são estáveis. Hoje a suíte pesa em `player.{x,lives,invulnUntilMs,takeDamage}`, `scoreManager.{value,multiplierActive,registerKill,tick}`, `spawner.{currentWaveIndex,isIdle}`, `enemies.{getLength,getChildren}`. Se M3 renomear algum, 10+ specs quebram — vale formalizar.
- **CI**: com a suíte em 16 specs / ~50s, vale automatizar em GitHub Action. Sugestão de workflow: `npm ci && npm run typecheck && npm run build && npx playwright install --with-deps chromium && npx playwright test`.

## Próximo ciclo (M3 — boss Maracatu Nação)

Plano de cobertura:
- **TC-008** — novo spec `tc008-boss-m3.spec.ts`: spawn do boss, barra de HP, transições de fase 66%/33%, derrota com "SE FOI" + bônus.
- **TC-004 continuação** — `tc004-checkpoint-restore.spec.ts`: morrer depois do checkpoint, ver se volta com vidas salvas (valida a dívida fechada).
- **TC-007** — se a issue #15 for resolvida, desligar o `.fixme`.
- **Playtesters externos** — 3-5 pessoas, agora que tem boss + progressão + highscore pra perseguir.
- **Perf**: começar medição formal de FPS num loop de 30 min, especialmente durante o boss (mais bullets + partículas).
