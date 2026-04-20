# Matriz de compatibilidade — Os Cabra

> Mantida pelo QA. Ver `QA_PLAN.md` §2 pra ambientes alvo.
> Legenda: ✅ passou • ❌ falhou • ⚠️ passou com ressalva • ❓ não testado.

## Resultados por milestone

| Milestone | Chrome/Linux | Chromium headless (Playwright) | Firefox/Linux | Safari/Mac | Edge/Win |
|---|---|---|---|---|---|
| M1 (spike) | ❓ | ✅ | ❓ | ❓ | ❓ |
| M2 (Fase 1 jogável) | ❓ | ✅ | ❓ | ❓ | ❓ |

## M2 — detalhe por dimensão

**Build**: `db97f38` (merge `feat/milestone-2-fase1`). Validação contra main tip `c1a5138` — diferença são só assets de arte (sprites Fase 1 + boss Maracatu) que não afetam a suíte. Commit de feature: `dd5032d`.
**Validado em**: 2026-04-19 (Ubuntu 24.04, Node 22, Phaser 4.0.0, Vite 8.0.8).
**Ferramenta**: `@playwright/test` 1.59.1, Chromium `cft 147.0.7727.15` (playwright v1217), viewport 1366×768.

| Dimensão | Resultado M2 | Observação |
|---|---|---|
| `npm run dev` carrega sem pageerror | ✅ | Console limpo ao longo da suíte (pageerror listener em todo teste) |
| Menu → GameScene via Enter | ✅ | TC-005 (reload) + `waitForGameplay` em 16 specs |
| HUD: 3 vidas, SCORE 000000, multiplicador oculto no start | ✅ | hud-m2 §estrutura inicial |
| HUD: chain ≥5 kills em <4s liga `×1.5` | ✅ | hud-m2 §chain multiplier — score calculado 550 pts (4×100 + round(100×1.5)) |
| HUD: chain expira após `CHAIN_RESET_MS` | ✅ | hud-m2 §chain expira |
| HUD: ícones de vida decrescem conforme dano | ✅ | TC-002 §dano debita 1 vida |
| Colisão player×inimigo consome 1 vida | ✅ | TC-002 §dano debita 1 vida |
| I-frames `PLAYER_INVULN_MS` (1200ms) bloqueiam novo dano | ✅ | TC-002 §hit durante i-frames não debita |
| Game Over em lives=0 → GameOverScene com score | ✅ | TC-002 §3 hits → GameOver, Gameover-m2 §score preservado |
| Enter em Game Over volta pra MenuScene | ✅ | Gameover-m2 §Enter volta pro menu |
| Highscore grava em `localStorage['os_cabra_highscore']` | ✅ | TC-005 §Game Over grava |
| Highscore NÃO sobrescreve valor maior | ✅ | TC-005 §score menor NÃO sobrescreve |
| Highscore persiste após reload (menu mostra `RECORDE:`) | ✅ | TC-005 §após reload |
| Waves: wave 0 spawna 3 caboclinhos após ~1500ms | ✅ | TC-004 §wave0 spawned — 3 em ≤4s |
| Waves: progressão + checkpoint em wave-3-enfeite | ✅ | TC-004 §checkpoint saved — `checkpoint.waveIndex === 3`, lives preservados |
| Checkpoint restauração pós-death | ❓ | Fora de escopo M2; dev declarou dívida no REPORT_GAMEPLAY_DEV_M2 §Decisões #3. Fica pra M3. |
| ESC pausa GameScene | ❌ | TC-007: HUD promete `[ESC] pausa` mas não há implementação. Issue #15 aberta. `.fixme` pronto pra ativar quando entregar |
| TC-003 (power-ups) | ❓ | Power-ups não estão no M2 (planejado pra M4 segundo GDD) |
| TC-008 (boss) | ❓ | Boss entra em M3 |
| Áudio | ❓ | Não implementado em M2 |
| FPS ≥ 55 | ⚠️ | Não medido formalmente. Suíte completa rodou em ~50s com 16 specs passando |
| Leak 30 min | ❓ | A agendar — não bloqueia M2 |

## M1 — histórico (resumo)

M1 validado em `21f3a26` (spike técnico). Todos os TCs aplicáveis passaram via 5 specs (incluindo regressão guard da ordem de args em `physics.add.overlap` do Phaser 4). Detalhes em `docs/REPORT_QA_M1.md`.

## Pendências pra próximos milestones

- **M3**: TC-008 (boss), restauração do checkpoint pós-death, e reavaliar `.fixme` do TC-007 quando pausa entrar.
- **M4**: TC-003 (power-ups).
- **Browsers extras**: Firefox/Safari/Edge exigem teste humano. Playwright MCP usa só Chromium.
- **Playtest externo** (3-5 testers): combinar com o orquestrador agora que M2 tem fase jogável completa.

## Como reproduzir localmente

```bash
npm install
npm run dev                # sobe em http://localhost:5173
npx playwright test        # roda tests/smoke/*.spec.ts
npx playwright test --grep TC-007  # isola um caso quando precisa debugar
```

Screenshots de referência em `docs/qa_screenshots/milestone_N/` — ground truth visual por milestone pra comparar regressões.
