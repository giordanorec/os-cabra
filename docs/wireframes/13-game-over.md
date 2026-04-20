---
name: wireframe-13-game-over
description: Tela ao zerar vidas — score, recorde, código, opções
---

# 13 — Game Over

**Propósito**: fim de partida por morte. Mostra score, compara com recorde, gera código compartilhável.

**Input**: Enter vai pro menu, R reinicia fase 1, C copia código.

## Layout (800×600)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                                                            │
│                  [[SE LASCOU]]                             │   y≈90   display 88px
│                                                            │
│          ────────────────────────────                      │
│                                                            │
│             SCORE:    12.340                               │   y≈220  mono 28px
│             RECORDE:  18.900                               │   y≈260
│                                                            │
│                                                            │
│             SEU CÓDIGO:    A3X9K2                          │   y≈330  mono bold 32px destaque
│                                                            │
│             (manda pros cabra [C] copia)                   │   y≈370  italic 14px @ 70%
│                                                            │
│                                                            │
│          ────────────────────────────                      │
│                                                            │
│              ┌──────────────────────────┐                  │
│              │   [TENTA DE NOVO]  ◀     │                  │   y≈460  CTA
│              └──────────────────────────┘                  │
│              ┌──────────────────────────┐                  │
│              │        [MENU]            │                  │   y≈515
│              └──────────────────────────┘                  │
│                                                            │
│      ENTER menu · R recomeça · C copia código              │   y≈580
└────────────────────────────────────────────────────────────┘
```

## Hierarquia

1. **SE LASCOU** — imenso, catártico
2. Comparação score vs recorde
3. Código compartilhável
4. CTA "TENTA DE NOVO" (default, é o que 90% vai querer)

## Elementos

| Elemento | x,y | Fonte | Cor |
|---|---|---|---|
| "SE LASCOU" | 400,130 | Display 88px | `#b84a2e` + sombra `#1a0f08` |
| Linhas | 150/650, 180 & 400 | — | `#b84a2e` |
| SCORE | 200..600, 220 | Mono 28px | label @ 70% / valor @ 100% |
| RECORDE | idem, 260 | Mono 28px | se score > recorde: destacar em `#d4a04c` + "NOVO RECORDE!" acima |
| Código | 400,330 | Mono bold 32px | `#d4a04c` com box |
| Legenda código | 400,370 | Italic 14px | `#f4e4c1` @ 70% |
| Botão ativo | 270,450,260,45 | Display 24px | `#1a0f08` / bg `#d4a04c` |
| Botão idle | 270,505,260,45 | Display 22px | `#f4e4c1` |
| Atalhos | 400,580 | Micro 12px | @ 50% |

## Variações de mensagem

Selecionar aleatoriamente entre (ver glossário):
- "SE LASCOU"
- "RAPAZ..."
- "NÃO DEU NÃO"
- "DANOU-SE"
- "FOI BRABO MESMO"

## Novo recorde

Se score > highscore anterior:
- Texto "**NOVO RECORDE!**" aparece acima da linha RECORDE em `#d4a04c` + sparkle VFX
- Score em `#d4a04c` + animação de escala 1.2→1.0 em loop 1s

## Transições

- **Entrada**: fade to black 2s (herda do gameplay — ver UX_SPEC §8), depois letreiro "SE LASCOU" com entrada pesada:
  - Letreiro cai do topo (y=-100 → y=130) em 600ms (`Bounce.easeOut`)
  - Stats aparecem em cascata 150ms stagger
  - Código aparece com "máquina de escrever" (chars surgem 60ms cada) — dá peso
  - Botões em cascata
- **Confirma "TENTA DE NOVO"**: fade → Preload fase 1
- **Confirma "MENU"**: fade → Menu Principal
- **R**: atalho pra TENTA DE NOVO mesmo sem selecionar

## Notas

- Música: tocar versão lenta/triste da theme principal (ver `SOUND_SPEC.md` stub)
- Código só muda por sessão — duas mortes na mesma run não geram códigos diferentes na UX (vem do score final)
- Se localStorage está indisponível, ocultar linhas de recorde e código, sem quebrar
