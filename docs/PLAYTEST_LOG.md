# Playtest Log — Os Cabra

> Log de sessões de playtest. Uma entrada por sessão.
> Formato: ver `QA_PLAN.md` §7.

---

## Playtest 2026-04-19 — Milestone 1 (spike técnico)

- **Tester**: QA (automatizado via Playwright + inspeção visual dos screenshots)
- **Build**: `21f3a26` (merge `feat/milestone-1-spike`)
- **Duração**: ~15 min (automatizado + revisão de artefatos)
- **Ambiente**: Ubuntu 24.04, Chromium headless (Playwright v1217), viewport 1366×768
- **Suíte smoke**: 5 passed, 1 skipped (`.fixme` de pausa M2), 0 failed — ver `tests/smoke/`

### Observações de "fun factor"

Pra este milestone a pergunta "é divertido?" ainda não se aplica — é um spike de viabilidade técnica sem arte, sem audio e com um único inimigo estático. **Não dá pra avaliar diversão agora**; fica suspenso até M2 ter uma fase jogável completa.

O que dá pra afirmar sobre feel:
- **Movimento**: 320 px/s parece razoável na largura de 800px (atravessa a tela em ~2.5s). Confortável em teclado.
- **Cooldown de tiro**: 220ms é rítmico o suficiente pra não cansar em bursts curtos.
- **Flash branco em hit** (`setTint 0xf4e4c1` por 80ms): peso visual fraco sobre o placeholder vermelho — Report dev já sinaliza revisita em M7.

### Melhor momento

Primeira execução do loop kill→respawn→kill aconteceu sem glitches perceptíveis, e o HUD subiu de `SCORE 000000` pra `SCORE 000300` com feedback imediato. O `window.__osCabra` deixou Playwright ler estado sem ginástica — é uma decisão arquitetural que ajudou QA bastante.

### Pior momento

- `ESC` ainda não faz nada — jogador que tenta pausar é ignorado silenciosamente. Aceitável pra spike, mas é a primeira coisa a arrumar em M2.
- Inimigo estático que reaparece no mesmo lugar deixa claro que é placeholder; qualquer playtest externo antes de M2 passaria a sensação de "vazio".

### Bugs observados

Nenhum P0/P1 no código de M1. Issue cosmética encontrada:

- **#TBD** — `favicon.ico 404` — P3, microtarefa do DevOps. Registrado via `gh issue`.

### Fun factor (1-10)

Não aplicável neste milestone (placeholder técnico). Revisitar em M2.

### Jogaria de novo?

Não aplicável — o spike não tem "partida" pra repetir. Foi o suficiente pra confirmar que o loop core funciona e pra desbloquear M2.

### Próximos passos de QA

1. Adicionar browsers Firefox/Edge à matriz ao começar M2.
2. Agendar playtest humano com 3-5 testers externos assim que M2 entregar fase jogável.
3. Começar a medir FPS e memória no DevTools com sessão de 30 min a partir de M2.
