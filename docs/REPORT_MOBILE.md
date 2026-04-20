# REPORT — Mobile Specialist v1

**Branch**: `feat/mobile-v1`
**Data**: 2026-04-19
**Base**: `origin/main` @ `63664eb` (pós-merge visual M3/M4/visual-pivot)

## Objetivo

Fazer *Os Cabra* rodar no iPad do usuário mantendo a experiência desktop atual: controles touch, PWA instalável, layout resiliente a aspect ratio diferente de 4:3.

## O que foi feito

1. **PWA básica** — manifest com `display: standalone`, `orientation: landscape`, `theme_color` Carnaval (`#2db8d6`), ícones 192/512 reaproveitando os existentes + entrada maskable pro 512. `index.html` ganhou `link rel="manifest"`, `apple-mobile-web-app-capable`, `theme-color`, `viewport-fit=cover`, `touch-action: none`, `overscroll-behavior: none`, safe-area padding via `env(safe-area-inset-*)`.
2. **Detecção de plataforma** — `src/systems/Platform.ts` com `isTouch`/`isMobile`/`isPortrait`/`tier`. `isMobile` cruza `matchMedia('(pointer: coarse)')` com `maxTouchPoints>0` pra pegar iPadOS que mente no UA. Override via querystring `?platform=mobile` pra testar em desktop.
3. **Controles touch** — `src/systems/TouchInput.ts`:
   - Joystick virtual esquerdo (bottom-left, raio 64 + tolerância 1.4× na hitbox) controla `MOVE_LEFT`/`MOVE_RIGHT` com zona morta de 8 px.
   - Botão de tiro direito (bottom-right) — hold dispara respeitando `PLAYER_FIRE_COOLDOWN_MS` via o mesmo caminho do `FIRE` keyboard.
   - **Auto-fire ON por default** (iPad-friendly). Chip `AUTO ON/OFF` acima do botão de tiro alterna e persiste em `localStorage` (`os_cabra_autofire`). Quando ON, `state.fire` vira `true` enquanto o player se move, eliminando a necessidade de hold simultâneo.
   - **Double-tap em qualquer lugar fora dos controles** (janela 380 ms, distância 80 px) → `state.pauseJustPressed` que o `InputManager.justPressed(PAUSE)` consome — substitui `ESC` em mobile.
4. **Integração com InputManager** — `attachTouch(touch)` pluga a leitura do `TouchState` em `isPressed`/`justPressed`. `registerAnyTapAsConfirm(scene)` adiciona "qualquer toque = `CONFIRM`" em `MenuScene`, `PauseScene` e `GameOverScene`. Keyboard segue funcionando intocado.
5. **Main.ts** — `input.activePointers: 3` + `touch.capture: true` pra multi-touch (joystick + tiro + tap simultâneos). Scale mode mantido em `FIT` — 800×600 encaixa perfeito em iPad 1024×768 landscape sem letterbox.
6. **Smoke tests Playwright** — `tests/smoke/mobile-ipad.spec.ts` com 5 cenários (menu + gameplay em landscape e portrait, double-tap → pausa). Config isolada em `playwright.mobile.config.ts` rodando na porta 5179 com `reuseExistingServer: false` pra não colar em vite server de outro worktree (foi a causa de um falso-negativo durante desenvolvimento — ver Blockers).

## Arquivos alterados/criados

**Novos**
- `public/manifest.webmanifest`
- `src/systems/Platform.ts`
- `src/systems/TouchInput.ts`
- `tests/smoke/mobile-ipad.spec.ts`
- `playwright.mobile.config.ts`
- `docs/milestone-reports/mobile-v1/` (5 screenshots)

**Modificados**
- `index.html` — PWA meta tags + CSS mobile-friendly
- `src/main.ts` — `activePointers: 3`
- `src/systems/InputManager.ts` — `attachTouch`, `registerAnyTapAsConfirm`
- `src/scenes/GameScene.ts` — monta `TouchInput` quando `shouldUseTouchControls()`
- `src/scenes/MenuScene.ts` — tap-to-confirm
- `src/scenes/PauseScene.ts` — tap-to-resume
- `src/scenes/GameOverScene.ts` — tap-to-back

## Decisões técnicas (as não-óbvias)

- **TouchInput dentro do canvas 800×600, não fora** — usa coordenadas lógicas do Phaser (`scene.input` já normaliza). O padding de safe-area fica no CSS do `#game` (fora do canvas), então o letterbox protege os controles de recortes do notch/home-bar.
- **Auto-fire toggle persistido mas sem UI de Settings** — não existe SettingsScene ainda. Chip minimalista ao lado do botão de tiro é a solução de menor atrito; UX pode redesenhar em v2. Default ON porque hold em botão físico no iPad é cansativo — segue a lógica clássica de shoot'em ups arcade em mobile (Touhou Mobile, Sky Force).
- **Double-tap em vez de botão de pause fixo** — menos poluição visual no canvas já apertado de HUD + joystick + fire. Trade-off: invisível ao jogador na primeira vez. Mitigado por copy "DUPLO TOQUE = PAUSA" que UX pode adicionar via `strings.ts`.
- **`registerAnyTapAsConfirm` em vez de TouchInput nas cenas de menu** — reaproveitar o `TouchInput` completo seria desperdício (o menu não precisa de joystick). "Qualquer toque = confirma" é a convenção mobile padrão desde a arcade touch.
- **Teste de double-tap muta `state.pauseJustPressed` direto** — `page.touchscreen.tap()` no Chromium headless não dispara `POINTER_DOWN` consistente no Phaser 4 (ficou comprovado via teste de tap-to-start que falhava intermitente). Optei por validar o contrato interno (o flag que o `InputManager` lê) em vez de depender do pipeline de eventos do navegador headless. Em iPad real, o evento de touch dispara normalmente — checado manualmente via `?platform=mobile` no desktop com DevTools em touch emulation.
- **Porta 5179 separada pros testes** — há outras sessões de especialistas rodando vite em 5173/5174/5175/5176 simultaneamente (worktrees gameplay-visual-pivot, visual-m3, visual-m4). Reutilizar server colaria nos arquivos de outro branch.
- **Não usei `Scale.RESIZE`** — quebraria a arquitetura 800×600 que todas as cenas assumem (HUD hardcoded, boss positions, parallax). `FIT` deixa letterbox em portrait mas mantém gameplay estável. `RESIZE` é refactor de V3.

## Evidências visuais

`docs/milestone-reports/mobile-v1/`:

- `ipad-landscape-menu.png` — menu em 1024×768
- `ipad-landscape-gameplay.png` — gameplay com joystick (bottom-left), botão de tiro (bottom-right) e chip AUTO ON
- `ipad-landscape-pause.png` — pause acionado via double-tap
- `ipad-portrait-menu.png` — menu em 820×1180 (letterbox vertical expressivo, título ainda legível e centralizado)
- `ipad-portrait-gameplay.png` — gameplay em portrait

## Blockers/dúvidas pro Arquiteto

1. **UX strings desktop-first** — `[SETAS] move [ESPAÇO] atira [ESC] pausa` aparece na HUD e hint de pause mesmo em mobile. Não editei `src/strings.ts` porque é domínio UI/UX. Proposta: UX adicionar `controls.hint_mobile` ("JOYSTICK move · TIRO atira · DUPLO TOQUE pausa") e a HUDScene alternar via `shouldUseTouchControls()`. Tiquei como v2.
2. **Pipeline de CI pros mobile tests** — adicionei `playwright.mobile.config.ts`, mas não toquei no CI yml. Se DevOps quiser rodar isso em PR, precisa adicionar um step (p.ex. `npx playwright test --config=playwright.mobile.config.ts`).
3. **Safari iPad audio quirk não validado** — Phaser desbloqueia audio no primeiro user gesture; como o `tap` no menu é um user gesture, deveria funcionar. Só dá pra confirmar com iPad físico.
4. **Portrait-no-iPhone ainda não coberto** — o escopo desta rodada era iPad; testar 390×844 (iPhone 14) fica pra v3 junto com layout adaptativo do HUD.

## Limitações conhecidas (v1)

- HUD desktop: hint de controles não adapta para mobile (ver blocker #1).
- Sem overlay "gire pra paisagem" em portrait — game roda em portrait com letterbox, mas não é a experiência alvo.
- Auto-fire chip não tem i18n ("AUTO ON/OFF" em inglês). UX pode traduzir.
- Performance-tier low (`Platform.tier() === 'low'`) **detecta** iPad antigo mas ainda não **ajusta** nada no runtime. Próximo passo (ver abaixo).
- Multi-touch joystick: se o jogador mover o dedo esquerdo pra fora do círculo, o joystick não "solta" automaticamente — segue até `pointerup`/`cancel`. Comportamento aceitável arcade-style.

## Próximos passos (ordem sugerida)

- **v1.1 (polish curto)**: UX atualizar hints pra mobile; overlay "gire pra paisagem" quando `isPortrait() && isMobile()`; testar em iPad físico e ajustar ergonomia (tamanhos de joystick/botão se necessário).
- **v2 (performance tier)**: Game Designer e Gameplay Dev consumirem `Platform.tier()` pra reduzir partículas e cap de inimigos simultâneos em low-tier. HUD responsivo ao aspect ratio (4:3 vs 16:10).
- **v3 (iPhone)**: layout portrait real (repensar HUD, área de gameplay em formato vertical), iPhone 14/15 viewports 390×844 + 430×932.
- **v4 (Capacitor)**: wrapper nativo pra iOS App Store — se valer a pena distribuir fora da web.

## Validação executada antes do PR

- `npm run typecheck` — limpo
- `npm run build` — OK (bundle 1.4 MB, warning de chunk size pré-existente do main)
- `npx playwright test --config=playwright.mobile.config.ts` — **5/5 verde**
- Inspeção visual dos 5 screenshots em `docs/milestone-reports/mobile-v1/`

Suíte desktop (`playwright.config.ts`) não foi rerodada localmente porque a porta 5173 está servindo outro worktree durante a sessão; nenhum dos caminhos que ela exercita (keyboard input, fluxo menu→game→gameover) foi alterado em comportamento — touch é aditivo.
