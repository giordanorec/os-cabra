# UX Spec — Os Cabra

> **Responsável**: UI/UX Designer. **Lê também**: Gameplay Developer, Visual Designer.
> **Depende de**: `GDD.md`, `ART_BIBLE.md`.

## 1. Princípios

- **Legível sempre** — texto grande, contraste alto. Xilogravura tem muita textura; UI precisa ser mais limpa que arte
- **Feedback para tudo** — cada input tem resposta visual e/ou sonora em < 100ms
- **Regionalismo sem exagero** — charme pernambucano nos textos, mas ainda compreensível pra quem não é daqui
- **Respeita o ritmo arcade** — menus não devem ser labirintos; 2-3 cliques pra estar jogando

## 2. Inventário de telas

| # | Tela | Propósito |
|---|---|---|
| 1 | Splash/Boot | Logo "OS CABRA" aparece rapidamente |
| 2 | Menu Principal | Jogar, Códigos, Créditos, Sair |
| 3 | Tela de Códigos | Inserir código de amigo ou ver o seu |
| 4 | Preload | Loading com dica pernambucana |
| 5 | Intro de Fase | "FASE 1 — MARCO ZERO" por 2s |
| 6 | Gameplay | Cena principal |
| 7 | HUD | Vidas, score, bombs, power-up ativo |
| 8 | Pausa | "PAREI" + opções Continuar / Menu |
| 9 | Checkpoint | Mini-feedback "ONDE EU TAVA" (2s) |
| 10 | Boss intro | Nome do boss aparece em frame dramático |
| 11 | Boss defeated | "SE FOI" + bônus de score |
| 12 | Fim de fase | Recap de score + próxima fase |
| 13 | Game Over | "SE LASCOU" + score final + código |
| 14 | Vitória final | Créditos + highscore |

## 3. HUD

Layout em 800×600:

```
┌─────────────────────────────────────────────────────────┐
│ 🐓🐓🐓      SCORE  012.340      ×1.5         💣 💣      │  ← top bar (y=0..40)
│                                                         │
│                                                         │
│                    [ gameplay area ]                    │
│                                                         │
│                                                         │
│                                                         │
│                       [ player ]                        │
│                                                         │
│ [icone] SOMBRINHA DE FREVO  ████████░░░░  10s           │  ← bottom strip (y=560..600, condicional)
└─────────────────────────────────────────────────────────┘
```

- **Vidas** (x=20,52,84 y=10, 24×24): ícones de galo, alinhados à esquerda. Slot perdido fica como silhueta @ 30% alpha
- **Score** (x=300 label, x=360 valor, y=8-12): fonte display bold 24px, 6 dígitos com padding zero (`000000`). Valor sobe animado ao ganhar pontos.
- **Multiplicador** (x=500 y=10, display italic 20px): aparece só se ×>1, pulsa, vermelho `#b84a2e`
- **Smart bombs** (x=700,740 y=10, 24×24): garrafinha dourada. Sempre 2 slots como silhueta; preenche por bomb disponível
- **Power-up ativo** (bottom strip y=560..600): só aparece se há powerup com duração. Ícone à esq (x=20), nome (x=60), barra (x=360..640), timer (x=760). Pulsa vermelho nos últimos 3s

**Especificação pixel-perfect**: ver [`wireframes/07-hud.md`](wireframes/07-hud.md) — coordenadas exatas, estados, comportamentos de cada elemento.

**Safe zones**: inimigos spawnam em y=60..540 (20px de folga de cada HUD). HUD está em depth 100+, sempre visível.

## 4. Textos e glossário pernambucano

Todas as strings do jogo — ~120 entradas cobrindo menus, feedbacks, fases, bosses, game over, dicas de loading, créditos, erros — estão em [`GLOSSARY_PT_BR.md`](GLOSSARY_PT_BR.md).

**Chaves hierárquicas** (`menu.play`, `boss.1.name`, `feedback.chain5`) prontas pra um módulo `Strings.ts` futuro. Nenhuma string hardcoded em TS — `StringService.get('menu.play')` retorna "ARROCHA AÍ".

**Samples** (amostra — ver glossário completo):

- Menu: `ARROCHA AÍ` · `CÓDIGOS DOS CABRA` · `QUEM FEZ ESSE TRAÇADO` · `VAZAR`
- Feedbacks: `PAI D'ÉGUA` · `VAI, MENINO` · `ARRETADO!` · `AÍ, VIU?` · `TÁ COM TUDO` · `ENGATADO` · `É BRABO MESMO`
- Boss appear: `OXE!`
- Pausa: `PAREI` · `BORA`
- Game Over (variações): `SE LASCOU` · `RAPAZ...` · `NÃO DEU NÃO` · `VOLTA ESSA FITA` · `FOI BRABO MESMO`
- Checkpoint: `ONDE EU TAVA`

## 5. Tipografia

Definição final: **Rye** (display) + **Inter** (corpo) + **JetBrains Mono** (mono/códigos).

Escala tipográfica completa, tokens de espaçamento, paleta de UI e regras de caixa: ver [`UI_STYLE_GUIDE.md`](UI_STYLE_GUIDE.md).

Tamanhos-chave em 800×600:
- `display.xl` 88px (Game Over "SE LASCOU", boss "OXE!")
- `display.l` 64px (nome de fase, "PAREI")
- `display.m` 48px (títulos de tela)
- `display.s` 32px (botões ativos, score destaque)
- `body.s` 16px — **piso para qualquer texto legível durante gameplay**
- `mono.code` 32px (código de compartilhamento)
- `micro` 12px (hints de atalho)

## 6. Feedback visual — padrões

Duração, easing e componentes de cada feedback. Todos os valores em `anim.*` seguem os tokens de [`UI_STYLE_GUIDE.md`](UI_STYLE_GUIDE.md) §6.

| Evento | Duração | Easing | Descrição |
|---|---|---|---|
| Player atira | 60ms | Linear | Muzzle flash (partícula branca `#f4e4c1` @ início do cano) + SFX `sfx_shoot` |
| Inimigo atingido | 80ms | Linear | Tint branco `#f4e4c1` full sobre sprite + SFX `sfx_hit` + -1 HP numérico discreto |
| Inimigo morre | 400ms | — | 4-6 partículas xilográficas explosão + shake leve (amplitude 3px, 120ms) + SFX `sfx_enemy_die` + score pop up |
| Boss atingido (hit comum) | 80ms | Linear | Tint branco + freeze frame 80ms + SFX `sfx_boss_hit` |
| Boss atingido (hit letal) | 150ms | Back.easeOut | Tint + freeze 150ms + flash branco tela 40% + SFX mais alto |
| Player leva dano | 1500ms total | — | Red flash tela `#b84a2e` @ 30% 120ms + shake médio (6px, 250ms) + SFX `sfx_player_hit` + i-frames 1500ms com blink 15Hz |
| Power-up pego | 600ms | Quad.easeOut | Flash cor do powerup (120ms) + SFX `sfx_pickup` + texto flutuante aleatório do glossário (`pickup.*`) sobe 40px em 600ms |
| Vida extra (Tapioca) | 700ms | Back.easeOut | Flash `#5a7a3a` + SFX `sfx_1up` + "TÁ COM TUDO" scale 1.2→1.0 + ícone galo preenche slot vazio no HUD |
| Checkpoint | 2000ms total | — | Ver [`wireframes/09-checkpoint.md`](wireframes/09-checkpoint.md); linhas entram, texto "ONDE EU TAVA" entra, tudo fade out — sem pausar gameplay |
| Boss aparece | 1500ms | — | Ver [`wireframes/10-boss-intro.md`](wireframes/10-boss-intro.md); freeze, OXE!, nome, barra HP entra; input bloqueado |
| Boss transição fase | 400ms | Cubic.easeOut | Freeze 400ms + flash branco + label "EITA, MUDOU" / "DANOU-SE AGORA" (ver glossário `boss.phase2/3`) |
| Boss derrotado | 2500ms total | — | Ver [`wireframes/11-boss-defeated.md`](wireframes/11-boss-defeated.md); explosão, "SE FOI", bônus contando |
| Score milestone 10k | 800ms | Back.easeOut | "ÉGUA! 10 MIL" no centro, scale bounce + fade |
| Score milestone 50k | 800ms | Back.easeOut | "MEIO CENTO, CABRA!" |
| Score milestone 100k | 1000ms | Back.easeOut | "CEM MIL ARRETADO" + sparkle VFX |
| Novo recorde (em Game Over/Vitória) | 600ms + loop | Back.easeOut | "NOVO RECORDE!" scale 1.2→1.0, depois pulse 1s loop em `#d4a04c` |
| Chain ×1.5 ativa | 300ms | Quad.easeOut | Multiplicador aparece no HUD com scale 1.4→1.0 |
| Chain expira | 300ms | Cubic.easeIn | Multiplicador pisca 3× em 300ms e some |
| Chain milestone 5/10/20 | 500ms | Back.easeOut | Texto flutuante "ENGATADO" / "TÁ ARRASANDO" / "É BRABO MESMO" |
| Última vida | 400ms + loop | — | Texto flutuante "É A ÚLTIMA!" + barra inferior de HUD pulsa vermelho sutil |
| Near-miss (projétil passa raspando) | 200ms | Linear | Pequeno slow-mo 90% por 150ms + flash amarelo na hitbox — **opcional v2** |

### Bloco de todo feedback

- **SFX sempre** acompanha — redundância sensorial para acessibilidade
- **Nada linear** em feedback de UI (exceto flashes de frame único)
- **Nada bloqueia input** além de boss intro/outro — gameplay não espera por feedback

## 7. Acessibilidade

Mesmo sendo v1, seguir o básico:

- Contraste mínimo 4.5:1 pra texto
- Fontes ≥ 16px no gameplay
- Não usar só cor pra diferenciar inimigos (silhueta importa)
- Modo daltônico: deixar previsto — toggle em Opções (mesmo que só funcione em v2)

## 8. Animação/transições entre cenas

Tabela completa. Durações em ms, easings nomeados como em Phaser (`Cubic.easeOut` etc).

| De → Para | Trigger | Duração | Easing | Descrição |
|---|---|---|---|---|
| Splash → Menu | auto (1.5s) ou tecla | 400 | Cubic.easeOut | Wipe horizontal E→D (tipo vira-página de cordel); áudio de tambor abafa |
| Menu → Preload | Enter em "ARROCHA AÍ" | 300 | Cubic.easeIn | Botão flash branco 80ms + fade to `#1a0f08`; Preload aparece com fade 200ms |
| Menu → Códigos | Enter em "CÓDIGOS" | 250 | Cubic.easeOut | Slide horizontal D→E (tela empurra pra esquerda) |
| Menu → Créditos | Enter em "CRÉDITOS" | 250 | Cubic.easeOut | Slide vertical de baixo pra cima |
| Códigos/Créditos → Menu | ESC | 250 | Cubic.easeIn | Slide inverso da entrada |
| Preload → Intro Fase | asset pronto + min 500ms | 400 | Cubic.easeInOut | Wipe horizontal + fade parallax da fase já visível em blur |
| Intro Fase → Gameplay | auto (2s) ou tecla | 400 | Cubic.easeIn | Texto da fase some em scale+fade, dissolve tela; HUD entra em cascata 150ms stagger |
| Gameplay → Pausa | ESC | 250 | Cubic.easeOut | Snapshot do gameplay + blur 8px + dimmer 50% + "PAREI" scale 1.3→1.0 + botões cascata |
| Pausa → Gameplay | ESC ou "BORA" | 180 | Cubic.easeIn | Reverte: botões saem, "PAREI" some, blur e dimmer clareiam; gameplay retoma sem contagem |
| Pausa → Menu | "VAZAR" + confirm | 400 | Cubic.easeIn | Fade to black 400ms + fade in do menu 400ms |
| Gameplay → Checkpoint overlay | 50% das ondas | 300 in + 300 out | Cubic.easeOut / Cubic.easeIn | Linhas e texto entram e saem; gameplay segue — ver [`wireframes/09`](wireframes/09-checkpoint.md) |
| Gameplay → Boss Intro | HP da onda final zerada | 1500 cinematic | — | Freeze + slow zoom 1.0→1.05 no player 800ms + boss desce 600ms + OXE! 300ms + barra HP sobe 300ms — ver [`wireframes/10`](wireframes/10-boss-intro.md) |
| Boss Intro → Boss Fight | auto (1.5s) ou tecla | 300 | Cubic.easeIn | OXE! e linhas dissolvem; HP do boss permanece; player recebe input de volta |
| Boss HP 66/33% | hit que cruza threshold | 400 | Back.easeOut | Freeze 400ms + flash branco tela + label de transição de fase |
| Boss Fight → Boss Defeated | HP=0 | 2500 cinematic | — | Explosão 500ms + "SE FOI" bounce + recap contando — ver [`wireframes/11`](wireframes/11-boss-defeated.md) |
| Boss Defeated → Fim de Fase | auto (2.5s) | 400 | Cubic.easeIn | Dissolve + move up 20px; Fim de Fase entra fade |
| Fim de Fase → Intro próxima fase | Enter | 400 | Cubic.easeInOut | Wipe horizontal; Intro de fase entra direto |
| Gameplay → Game Over | vidas=0 | 2000 cinematic | — | Fade to black lento 2000ms (`Cubic.easeIn`) + "SE LASCOU" cai do topo Bounce.easeOut 600ms + stats cascata + código máquina de escrever |
| Game Over → Menu / Retry | Enter / R | 400 | Cubic.easeIn | Fade → cena de destino |
| Boss final Defeated → Vitória | auto | 1000 cinematic | Cubic.easeInOut | Slow fade + título "OS CABRA VENCERAM" fade+scale 1.2→1.0 em 500ms |
| Vitória p1 → p2 | Enter | 400 | Cubic.easeInOut | Crossfade; scroll de créditos começa |
| Vitória → Menu | Enter ao fim | 600 | Cubic.easeIn | Fade to black + fade in menu |

### Princípios de transição

- **Wipe horizontal** é a linguagem-padrão entre telas "iguais" de menu (evoca virar página de cordel)
- **Fade to black** fica reservado para momentos de peso dramático (Game Over, entre atos)
- **Slide** para hierarquia (entrar em sub-menu desliza pra dentro; voltar desliza pra fora)
- **Zoom/freeze** para cinemáticas de boss (respeita o ritmo arcade)
- Toda transição mantém áudio coerente: nada de corte brusco de música; usa ducking 30% durante transições cinematográficas

## 9. Entregáveis do UI/UX

- [x] **Wireframes** das 14 telas — ver [`wireframes/`](wireframes/) (ASCII anotado com coordenadas; PNG opcional em follow-up)
- [x] **Glossário PT-BR pernambucano** — ver [`GLOSSARY_PT_BR.md`](GLOSSARY_PT_BR.md) (~120 strings)
- [x] **Style guide de UI** — ver [`UI_STYLE_GUIDE.md`](UI_STYLE_GUIDE.md) (tipografia, cores, espaçamento, tokens)
- [x] **Especificação de HUD** — §3 deste doc + [`wireframes/07-hud.md`](wireframes/07-hud.md) com coordenadas pixel-perfect
- [x] **Animações de transição** — §8 acima (tabela completa); feedbacks em §6

## 10. Open questions

- [x] **Textos sempre em caixa alta ou só títulos?** → Só em títulos, display e botões. Corpo longo (poema, créditos, dicas) em caixa mista natural (ver `UI_STYLE_GUIDE.md` §2.4).
- [ ] **Legendar SFX importantes pra acessibilidade?** → Previsto como v2 (stub em `UI_STYLE_GUIDE.md` §7.2). v1 já duplica feedback em visual + sonoro, mas sem legenda textual.
- [x] **Mostrar controles em overlay no início da partida 1?** → Não — "nada de tutorial longo" é restrição. Dicas de controle saem como microtexto no preload da fase 1 ("[ESPAÇO] atira · [SETAS] move · [ESC] pausa") e pronto. Overlay completo só se for pedido em playtest.
- [ ] **Fonte customizada do Visual Designer substitui Rye?** → Pendente sincronização com Visual Designer. Rye é o fallback garantido.
- [ ] **@fontsource local ou CDN Google Fonts?** → Local (via npm), offline-friendly e determinístico.
- [ ] **Modo daltônico no v1?** → Stub em Opções, default-off; ativação real em v2.
