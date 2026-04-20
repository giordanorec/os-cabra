# Playtest Log — Os Cabra

> Log de sessões de playtest. Uma entrada por sessão.
> Formato: ver `QA_PLAN.md` §7.

---

## Playtest 2026-04-19 — Milestone 2 (Fase 1 jogável)

- **Tester**: QA (automatizado via Playwright + inspeção visual dos screenshots)
- **Build**: `db97f38` (merge `feat/milestone-2-fase1`), validado contra main tip `c1a5138`
- **Duração**: ~25 min (scaffold dos specs + rodada completa + inspeção)
- **Ambiente**: Ubuntu 24.04, Chromium headless (Playwright v1217), viewport 1366×768
- **Suíte smoke**: 16 passed, 1 skipped (`.fixme` do TC-007), 0 failed em ~50s — ver `tests/smoke/`

### Observações de "fun factor"

Primeiro milestone que dá pra jogar de verdade — o feel está competente. O que funciona:

- **Tempo de leitura da fase**: 1500ms entre waves + intro "FASE 1 MARCO ZERO" dá espaço pra respirar entre pressões. Não se sente atolado.
- **Chain multiplier (×1.5)**: mecânica legal — recompensa precisão/velocidade sem penalizar jogo lento. Só aparece na HUD quando ativo, então é descoberta natural.
- **Passistas em zigzag** são a ameaça mais interessante — forçam o jogador a prever. Caboclinho é previsível demais.
- **Mosca Manga em órbita** introduz padrão diferente em wave 4 — atenua a monotonia dos outros inimigos.

O que atrapalha:

- **Sem áudio**, o feedback de hit/dano fica 100% visual (flash branco 80ms). É suficiente, mas silencioso.
- **Arte em placeholders** ainda. Caboclinho é um quadrado vermelho de 28px. Não dá pra julgar identidade visual.
- **Pausa prometida não funciona** — ver Bugs observados.

### Melhor momento

Fechar o chain de 5 no meio da wave 4 (enxame da manga) subindo ×1.5 ao vivo — primeira vez que o HUD ficou denso e responsivo simultaneamente. Screenshot: `hud-02-chain-multiplier.png`.

### Pior momento

Pressionar `ESC` pela primeira vez vendo o hint `[ESC] pausa` e... nada. Quebra imediata de confiança na UI. Issue #15 aberta.

### Score alcançado

Synthetic (QA programático): score final varia por run — o teste usa kills via API (`scoreManager.registerKill`) e `takeDamage` direto, então não é comparável a um playthrough humano. O próprio dev reportou score 1240 (~57% do máximo) num playthrough de 80s.

### Bugs observados

- **[#15](https://github.com/giordanorec/os-cabra/issues/15)** — HUD promete `[ESC] pausa` mas pausa não está implementada. **P2 UX**. Dev já declarou no REPORT_GAMEPLAY_DEV_M2 §Decisões #2 que pausa fica pra M4/M7 — mas a hint na HUD continua prometendo. Issue pede uma das duas: (a) implementa pausa agora ou (b) tira a string da hint até ter.
- **Dívida declarada** (não filei issue — acompanhada pelo dev): checkpoint salva `{waveIndex, lives, score}` mas não é restaurado em restart (REPORT_GAMEPLAY_DEV_M2 §Decisões #3). Sem morte com revive em M2 — ir pra GameOver é fim de história. Vai fechar em M3.

### Fun factor (1-10)

**6/10**. O loop funciona, o desafio sobe progressivamente, mas sem arte nem áudio e com a pausa ausente, falta polish pra virar "jogaria de novo genuinamente". Com placeholders substituídos e pausa funcionando, subiria pra 7-8 fácil.

### Jogaria de novo?

**Sim, com ressalvas** — já dá pra testar como playtester externo pra opinar sobre dificuldade das waves. Mas recomendo esperar M3 (boss) ou M4 (power-ups) pra uma sessão que vale a pena recrutar amigos.

### Próximos passos de QA

1. Agendar 3-5 playtesters externos pra começo de M4 (quando power-ups entrarem) — aí tem variedade pra coletar feedback significativo.
2. Começar medição formal de FPS ao rodar sessão de 30 min em M3 (com boss = maior carga de partículas + bullets).
3. Se M3 não implementar pausa, reabrir a issue #15 pra forçar decisão (implementar ou remover da HUD).

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
