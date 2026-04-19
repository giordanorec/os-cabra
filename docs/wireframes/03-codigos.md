---
name: wireframe-03-codigos
description: Tela de códigos — inserir código de amigo ou ver o seu
---

# 03 — Códigos dos Cabra

**Propósito**: Input manual de 6 caracteres base36 (A-Z0-9, sem ambíguos O/0 e I/1 — ver questão aberta). Também mostra seu último código se houver.

**Input**: digitar A-Z/0-9 até 6 chars, Enter confirma, Backspace apaga, ESC volta ao menu.

## Layout (800×600)

```
┌────────────────────────────────────────────────────────────┐
│ ◂ ESC VOLTA                                                │   y=20   (Mono 14px @ 70%)
│                                                            │
│                                                            │
│              [[CÓDIGOS DOS CABRA]]                         │   y≈80   título 48px
│                                                            │
│          (cola o código do cabra pra ver o score)          │   y≈140  corpo 16px @ 80%
│                                                            │
│                                                            │
│        ┌───┐  ┌───┐  ┌───┐  ┌───┐  ┌───┐  ┌───┐            │
│        │ A │  │ 3 │  │ X │  │ 9 │  │ K │  │ _ │            │   y≈240  6 celas 60×80, gap 12px
│        └───┘  └───┘  └───┘  └───┘  └───┘  └─▼─┘            │
│                                           (cursor)         │
│                                                            │
│                                                            │
│               [ ENTER p/ conferir ]                        │   y≈370  CTA
│                                                            │
│                                                            │
│     ─────────────────────────────────────────              │   y≈440  divisória
│                                                            │
│     SEU ÚLTIMO CÓDIGO: K7M2Q9                              │   y≈470  Mono 22px destaque
│     (copia e manda pros cabra)                             │   y≈500  corpo 14px @ 70%
│                                                            │
│     [C] copia · [N] novo jogo                              │   y≈550  atalhos
└────────────────────────────────────────────────────────────┘
```

## Hierarquia

1. Título
2. Entrada de 6 células (ponto focal)
3. CTA Enter
4. Seu código (bloco secundário)

## Elementos

| Elemento | x,y,w,h | Fonte | Cor |
|---|---|---|---|
| Voltar hint | 20,20 | Mono 14px | `#f4e4c1` @ 70% |
| Título | 400,80,—,48 | Display 48px centralizado | `#d4a04c` |
| Subtítulo | 400,140 | Corpo 16px | `#f4e4c1` @ 80% |
| Célula input | 220+i*72, 240, 60×80 | Mono bold 40px | bg `#1a0f08` / borda `#d4a04c` / texto `#f4e4c1` |
| Célula ativa | (i atual) | idem | borda `#b84a2e` + pulse |
| CTA | 400,370,260,50 | Display 24px | texto `#1a0f08` / bg `#5a7a3a` |
| Seu código | 400,470 | Mono bold 22px | `#f4e4c1` |

## Estados

- **Célula vazia**: `_` placeholder @ 40% alpha
- **Célula preenchida**: caractere sólido
- **Célula atual** (cursor): borda vermelha + underline piscando (800ms period)
- **Código inválido** (após Enter): células chacoalham 200ms + flash vermelho + mensagem "ESSE CÓDIGO NÃO COLA"
- **Código válido**: transiciona pra tela de replay de score (fora do escopo v1, stub)

## Notas

- Input restrito a 32 chars legíveis (alfanumérico, sem O/0/I/1 ambíguos)
- Copiar código: `navigator.clipboard.writeText()` + toast "COPIEI AÍ"
- "Novo jogo" (N) é atalho pro GameScene sem passar pelo menu
- Se não houver código salvo, todo o bloco inferior some e a área é esvaziada
