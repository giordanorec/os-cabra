# Matriz de compatibilidade — Os Cabra

> Mantida pelo QA. Ver `QA_PLAN.md` §2 pra ambientes alvo.
> Legenda: ✅ passou • ❌ falhou • ⚠️ passou com ressalva • ❓ não testado.

## Escopo atual

M1 é um spike técnico (player móvel + tiro + inimigo estático). Não há Menu, HUD oficial, Game Over, audio ou persistência ainda. Cobertura completa começa em M2.

## Resultados por milestone

| Milestone | Chrome/Linux | Chromium headless (Playwright) | Firefox/Linux | Safari/Mac | Edge/Win |
|---|---|---|---|---|---|
| M1 (spike) | ❓ | ✅ | ❓ | ❓ | ❓ |

## M1 — detalhe por dimensão

**Build**: `21f3a26` (merge `feat/milestone-1-spike`). Commit principal `cdaeff8`.
**Validado em**: 2026-04-19 (Ubuntu 24.04, Node 22, Phaser 4.0.0, Vite 8.0.8).
**Ferramenta**: `@playwright/test` 1.59.1, Chromium `cft 147.0.7727.15` (playwright v1217), viewport 1366×768.

| Dimensão | Resultado M1 | Observação |
|---|---|---|
| `npm run dev` carrega sem pageerror | ✅ | Único warning ignorado: `favicon.ico 404` (público, não gameplay) |
| `npm run typecheck` limpo | ✅ | — |
| `npm run build` produz `dist/` | ✅ | Warning de chunk size do scaffold — não bloqueia |
| Movimento horizontal (ArrowLeft/Right) | ✅ | TC-001: 500ms ArrowRight → Δx ≥ 80px; respeita world bound (≤784px) |
| Tiro com cooldown (Space) | ✅ | TC-001: 2500ms Space → score ≥ 200, HUD `SCORE \d{6}` |
| Overlap bullet×enemy (fix de ordem Phaser 4) | ✅ | TC-002: sem pageerror durante 2500ms de firing, sem `takeHit is not a function` regredindo |
| Respawn de enemy estático 400ms após morte | ✅ | TC-002: enemy ativo e hp=3 após 1200ms da liberação do Space |
| ESC pausa GameScene | ❌ (esperado em M1) | TC-007: pressão ESC não pausa — pausa ainda não implementada; cobertura M2 (teste `.fixme` pronto) |
| Menu / Game Over / HUD oficial | ❓ | fora de escopo do M1 (ver roadmap M2) |
| Áudio | ❓ | fora de escopo do M1 |
| Persistência (`localStorage`) | ❓ | fora de escopo do M1 |
| FPS ≥ 55 | ⚠️ | Não medido formalmente. Smoke roda sem travas perceptíveis em Chromium headless |
| Leak 30 min | ❓ | A agendar semanalmente; M1 não contempla (cena única) |

## Pendências pra próximos milestones

- **M2**: preencher linha "M2" da tabela master. Cobrir TC-003 (power-up), TC-004 (checkpoint), TC-007 (pausa real), TC-008 (boss).
- **Browsers extras**: Firefox/Safari/Edge exigem teste humano. Playwright MCP usa só Chromium.
- **Playtest externo** (3-5 testers): combinar com o orquestrador a partir de M2, quando já houver fase completa.

## Como reproduzir localmente

```bash
npm install
npm run dev                # sobe em http://localhost:5173
npx playwright test        # roda tests/smoke/*.spec.ts (webServer herda server acima ou levanta novo)
```

Screenshots de referência em `docs/qa_screenshots/milestone_1/` — são ground truth pra comparar contra milestones futuros.
