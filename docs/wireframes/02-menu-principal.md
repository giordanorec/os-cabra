---
name: wireframe-02-menu-principal
description: Menu principal com 4 opções navegáveis por setas + Enter
---

# 02 — Menu Principal

**Propósito**: Hub de entrada. Máximo 2 cliques do menu ao jogo ("BORA, CABRA" → jogando).

**Input**: ↑/↓ navega, Enter/Espaço confirma, ESC não faz nada aqui (sem retorno).

## Layout (800×600)

```
┌────────────────────────────────────────────────────────────┐   y=0
│ · · · · · parallax bg (Marco Zero distante) · · · · · · · │
│                                                            │
│                                                            │
│                    {{ LOGO OS CABRA }}                     │   y≈90  (240×80, centrado)
│                                                            │
│                                                            │
│                                                            │
│              ┌──────────────────────────┐                  │
│              │     [BORA, CABRA]  ◀     │                  │   y≈260  (botão selecionado)
│              └──────────────────────────┘                  │
│                                                            │
│              ┌──────────────────────────┐                  │
│              │    [CÓDIGOS DOS CABRA]   │                  │   y≈320
│              └──────────────────────────┘                  │
│                                                            │
│              ┌──────────────────────────┐                  │
│              │  [QUEM FEZ ESSE TRAÇADO] │                  │   y≈380
│              └──────────────────────────┘                  │
│                                                            │
│              ┌──────────────────────────┐                  │
│              │         [SAIR]           │                  │   y≈440
│              └──────────────────────────┘                  │
│                                                            │
│                                                            │
│  (recorde: 18.900)                       v0.1.0 · 2026     │   y≈580  rodapé
└────────────────────────────────────────────────────────────┘   y=600
```

## Hierarquia

1. **Logo** — âncora de marca
2. **BORA, CABRA** — CTA primário, destaque sempre por padrão
3. Outros botões em ordem de frequência
4. Rodapé com highscore (seduz volta) + versão (dev info)

## Elementos

| Elemento | x,y,w,h | Fonte | Cor |
|---|---|---|---|
| Logo | 280,70,240,80 | — | — |
| Botão ativo | 250,245,300,50 | Display 32px | Texto `#1a0f08` / bg `#d4a04c` |
| Botão idle | 250,305..425,300,50 | Display 28px | Texto `#f4e4c1` / bg transparente + borda 2px `#f4e4c1` |
| Indicador ◀ | 555,+btn | Display 24px | `#b84a2e` (pulsa 1s period) |
| Highscore | 20,575 | Corpo 14px | `#f4e4c1` @ 70% |
| Versão | 700,575 | Mono 12px | `#f4e4c1` @ 50% |

## Estados de botão

- **Idle**: borda dourada, texto creme, bg transparente
- **Hover/selected**: bg ocre chapado, texto preto, indicador ◀ piscando, leve scale 1.04
- **Press** (durante Enter): scale 0.98 por 80ms

## Transições

- **Entrada**: botões entram em cascata (stagger 80ms), cada um com fade + translate-x -30px → 0 (`Back.easeOut`, 350ms)
- **Seleção muda**: indicador ◀ desliza entre botões em 120ms (`Quad.easeOut`)
- **Confirmar**: flash branco 80ms no botão + som "visse" + wipe pra próxima tela

## Notas

- Fundo com parallax sutil (nuvem + Torre Malakoff ao longe) — dá profundidade sem competir com UI
- "SAIR" pede confirmação ("SAIR MESMO?" yes/no) — evita saída acidental
- Highscore só aparece se existir no localStorage
