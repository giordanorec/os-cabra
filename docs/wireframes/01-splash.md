---
name: wireframe-01-splash
description: Tela de boot com logotipo animado por ~1.5s antes do menu principal
---

# 01 — Splash / Boot

**Propósito**: 1ª frame que aparece. Logo "OS CABRA" entra com peso, dissolve pro menu. Sem interação — qualquer tecla pula direto pro menu.

**Duração**: 1.5s auto-advance (ou skip com qualquer tecla).

## Layout (800×600)

```
┌────────────────────────────────────────────────────────────┐   y=0
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                 {{ logo OS CABRA }}                        │   y≈260  (320×120, centrado)
│                                                            │
│                                                            │
│                                                            │
│                 (um traçado pernambucano)                  │   y≈420  tagline, corpo 18px
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                     [ESPAÇO p/ pular]                      │   y≈560  micro 12px, 60% alpha
│                                                            │
└────────────────────────────────────────────────────────────┘   y=600
  x=0                                                    x=800
```

## Hierarquia

1. Logo central — 100% atenção
2. Tagline abaixo — secundária, entra 400ms depois
3. Skip hint — discreto, aparece após 500ms

## Elementos

| Elemento | x,y | Tamanho | Fonte | Cor |
|---|---|---|---|---|
| Logo (sprite) | 240,260 | 320×120 | — | `#f4e4c1` sobre `#1a0f08` |
| Tagline | 400,440 | centralizada | Corpo 18px | `#d4a04c` |
| Skip hint | 400,570 | centralizada | Micro 12px | `#f4e4c1` @ 60% |

## Transições

- **Entrada**: fade in do logo em 400ms (`Cubic.easeOut`)
- **Tagline**: fade + translate-up 20px em 300ms, delay 400ms
- **Saída**: wipe horizontal → Menu (ver `UX_SPEC.md` §8)

## Notas

- Nada de barra de loading aqui. Preload de assets acontece depois (tela 04).
- Fundo pode ter textura sutil de papel antigo (`#f4e4c1` @ 8% noise).
- Áudio: batida de tambor ou caxixi abafado quando logo aparece (ver `SOUND_SPEC.md`).
