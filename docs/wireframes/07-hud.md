---
name: wireframe-07-hud
description: Especificação pixel-perfect do HUD em 800×600 — todas as coordenadas
---

# 07 — HUD (especificação detalhada)

**Propósito**: referência única pro Gameplay Dev posicionar cada elemento. Complementa `UX_SPEC.md` §3.

**Canvas**: 800×600. Origem top-left. Coordenadas em px.

## Top bar (y=0..40)

```
x=0                                                                      x=800
┌──────────────────────────────────────────────────────────────────────────┐
│  🐓  🐓  🐓            SCORE  012.340      ×1.5              💣  💣      │  y=0..40
└──────────────────────────────────────────────────────────────────────────┘
 x=20  x=52 x=84          x=340           x=500              x=700  x=740
```

### Elementos top bar

| Elemento | x | y | w×h | Fonte | Cor | Notas |
|---|---|---|---|---|---|---|
| Vida slot 1 | 20 | 10 | 24×24 | — | `#b84a2e` | Ícone galo cheio |
| Vida slot 2 | 52 | 10 | 24×24 | — | `#b84a2e` | " |
| Vida slot 3 | 84 | 10 | 24×24 | — | `#b84a2e` | " |
| Label "SCORE" | 300 | 12 | auto | Display 14px | `#f4e4c1` @ 70% | |
| Score valor | 360 | 8 | auto | Display bold 24px | `#f4e4c1` | pad zero à esquerda (6 dígitos) |
| Multiplicador | 500 | 10 | auto | Display italic 20px | `#d4a04c` | Só aparece se ×>1, pulsa |
| Bomb slot 1 | 700 | 10 | 24×24 | — | `#d4a04c` | Garrafinha |
| Bomb slot 2 | 740 | 10 | 24×24 | — | `#d4a04c` | " |

### Estados de vida

- **Cheia**: ícone galo vibrante `#b84a2e`
- **Perdida** (slot vazio): silhueta vazada do galo @ 30% alpha (mostra que tinha ali)
- **Ao perder vida**: slot do galo faz dissolve (3 frames, 200ms) + shake do top bar (amplitude 4px, 150ms)

### Score

- Sempre 6 dígitos com padding zero: `000000` a `999999`
- Acima de 999.999: usa `M` (ex: `1.2M`)
- Animação de "contador": ao ganhar pontos, valor sobe por tween 400ms (`Quad.easeOut`) em vez de saltar

### Multiplicador

- Fica invisível se ×1.0 (baseline)
- Aparece em ×1.5 com entrada scale 1.4→1.0 em 200ms
- Pulsa (scale 1.0↔1.06 em 600ms loop) enquanto ativo
- Ao expirar, pisca 3× em 300ms e some

### Bombs

- Mostra até 2 slots sempre presentes como silhueta (`#d4a04c` @ 25% alpha)
- Cada bomb disponível preenche um slot em cor sólida
- Ao usar (X): flash branco do ícone + some

## Bottom strip (y=560..600) — condicional

Só visível se há power-up com duração ativo. Oculta quando sem power-up.

```
x=0                                                                      x=800
┌──────────────────────────────────────────────────────────────────────────┐
│  [icone]  SOMBRINHA DE FREVO       ██████████░░░░░░░        10s          │  y=560..600
└──────────────────────────────────────────────────────────────────────────┘
 x=20     x=60                     x=360..640                     x=760
```

### Elementos bottom strip

| Elemento | x | y | w×h | Fonte | Cor |
|---|---|---|---|---|---|
| Bg strip | 0 | 560 | 800×40 | — | `#1a0f08` @ 80% |
| Ícone powerup | 20 | 566 | 28×28 | — | cor do powerup |
| Nome | 60 | 572 | auto | Display 16px | `#f4e4c1` |
| Barra (bg) | 360 | 572 | 280×16 | — | `#1a0f08` borda 1px `#f4e4c1` |
| Barra (fill) | 360 | 572 | 280*t/total, 16 | — | cor do powerup |
| Timer | 760 | 572 | auto | Mono 16px | `#f4e4c1` |

### Comportamento

- Entrada: bottom strip sobe do y=600 para y=560 em 300ms (`Back.easeOut`) quando powerup é pego
- Saída: desce + fade em 200ms quando powerup expira
- **Últimos 3 segundos**: barra pisca (vermelho `#b84a2e` ↔ cor base) a 3Hz; timer pulsa de escala
- Power-ups que não têm duração (Sombrinha = até hit) mostram `—` em vez de timer, sem fill

## Regras globais de HUD

- **Nunca** é tapado por inimigos — HUD está em profundidade (Phaser depth) 100+, inimigos em 10-50
- Fonte do HUD: Display bold (mesma família da tela de menu, para coesão)
- Todos os números em `tabular-nums` (width fixa) para não dançar quando valor muda
- Animações de HUD nunca passam de 400ms — não podem competir com atenção do gameplay
- Em hit do player: **todo HUD** pisca 80ms (flash `#f4e4c1` @ 40%) — reforça que "algo importante aconteceu com meu estado"

## Safe zones

- Gameplay spawn area: y=60..540 (20px de folga de cada HUD)
- Nenhum elemento interativo do HUD é clicável (é jogo de teclado)
- Em dispositivos com notch/escala, aplicar `FIT` scale manager — garante que HUD não escape do canvas
