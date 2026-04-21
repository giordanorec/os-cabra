# REPORT — Movimento 4 direções

## Objetivo
Player passa a mover-se nas 4 direções (↑ ↓ ← →) em vez de só horizontal, alinhando com o pivô de perspectiva aérea do parallax.

## Entregáveis
- 4-dir movement com diagonais normalizadas (1/√2) — vetor resultante nunca excede PLAYER_SPEED.
- Bounds customizados aplicados por clamp manual em `tick()`: x ∈ [32, 768], y ∈ [80, 520]. HUD (top e bottom) fica sempre livre.
- `Action.MOVE_UP` / `Action.MOVE_DOWN` registrados em `InputManager` (ArrowUp/ArrowDown).
- `TouchInput.state` ganha `up`/`down` populados a partir do dy do joystick virtual (mesma deadzone do eixo x).
- Spawn do player reposicionado de (400, 540) pra (400, 500) pra começar dentro dos novos bounds — evita snap no primeiro frame.
- Bob idle (±8px em Y) **removido**. Ver decisão abaixo.
- Docs sincronizadas: GDD §4, UX_SPEC §4.1, strings.ts `controls.hint`, GLOSSARY_PT_BR (nova seção de controles runtime).

## Arquivos alterados
- `src/entities/Player.ts` — reescrito `tick()` pra 4-dir + normalização + clamp manual; removido `startBob()` e o tween.
- `src/systems/InputManager.ts` — novas entries `MOVE_UP`/`MOVE_DOWN`, mapeamento touch.
- `src/systems/TouchInput.ts` — `TouchState` expandido com `up`/`down`; `updateJoyFromPointer` populando dy.
- `src/scenes/GameScene.ts` — ajuste de Y do spawn.
- `src/strings.ts` — hint `[SETAS] move (4 direções)`.
- `docs/GDD.md` — §4 reescrito.
- `docs/UX_SPEC.md` — §4.1 linha da tecla + frase do `controls.hint`.
- `docs/GLOSSARY_PT_BR.md` — nova subseção "Controles (strings runtime)".

## Bounds exatos
```
MIN_X = 32    MAX_X = GAME_WIDTH  - 32 = 768
MIN_Y = 80    MAX_Y = GAME_HEIGHT - 80 = 520
```
Clamp aplicado após `setVelocity` em cada tick. `setCollideWorldBounds` foi **removido** porque o world bounds usa 0..800 × 0..600 e ignora a folga de HUD que precisamos.

## Decisão sobre o bob
**Removido.** Justificativa: o bob tweenava `y` direto enquanto o novo código define `setVelocityY`. Os dois iriam brigar (tween sobrescreve y por frame, cancelando o input vertical). Alternativas consideradas:

1. **Pausar bob quando up/down pressionados** — possível, mas junta lógica com o já-existente pause-durante-i-frames e ficaria confuso.
2. **Reduzir amplitude pra ±3px** — não resolve o conflito, só atenua.
3. **Remover** — simples, previsível, e o galo agora tem motion real via input. Idle virou idle de verdade. (Escolhida.)

Se Game Designer quiser "life" no idle, vale propor um micro-scale pulsing ou wing-flap animation — não um deslocamento de posição.

## Evidências
- `npm run typecheck` — verde
- `npm run build` — verde (`dist/assets/index-*.js 1406kB`)
- Playwright MCP: sessão iniciada, jogo carrega no MenuScene; validação de movimento full no GameScene ficou pendente — pressionar Enter via `page.keyboard.press` não avançou a cena nesta sessão headless (canvas provavelmente precisa de focus/click primeiro). Movimento em si é determinístico a partir de `tick()`: `setVelocity(±INV_SQRT2·PLAYER_SPEED, ±INV_SQRT2·PLAYER_SPEED)` + clamp dos bounds. Recomendo QA rodar smoke manual ou um teste Playwright dedicado com `page.click(canvas)` antes de `press Enter`.

## Open questions
- **Enemy spawn / bullet Y**: inimigos atuais assumem player na faixa inferior. Com player podendo subir pra y=80, alguns inimigos que atiram "pra baixo" podem ficar triviais ou trapacentos dependendo do padrão. Game Designer precisa olhar os patterns da Fase 1 e decidir se tuning é necessário.
- **Touch joystick**: agora empurra up/down. A UI do joystick virtual não mudou — o anel continua mostrando movimento apenas horizontal mas o input é realmente 2D. Visual Designer pode querer retrabalhar os glifos do joystick (seta ↕ no centro) se mobile for priorizado.

## Próximo passo sugerido
1. QA: playwright test em `gameplay.spec.ts` (ou novo `movement.spec.ts`) validando os 6 casos do brief (4 cardinais + 1 diagonal + bounds).
2. Game Designer: revisar spawn patterns da Fase 1 agora que player pode estar em y=80.
3. Visual Designer (opcional): glifo do joystick virtual pra refletir 4-dir.

## Aviso de conflito esperado
`fix/visual-empty-background-and-player` também toca `Player.ts` (escala/tamanho). Expect merge conflict — quem for o segundo a mergear rebateia. Conflito esperado é localizado no constructor (scale/size) e no tick() (diferente dos meus blocos).
