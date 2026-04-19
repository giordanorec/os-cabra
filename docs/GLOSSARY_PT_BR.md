# Glossário PT-BR Pernambucano — Os Cabra

> **Responsável**: UI/UX Designer. **Lê também**: Gameplay Developer, QA.
> **Depende de**: `UX_SPEC.md` §4.

Todas as strings de texto do jogo em PT-BR com regionalismo pernambucano. Cada string tem **chave** (identificador no código), **versão exibida** (o que aparece na tela) e quando aplicável uma **nota** explicando escolha ou uso.

**Regras**:
- **Legibilidade > charme**. Se o regionalismo atrapalha o entendimento, versão mais sóbria ganha.
- **Caixa alta** em títulos, display e botões — funciona com xilogravura. Corpo em caixa mista.
- **Idade do regionalismo**: misturar clássico ("arretado", "oxe") com coisa mais boca de favela/viso recente ("se lascou", "é brabo") — evitar só arcaico.
- Absurdo é permitido. Projeto é pessoal.
- Strings com `%s`, `%n`, `%code` são interpolações (ex: `%s` = nome, `%n` = número).

## Índice

- [1. Boot / Splash](#1-boot--splash)
- [2. Menu Principal](#2-menu-principal)
- [3. Confirmações e diálogos genéricos](#3-confirmações-e-diálogos-genéricos)
- [4. Tela de Códigos](#4-tela-de-códigos)
- [5. Preload — dicas](#5-preload--dicas)
- [6. Intros de Fase](#6-intros-de-fase)
- [7. HUD](#7-hud)
- [8. Feedback de gameplay](#8-feedback-de-gameplay)
- [9. Power-ups](#9-power-ups)
- [10. Pausa](#10-pausa)
- [11. Checkpoint](#11-checkpoint)
- [12. Bosses](#12-bosses)
- [13. Fim de Fase](#13-fim-de-fase)
- [14. Game Over](#14-game-over)
- [15. Vitória final](#15-vitória-final)
- [16. Créditos](#16-créditos)
- [17. Inimigos — nome curto e taunt (opcional)](#17-inimigos--nome-curto-e-taunt-opcional)
- [18. Erros e estados degradados](#18-erros-e-estados-degradados)

---

## 1. Boot / Splash

| Chave | String | Nota |
|---|---|---|
| `boot.title` | OS CABRA | logo, não é texto render |
| `boot.tagline` | um traçado pernambucano | abaixo do logo |
| `boot.skip` | [ESPAÇO] pula | micro hint |

## 2. Menu Principal

| Chave | String | Nota |
|---|---|---|
| `menu.play` | ARROCHA AÍ | equivalente a "começar / jogar" |
| `menu.codes` | CÓDIGOS DOS CABRA | tela de códigos |
| `menu.credits` | QUEM FEZ ESSE TRAÇADO | créditos |
| `menu.quit` | VAZAR | sair |
| `menu.highscore` | RECORDE: %n | rodapé, só se houver |
| `menu.version` | v%s · %n | rodapé |

## 3. Confirmações e diálogos genéricos

| Chave | String | Nota |
|---|---|---|
| `dialog.yes` | VISSE | yes em modais |
| `dialog.no` | DEIXA PRA LÁ | no em modais |
| `dialog.back` | VOLTAR | genérico |
| `dialog.ok` | BORA | OK genérico |
| `dialog.quit_confirm` | VAZAR MESMO? PERDE TUDO. | confirmação de sair durante partida |
| `dialog.restart_confirm` | RECOMEÇA A FASE INTEIRA? | confirmação de restart |

## 4. Tela de Códigos

| Chave | String | Nota |
|---|---|---|
| `codes.title` | CÓDIGOS DOS CABRA | |
| `codes.subtitle` | cola o código do cabra pra ver o score | |
| `codes.input_placeholder` | _ | por célula |
| `codes.confirm` | [ENTER] confere | CTA |
| `codes.your_code_label` | SEU ÚLTIMO CÓDIGO | |
| `codes.share_hint` | copia e manda pros cabra | |
| `codes.copy` | [C] copia | atalho |
| `codes.new_game` | [N] jogo novo | atalho |
| `codes.invalid` | ESSE CÓDIGO NÃO COLA | erro de validação |
| `codes.copied` | COPIEI AÍ | toast após copy |
| `codes.empty` | AINDA NÃO TEM | se não há código salvo |

## 5. Preload — dicas

Rotacionam a cada 3s no Preload (`04-preload.md`).

| Chave | String |
|---|---|
| `tip.hold_on` | SEGURA O CABRA, QUE JÁ VAI. |
| `tip.dodge` | SE TOMAR TIRO, TU VÊ ESTRELA. |
| `tip.swarm` | QUANDO VIER MUITO, CORRE PRO CANTO. |
| `tip.umbrella` | SOMBRINHA DE FREVO BLOQUEIA UM HIT SÓ. |
| `tip.papafigo` | PAPA-FIGO MIRA ONDE TU TÁ. ANDA. |
| `tip.bomb` | TÁ APERTADO? [X] E PRONTO. |
| `tip.checkpoint` | MORREU NO MEIO DA FASE? VOLTA DO CHECKPOINT. |
| `tip.kamikaze` | URUBU VEM PRA CIMA. DERRUBA ANTES. |
| `tip.boss_telegraph` | SE UMA LUZ AVISA, É TIRO GRANDE. FOGE. |
| `tip.tapioca` | TAPIOCA DOBRADA DÁ VIDA EXTRA. ACHE. |
| `tip.chain` | 5 INIMIGOS SEM LEVAR TIRO = MULTIPLICADOR. |
| `tip.code` | TEU CÓDIGO FINAL É PRA MOSTRAR PROS CABRA. |

## 6. Intros de Fase

| Chave | Nome | Subtítulo |
|---|---|---|
| `stage.1.name` | MARCO ZERO | ONDE TUDO COMEÇA |
| `stage.2.name` | LADEIRAS DE OLINDA | DESCE QUEM PODE |
| `stage.3.name` | RECIFE ANTIGO | DENTRO DA FESTA |
| `stage.4.name` | CAPIBARIBE | A MARÉ VIROU |
| `stage.5.name` | SERTÃO | A HORA É AGORA |

String de cabeçalho: `FASE %n`.

## 7. HUD

| Chave | String | Nota |
|---|---|---|
| `hud.score_label` | SCORE | topo |
| `hud.multiplier` | ×%n.%n | ex: ×1.5 |
| `hud.lives` | — | só ícone, sem texto |
| `hud.bombs` | — | só ícone |
| `hud.powerup_timer` | %ns | ex: 10s |
| `hud.powerup_expiring` | JÁ VAI! | últimos 3s, pulsa |

## 8. Feedback de gameplay

Pequenos textos flutuantes ou overlays:

| Chave | String | Quando |
|---|---|---|
| `feedback.ready` | PAI D'ÉGUA | "ready" no início |
| `feedback.go` | VAI, MENINO | começa o gameplay |
| `feedback.first_blood` | PRIMEIRO DO DIA | primeira kill da run |
| `feedback.chain5` | ENGATADO | chain 5 inimigos |
| `feedback.chain10` | TÁ ARRASANDO | chain 10 |
| `feedback.chain20` | É BRABO MESMO | chain 20 |
| `feedback.milestone_10k` | ÉGUA! 10 MIL | score 10.000 |
| `feedback.milestone_50k` | MEIO CENTO, CABRA! | score 50.000 |
| `feedback.milestone_100k` | CEM MIL ARRETADO | score 100.000 |
| `feedback.damage` | AÍ, VIU? | quando player leva dano |
| `feedback.last_life` | É A ÚLTIMA! | quando fica com 1 vida só |
| `feedback.invulnerable` | — | apenas VFX, sem texto |
| `feedback.life_up` | TÁ COM TUDO | +1 vida (tapioca) |
| `feedback.near_miss` | QUASE | projétil passou raspando (opcional) |
| `feedback.perfect_wave` | LIMPOU TUDO | limpou onda sem dano |
| `feedback.wave_complete` | ONDA %n VAI | nova onda começa |

### Feedback de pick-up (power-up)

Alterna entre estes ao pegar power-up (variedade):

| Chave | String |
|---|---|
| `pickup.arretado` | ARRETADO! |
| `pickup.visse` | VISSE?! |
| `pickup.egua` | ÉGUA! |
| `pickup.massa` | TÁ MASSA |
| `pickup.paidegua` | PAI D'ÉGUA |
| `pickup.oxente` | OXENTE! |

## 9. Power-ups

| Chave | Nome exibido | Descrição (só em tooltip/tutorial) |
|---|---|---|
| `powerup.triple` | FOGO DE ARTIFÍCIO TRIPLO | tiro se abre em 3 |
| `powerup.umbrella` | SOMBRINHA DE FREVO | escudo, aguenta 1 hit |
| `powerup.cachaca` | CACHAÇA BOA | smart bomb (X pra soltar) |
| `powerup.tapioca` | TAPIOCA DOBRADA | +1 vida |
| `powerup.baque` | BAQUE-VIRADO | wingman atirando junto |

## 10. Pausa

| Chave | String |
|---|---|
| `pause.title` | PAREI |
| `pause.resume` | BORA |
| `pause.restart_stage` | RECOMEÇA A FASE |
| `pause.quit` | VAZAR PRO MENU |
| `pause.controls_hint` | ESC retoma · ↑↓ escolhe · ENTER confirma |

## 11. Checkpoint

| Chave | String |
|---|---|
| `checkpoint.title` | ONDE EU TAVA |
| `checkpoint.subtitle` | salvou na metade da fase |

## 12. Bosses

### Entrada

| Chave | String |
|---|---|
| `boss.appear` | OXE! |
| `boss.hp_label` | — | só barra |

### Nomes e epítetos

| Chave | Nome | Epíteto |
|---|---|---|
| `boss.1.name` | MARACATU NAÇÃO | REI · RAINHA · CALUNGA |
| `boss.2.name` | HOMEM DA MEIA-NOITE | O GIGANTE DE OLINDA |
| `boss.3.name` | GALO DA MADRUGADA MALIGNO | O BICHO NO CARNAVAL |
| `boss.4.name` | IARA DO CAPIBARIBE | A ÁGUA MÓRBIDA |
| `boss.5.name` | O CORONEL | DONO DE TUDO |

### Transições de fase do boss

| Chave | String | Quando |
|---|---|---|
| `boss.phase2` | EITA, MUDOU | HP cai pra 66% |
| `boss.phase3` | DANOU-SE AGORA | HP cai pra 33% |
| `boss.defeated` | SE FOI | ao derrotar |
| `boss.bonus_label` | BONUS DE BOSS | no recap |
| `boss.lives_label` | VIDAS RESTANTES | no recap |

## 13. Fim de Fase

| Chave | String | Nota |
|---|---|---|
| `stage_end.1.title` | FASE 1 — SE DANOU | |
| `stage_end.2.title` | FASE 2 — EITA | |
| `stage_end.3.title` | FASE 3 — MEU PAI DO CÉU | |
| `stage_end.4.title` | FASE 4 — QUASE | |
| `stage_end.stat_score` | SCORE DA FASE | |
| `stage_end.stat_kills` | INIMIGOS NO CHÃO | |
| `stage_end.stat_deaths` | VEZES QUE MORREU | |
| `stage_end.stat_lives` | VIDAS RESTANTES | |
| `stage_end.total` | SCORE TOTAL | |
| `stage_end.continue` | BORA PRA PRÓXIMA | CTA |
| `stage_end.quit` | VAZAR | |

## 14. Game Over

Variações aleatórias — sorteia uma no início da tela:

| Chave | String |
|---|---|
| `gameover.1` | SE LASCOU |
| `gameover.2` | RAPAZ... |
| `gameover.3` | NÃO DEU NÃO |
| `gameover.4` | VOLTA ESSA FITA |
| `gameover.5` | FOI BRABO MESMO |
| `gameover.6` | PAGOU O PREÇO |
| `gameover.7` | FICA PRA OUTRO DIA |

Labels fixos:

| Chave | String |
|---|---|
| `gameover.score` | SCORE |
| `gameover.record` | RECORDE |
| `gameover.new_record` | NOVO RECORDE! |
| `gameover.code_label` | SEU CÓDIGO |
| `gameover.share_hint` | manda pros cabra · [C] copia |
| `gameover.retry` | TENTA DE NOVO |
| `gameover.menu` | MENU |
| `gameover.shortcuts` | ENTER menu · R recomeça · C copia código |

## 15. Vitória final

### Parte 1 — poético

| Chave | String |
|---|---|
| `victory.title` | OS CABRA VENCERAM |
| `victory.subtitle` | (ou não) |
| `victory.poem_1` | tudo volta ao normal, |
| `victory.poem_2` | mas o mangue guarda segredo. |
| `victory.continue_hint` | (ENTER continua) |

### Parte 2 — stats + créditos

| Chave | String |
|---|---|
| `victory.stats_title` | SE AJEITOU DIREITO |
| `victory.score_final` | SCORE FINAL |
| `victory.record` | RECORDE |
| `victory.code_label` | SEU CÓDIGO |
| `victory.credits_shortcut` | [ENTER] menu · [C] copia código |

## 16. Créditos

Texto completo da tela de créditos. Pode ser editado livremente.

```
DIREÇÃO
CABRA DA PESTE

CÓDIGO
CABRA + OUTRO CABRA

ARTE
CABRA DE ENXADA COM PINCEL

SOM
MUITA FREVOCA

INSPIRAÇÃO
J. BORGES, GILVAN SAMICO,
LULA CÔRTES, O AUTO DA COMPADECIDA,
TODA ROLA DE FREVO.

AGRADECIMENTOS
À LITERATURA DE CORDEL,
AO CAPIBARIBE,
AO PAI D'ÉGUA DA NETA DA DOCE,
AOS BONECOS DE MAMULENGO,
E A TODO CABRA QUE TESTOU.

BOIS PERNAMBUCANOS VIRTUAIS
AGRADECEM.

(made with Phaser 4 + muita tapioca)
```

## 17. Inimigos — nome curto e taunt (opcional)

Caso o Gameplay Dev queira mostrar nome do inimigo em popup ao primeiro encontro (v2), ou para debug:

| Chave | Nome | Taunt (opcional, ao aparecer primeira vez na run) |
|---|---|---|
| `enemy.frevo` | PASSISTA DE FREVO | "EU GIRO E TU DANÇA" |
| `enemy.caboclinho` | CABOCLINHO | "FLECHA TUA!" |
| `enemy.mamulengo` | MAMULENGO | "PULO NA TUA FRENTE" |
| `enemy.lanca` | CABOCLO DE LANÇA | "SEGURA ESSA" |
| `enemy.urubu` | URUBU DO CAPIBARIBE | "LÁ VOU EU" |
| `enemy.papafigo` | PAPA-FIGO | "ME DÁ TEU FÍGADO, RAPAZ" |
| `enemy.fulozinha` | COMADRE FULOZINHA | "RODO O MATO" |
| `enemy.bestafera` | BESTA-FERA | "TÁ PEDINDO" |
| `enemy.mosca` | MOSCA DA MANGA | (enxame, sem taunt) |

## 18. Erros e estados degradados

| Chave | String | Nota |
|---|---|---|
| `error.no_storage` | SEM SALVAMENTO — NAVEGADOR BLOQUEOU | em vez de quebrar |
| `error.asset_fail` | FALTOU UM PEDAÇO. APERTA F5. | erro de preload |
| `error.webgl` | TEU NAVEGADOR TÁ FRACO | fallback WebGL ausente |
| `error.generic` | DEU RUIM, CABRA. | genérico |

---

## Notas gerais de i18n

Mesmo sendo single-language (PT-BR regional), estruture chaves assim pra preparar terreno:
- Chaves hierárquicas (`menu.play`, não `playButton`)
- Interpolação via `%s` / `%n` / `%code`
- Nenhuma string hardcoded em TS; passa tudo por um `Strings.ts` que lê deste glossário (stub pode virar JSON mais tarde)

**Meta de contagem**: ~120 strings totais neste doc. Suficiente pra cobrir todo o conteúdo visível do v1.
