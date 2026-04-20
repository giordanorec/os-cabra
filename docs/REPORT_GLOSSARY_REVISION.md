# Relatório — Revisão do Glossário PT-BR (purga de gírias não-PE)

> Branch: `docs/glossary-revision` · Data: 2026-04-19 · Autor: UI/UX Designer

## Contexto

Feedback do Arquiteto, validado pelo dono do projeto (pernambucano de Recife): o glossário continha gírias que **não são de Pernambuco** — principalmente "ARROCHA AÍ" no botão primário do menu. "Arrocha" é gíria e gênero musical da Bahia; usá-la como CTA principal do jogo soa apropriação genérica de "Nordeste", não voz local autêntica.

**Regra adotada** (agora documentada no topo do `GLOSSARY_PT_BR.md`):
> Ou usa gíria real de Recife/Pernambuco, ou deixa neutro direto. Forçar piada regional sem conhecimento fica pior que não ter nada.

## Diff — antes → depois

### Substituições (gíria não-PE → PE confirmado ou neutro)

| Chave | Antes | Depois | Motivo |
|---|---|---|---|
| `menu.play` | ARROCHA AÍ | **BORA, CABRA** | "arrocha" = Bahia. "Cabra" reforça a identidade do jogo e é PE. |
| `menu.quit` | VAZAR | **SAIR** | "vazar" é gíria nacional (SP/RJ). Botão de sair pede clareza; neutro ganha. |
| `dialog.quit_confirm` | VAZAR MESMO? PERDE TUDO. | **SAIR MESMO? PERDE TUDO.** | mesma razão acima. |
| `pause.quit` | VAZAR PRO MENU | **VOLTAR PRO MENU** | idem. "Voltar" encaixa melhor no fluxo de pausa. |
| `stage_end.quit` | VAZAR | **SAIR** | idem. |
| `feedback.chain10` | TÁ ARRASANDO | **TÁ DOIDO!** | "arrasando" é nacional. "Tá doido" é interjeição PE legítima. |
| `feedback.damage` | AÍ, VIU? | **EITA!** | "Aí, viu?" é coloquial genérico; "eita" é interjeição PE/NE clássica e curta, cabe em flash. |
| `feedback.life_up` | TÁ COM TUDO | **NOVA VIDA** | "tá com tudo" é nacional e ambíguo como feedback de +1 vida; texto direto funciona melhor. |
| `gameover.4` | VOLTA ESSA FITA | **DANOU-SE** | "volta essa fita" é idiom brasileiro geral sem marca PE. "Danou-se" está na lista PE do arquiteto. |
| `victory.stats_title` | SE AJEITOU DIREITO | **ACABOU TUDO BEM** | "se ajeitou" é coloquial genérico. Alternativa já prevista no wireframe 14. |

### Removido com nota

| Chave removida | Motivo |
|---|---|
| `pickup.massa` ("TÁ MASSA") | "Massa" sozinho virou gíria nacional. "É massa" em fala ainda é PE, mas como botão curto/feedback fica ambíguo. Os outros 7 pickups (`arretado`, `visse`, `égua`, `paidegua`, `oxente`, mais os 2 novos abaixo) já cobrem a variedade sem risco. |

### Adicionado

| Chave nova | String | Motivo |
|---|---|---|
| `pickup.danou` | DANOU-SE! | PE confirmado; cobre lacuna de variedade após remoção de `pickup.massa`. |
| `pickup.bicho` | BICHO! | PE confirmado; interjeição curta. |

### Mantido (validado como PE legítimo ou neutro consciente)

| Chave | String | Classificação |
|---|---|---|
| `menu.codes` | CÓDIGOS DOS CABRA | PE — arquiteto confirmou OK |
| `menu.credits` | QUEM FEZ ESSE TRAÇADO | PE — "traçado" tem uso local em arte/cordel; confirmado OK |
| `dialog.yes` | VISSE | PE confirmado |
| `boot.tagline` | um traçado pernambucano | neutro/descritivo, referência explícita |
| `feedback.ready` | PAI D'ÉGUA | PE confirmado |
| `feedback.go` | VAI, MENINO | PE confirmado (arquiteto) |
| `feedback.chain20` | É BRABO MESMO | PE confirmado |
| `feedback.milestone_10k` | ÉGUA! 10 MIL | PE |
| `feedback.milestone_100k` | CEM MIL ARRETADO | PE |
| `boss.appear` | OXE! | PE |
| `boss.phase2` | EITA, MUDOU | PE |
| `boss.phase3` | DANOU-SE AGORA | PE |
| `stage_end.1.title` | FASE 1 — SE DANOU | PE |
| `stage_end.2.title` | FASE 2 — EITA | PE |
| `gameover.1` | SE LASCOU | PE (arquiteto confirmou) |
| `gameover.3` | NÃO DEU NÃO | PE |
| `gameover.5` | FOI BRABO MESMO | PE |
| `gameover.2` | RAPAZ... | neutro/nacional, mas natural em PE também |
| `gameover.6` | PAGOU O PREÇO | neutro consciente |
| `gameover.7` | FICA PRA OUTRO DIA | neutro consciente |
| `dialog.no` | DEIXA PRA LÁ | neutro |
| `dialog.ok` | BORA | nacional/neutro, funciona |
| `pause.resume` | BORA | idem |
| `codes.invalid` | ESSE CÓDIGO NÃO COLA | "não cola" é nacional coloquial, neutro funcional |
| Todas as dicas em `tip.*` | — | usam "tu/teu" (PE), "frevo", "tapioca", "urubu" (PE/local), `capibaribe` — autênticas |
| Nomes de fases/bosses/inimigos | — | geografia e folclore PE real, ficam |
| Créditos | — | referências PE explícitas (J. Borges, Samico, Capibaribe, mamulengo) |

## O que não mudou no código

`src/strings.ts` hoje importa só um subset pequeno das chaves. Dessas, 4 precisam de atualização automática quando o Gameplay Dev puxar este glossário:

| Chave no `strings.ts` | Valor atual | Novo valor |
|---|---|---|
| `menu.play` | 'ARROCHA AÍ' | 'BORA, CABRA' |
| `pause.quit` | 'VAZAR PRO MENU' | 'VOLTAR PRO MENU' |
| `gameover.title` | 'SE LASCOU' | **sem mudança** (é `gameover.1`, ok) |
| (demais chaves no subset) | — | sem mudança |

O Gameplay Dev já consome via `getString()` então basta atualizar o dicionário em `src/strings.ts` (2 linhas). Nota explícita pra ele no final deste relatório.

## Decisões e tradeoffs

1. **Escolhi "BORA, CABRA" em vez de "OXE, BORA"** para `menu.play`. "OXE, BORA" tem o marcador PE mais explícito (OXE), mas "BORA, CABRA" usa a palavra-identidade do jogo (já está no título), cria coesão entre menu → HUD → game over onde "cabra" aparece. Se o dono preferir "OXE, BORA", a troca é 1 linha.

2. **`pickup.massa` removido em vez de "marcado TODO"**. Ambíguo demais pra deixar incerto no dicionário ativo; melhor ter 7 pickups todos inequívocos do que 8 sendo que 1 causa ruído.

3. **`feedback.chain10` = "TÁ DOIDO!"** — escolhido sobre alternativas ("É BRABO" já é chain20, "ARRETADO" já é pickup/100k). Varia o vocabulário na progressão: chain5 ENGATADO → chain10 TÁ DOIDO → chain20 É BRABO MESMO.

4. **`victory.stats_title`** estava previsto como "ACABOU TUDO BEM" no wireframe 14 como alternativa default. Aproveitei pra consolidar.

5. **Não adicionei TODOs** — as decisões acima são todas dentro do perímetro de gírias confirmadas pelo arquiteto ou neutralizações óbvias. Se o dono olhar e discordar de alguma escolha (ex: preferir "OXE, BORA"), é uma linha de ajuste.

## Nota pro Gameplay Dev

(Copiar integral pra sessão dele quando o orquestrador quiser.)

> **Nota do Arquiteto + UI/UX**: `docs/GLOSSARY_PT_BR.md` foi revisado em `docs/glossary-revision` (PR aberto). Tinha gíria baiana no botão do menu ("ARROCHA AÍ"), trocada + algumas outras limpezas. Como seu código consome via `getString()`, basta atualizar o dicionário `STRINGS` em `src/strings.ts` — **2 chaves mudam**:
>
> - `menu.play`: `'ARROCHA AÍ'` → `'BORA, CABRA'`
> - `pause.quit`: `'VAZAR PRO MENU'` → `'VOLTAR PRO MENU'`
>
> Demais chaves do subset atual (gameover.title, boss.*, etc) não mudaram. Quando M3/polish for criar chaves novas pra boss dialogues, feedback, ou qualquer texto visível, **pede pro UI/UX validar antes de mergear**. Não inventa pernambuquês — isso foi exatamente o erro dessa revisão.

## Arquivos tocados nesta branch

```
docs/GLOSSARY_PT_BR.md                    MODIFIED  (revisão completa + seção de filtro no topo)
docs/REPORT_GLOSSARY_REVISION.md          NEW       (este arquivo)
docs/UX_SPEC.md                           MODIFIED  (§4 samples, §6 feedbacks, §8 transições — literais atualizados + nota de revisão)
docs/UI_STYLE_GUIDE.md                    MODIFIED  (§2.4 exemplo "ARROCHA AÍ" → "BORA, CABRA")
docs/wireframes/02-menu-principal.md      MODIFIED  (botão play, botão quit, notas)
docs/wireframes/08-pausa.md               MODIFIED  ("VAZAR PRO MENU" → "VOLTAR PRO MENU")
docs/wireframes/12-fim-de-fase.md         MODIFIED  ("VAZAR" → "SAIR")
docs/wireframes/13-game-over.md           MODIFIED  (variação "VOLTA ESSA FITA" → "DANOU-SE")
docs/wireframes/14-vitoria-final.md       MODIFIED  ("SE AJEITOU DIREITO" → "ACABOU TUDO BEM")
```

**Não toquei**:
- `src/strings.ts` — Gameplay Dev atualiza (2 linhas, detalhadas acima).
- `docs/REPORT_UX_DESIGNER.md` — relatório histórico do M0 UI/UX; preservar como registro.
- `docs/REPORT_GAMEPLAY_DEV_M2.md` — cita "ARROCHA AÍ" na descrição de screenshot histórica; documento deles.
- `docs/SOUND_SPEC.md`, `docs/SOUND_LIST.md`, `docs/VOCALIZES_RECORDING.md` — Sound Designer owns. Ver coordenação abaixo.

## Coordenação com Sound Designer

Dois vocalizes ficaram "órfãos" por causa da revisão:

| Arquivo vocalize | Conteúdo gravado | Chave associada antes | Chave nova |
|---|---|---|---|
| `voc_ai_viu.ogg` | "AÍ, VIU?!" lamentado (perder vida) | `feedback.damage` = "AÍ, VIU?" | `feedback.damage` = "EITA!" (texto) |
| `voc_ta_com_tudo.ogg` | "TÁ COM TUDO!" (1-up) | `feedback.life_up` = "TÁ COM TUDO" | `feedback.life_up` = "NOVA VIDA" (texto) |

**Recomendação**: manter os arquivos de voz como estão. O texto on-screen (curto, legível, neutro) e o voice-over (expressivo, com intonação PE) são canais diferentes. Voice ainda entrega a identidade PE via entonação e conteúdo; texto entrega clareza visual. O Sound Designer pode avaliar se prefere re-gravar como "EITA!" / "NOVA VIDA" pra alinhar, mas isso é decisão dele — não é exigência desta revisão.

## Follow-ups possíveis (fora do escopo)

- Playtest com 2-3 pernambucanos diferentes validando a lista "mantidos" em contexto (não só palavra por palavra).
- Revisar `docs/REPORT_UX_DESIGNER.md` só se for reabrir o relatório original (não recomendo — deixar como registro histórico).
- Validar com dono PE se "BORA, CABRA" ou "OXE, BORA" soa mais natural como CTA primário (troca de 1 linha se mudar).
