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
│ 🐓🐓🐓                   SCORE: 12,340              💣 💣 │  ← top bar (~40px)
│                                                         │
│                                                         │
│                    [ gameplay area ]                    │
│                                                         │
│                                                         │
│                                                         │
│                       [ player ]                        │
│                                                         │
│ [POWER-UP: SOMBRINHA DE FREVO]                          │  ← bottom strip (só se ativo)
└─────────────────────────────────────────────────────────┘
```

- **Vidas**: ícones de galo pequeno, alinhados à esquerda
- **Score**: centro, fonte display grande
- **Smart bombs**: ícones de garrafinha à direita
- **Power-up ativo**: barra inferior, só aparece se tiver power-up. Pulsa quando expirando

## 4. Textos e glossário pernambucano

### Menu
- "JOGAR" → **"ARROCHA AÍ"**
- "CÓDIGOS" → **"CÓDIGOS DOS CABRA"**
- "CRÉDITOS" → **"QUEM FEZ ESSE TRAÇADO"**
- "SAIR" → **"VAZAR"**

### Feedbacks de jogo
- Ready → **"PAI D'ÉGUA"**
- Game Start → **"VAI, MENINO"**
- Pausa → **"PAREI"**
- Continuar → **"BORA"**
- Game Over → **"SE LASCOU"**
- Boss aparece → **"OXE!"** (grande, animado)
- Power-up pego → **"ARRETADO!"**, **"VISSE?!"**, **"ÉGUA!"**
- Perdeu vida → **"AÍ, VIU?"**
- 1-up → **"TÁ COM TUDO"**

### Fases (intros)
- Fase 1 → **"MARCO ZERO — ONDE TUDO COMEÇA"**
- Fase 2 → **"LADEIRAS DE OLINDA — DESCE QUEM PODE"**
- Fase 3 → **"RECIFE ANTIGO — DENTRO DA FESTA"**
- Fase 4 → **"CAPIBARIBE — A MARÉ VIROU"**
- Fase 5 → **"SERTÃO — A HORA É AGORA"**

### Game Over
```
SE LASCOU
_______________

SCORE: 12,340
RECORDE: 18,900

SEU CÓDIGO: A3X9K2
manda pros cabra

[ENTER] menu
```

### Vitória
```
OS CABRA VENCERAM
(ou não)

tudo volta ao normal,
mas o mangue guarda segredo

SCORE FINAL: 48,320
```

## 5. Tipografia

- **Display** (títulos): fonte inspirada em cordel, pesada, com serifa irregular. Candidatos: **Rye**, **Bungee**, **Modak** (Google Fonts). Ou fonte customizada
- **Corpo** (textos longos): sans-serif legível, ex. **Inter**, **DM Sans**
- **Mono** (debug, códigos): **JetBrains Mono**, **IBM Plex Mono**

Tamanhos (em 800×600):
- Título: 48-64px
- Subtítulo: 24-32px
- Corpo: 16-18px
- HUD número: 20-24px
- Micro: 12px

## 6. Feedback visual — padrões

| Evento | Feedback |
|---|---|
| Player atira | Muzzle flash (partícula 60ms) + som |
| Inimigo atingido | Tint branco 80ms + som hit |
| Inimigo morre | Partículas de explosão + shake leve + som |
| Boss atingido | Tint + freeze frame 40ms |
| Player leva dano | Red flash tela 120ms + shake médio + som + invulnerabilidade piscante |
| Power-up pego | Flash da cor do power-up + som triunfal + texto flutuante "ARRETADO!" |
| Checkpoint | Texto em cena "ONDE EU TAVA" com fade, sem pausa |
| Boss aparece | Freeze de 1.5s, letreiro entra + som característico |
| Score milestone (10k, 50k) | Texto celebrativo "ÉGUA!" |

## 7. Acessibilidade

Mesmo sendo v1, seguir o básico:

- Contraste mínimo 4.5:1 pra texto
- Fontes ≥ 16px no gameplay
- Não usar só cor pra diferenciar inimigos (silhueta importa)
- Modo daltônico: deixar previsto — toggle em Opções (mesmo que só funcione em v2)

## 8. Animação/transições

- Menu → Gameplay: **wipe horizontal** (como quando você vira página de cordel)
- Pausa entra: **zoom out rápido** + desfoque leve
- Fase → Boss: **slow zoom in** no jogador, depois reveal do boss
- Game Over: **fade to black lento** (2s) + letreiro aparece

## 9. Entregáveis do UI/UX

1. **Wireframes** de todas as 14 telas (papel/figma, esboço OK)
2. **Glossário PT-BR pernambucano completo** (lista final de todos os textos do jogo)
3. **Style guide de UI** (tipografia, cores de UI, espaçamentos)
4. **Especificação de HUD** com posicionamento exato em 800×600
5. **Animações de transição** descritas (timing, easing)

## 10. Open questions

- [ ] Textos sempre em caixa alta ou só títulos?
- [ ] Legendar SFX importantes (visissíveis) pra acessibilidade?
- [ ] Mostrar controles em overlay no início da partida 1?
