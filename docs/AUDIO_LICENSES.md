# Audio Licenses — Os Cabra

> **Responsável**: Sound Designer.
> **Pareado com**: `SOUND_LIST.md` (inventário) e `SOUND_SPEC.md` (filosofia).

Este documento é a **fonte da verdade** sobre cada áudio enviado a `public/assets/`. Sem entrada aqui, o áudio **não pode entrar no commit**.

## Política de licenças aceitas

| Licença | Aceita? | Atribuição obrigatória? | Nota |
|---|---|---|---|
| **CC0 / Public Domain** | ✅ Preferida | Não (mas creditamos por cortesia) | Sem fricção |
| **CC-BY 3.0/4.0** | ✅ OK | **Sim** — listar autor + link no jogo (créditos) | Manter exato como original |
| **CC-BY-SA** | ⚠️ Evitar | Sim + obrigatoriedade de relicenciar derivados sob mesma licença | Pode complicar caso o jogo vire público |
| **CC-NC** (Non-Commercial) | ❌ Não usar | — | Bloqueia distribuição se algum dia comercializar |
| **CC-ND** (No Derivatives) | ❌ Não usar | — | Não permite trim/normalize/edição |
| **Pixabay Content License** | ✅ OK | Não obrigatória | Equivalente prático a CC0 (uso comercial livre, sem atribuição) — checar termos da faixa |
| **Kenney CC0** | ✅ Preferida | Não | Padrão Kenney é CC0 |
| **Royalty-Free proprietária** | ❌ Não usar (default) | — | Caso exista licença explícita gratuita, documentar |

## Status dos arquivos

| Status | Significado |
|---|---|
| `candidate` | URL identificada, ainda não baixada/processada |
| `pending-review` | Baixado, aguardando confirmação humana de qualidade/match |
| `installed` | Em `public/assets/`, processado, commitado |
| `rejected` | Avaliado e descartado (registrar motivo) |

---

## 1. Música — candidatos

| Arquivo destino | Status | Fonte (plataforma) | Autor | Licença | Link original | Notas |
|---|---|---|---|---|---|---|
| `music/menu_frevo.ogg` | candidate | Pixabay Music | (a confirmar — buscar "frevo instrumental") | Pixabay Content | https://pixabay.com/music/search/frevo/ | Pesquisar manualmente; se zero resultado, fallback para "brazilian instrumental" |
| `music/phase1_marco_zero.ogg` | candidate | Pixabay Music | a confirmar | Pixabay Content | https://pixabay.com/music/search/frevo/ | Frevo médio animado |
| `music/phase2_olinda.ogg` | candidate | Pixabay SFX | a confirmar | Pixabay Content | https://pixabay.com/sound-effects/maracatu-brazilian-traditional-rhythm-318907/ | "MARACATU (Brazilian traditional rhythm)" — perfeito para Fase 2; precisa loop em Audacity |
| `music/phase2_olinda.ogg` (alt) | candidate | Pixabay Music | a confirmar | Pixabay Content | https://pixabay.com/music/search/maracatu/ | Verificar opções adicionais |
| `music/phase3_recife_antigo.ogg` | candidate | Pixabay Music | a confirmar | Pixabay Content | https://pixabay.com/music/search/coco/ | Coco de roda, se faltar usar samba/forró |
| `music/phase4_capibaribe.ogg` | candidate | Free Music Archive | a confirmar | CC-BY ou CC0 | https://freemusicarchive.org/genre/Brazilian/ | Manguebeat-like; filtrar por instrumentais sombrios |
| `music/phase5_sertao.ogg` | candidate | Pixabay Music | a confirmar | Pixabay Content | https://pixabay.com/music/search/baiao/ | Baião pesado; alternativa: forró instrumental em https://pixabay.com/music/search/forro/ |
| `music/boss_generic.ogg` | candidate | Pixabay Music | a confirmar | Pixabay Content | https://pixabay.com/music/search/percussion/ | Percussivo intenso; também checar https://pixabay.com/music/search/tribal/ |
| `music/game_over.ogg` | candidate | FreePD / Chosic | a confirmar | CC0 | https://www.chosic.com/free-music/all/?sort=&attribution=no | "funeral march" curto + tag brasil/world |
| `music/victory.ogg` | candidate | Pixabay Music | a confirmar | Pixabay Content | https://pixabay.com/music/search/festive%20brazilian/ | Frevo festivo curto; corte 15-25s |

> **Realismo**: frevo instrumental CC raro. Plano B documentado em `REPORT_SOUND_DESIGNER.md` — se não encontrar nada decente, usar "brazilian percussive instrumental" genérico e marcar como placeholder até gravação própria ou contribuição comunitária.

---

## 2. SFX — pacotes-base recomendados

A estratégia mais eficiente é **adotar 2-3 pacotes CC0 grandes** e cobrir 70%+ dos SFX a partir deles, depois cobrir gaps com Freesound individual.

### Pacotes-base (baixar inteiros, escolher após)

| Pacote | Cobre | Fonte | Licença | Link |
|---|---|---|---|---|
| **Kenney Interface Sounds** | UI (select, confirm, cancel, pause, score milestone) | Kenney | CC0 | https://kenney.nl/assets/interface-sounds |
| **Kenney UI Audio** | UI alternativa, click/hover | Kenney | CC0 | https://kenney.nl/assets/ui-audio |
| **Kenney Impact Sounds** | Hits, impactos (player_hit, enemy_hit, boss_hit) | Kenney | CC0 | https://kenney.nl/assets/impact-sounds |
| **Kenney Sci-fi Sounds** | Tiros (player_fire), lasers (boss_laser_fire), explosões | Kenney | CC0 | https://kenney.nl/assets/sci-fi-sounds |
| **OpenGameArt — 100 CC0 SFX** | Mistos (gap-filler) | OpenGameArt | CC0 | https://opengameart.org/content/100-cc0-sfx |
| **OpenGameArt — 25 CC0 bang/firework** | Explosões pequenas/médias/grandes, fogo de artifício (pickup_fogo_triplo, smart_bomb_explode) | OpenGameArt | CC0 | https://opengameart.org/content/25-cc0-bang-firework-sfx |
| **OpenGameArt — 50 CC0 Sci-Fi SFX** | Power-ups, telegraphs, ring bursts | OpenGameArt | CC0 | https://opengameart.org/content/50-cc0-sci-fi-sfx |

> Após baixar, **registrar individualmente cada arquivo escolhido** na tabela §3 abaixo, mesmo sendo CC0 (cortesia + rastreabilidade).

### SFX específicos (Freesound CC0 — buscar direto)

| Arquivo destino | Status | Fonte | Query/link sugerido | Notas |
|---|---|---|---|---|
| `sfx/player_fire.ogg` | candidate | Freesound CC0 | https://freesound.org/search/?q=rooster+crow+short&f=license:%22Creative+Commons+0%22 | Cortar pra ~200ms + camada de "laser zap" Kenney sci-fi |
| `sfx/voc_*` (placeholders) | candidate | Freesound CC0 / TTS | https://freesound.org/search/?q=shout+brazilian&f=license:%22Creative+Commons+0%22 | Plano A: gravar (ver `VOCALIZES_RECORDING.md`) |
| `sfx/urubu_dive.ogg` | candidate | Freesound CC0 | https://freesound.org/search/?q=vulture+crow+caw&f=license:%22Creative+Commons+0%22 | Pitch shift -3 semitons p/ ficar grave |
| `sfx/passista_frevo_spawn.ogg` | candidate | Freesound CC0 | https://freesound.org/search/?q=whistle+samba&f=license:%22Creative+Commons+0%22 | Apito curto |
| `sfx/papafigo_attack.ogg` | candidate | Freesound CC0 | https://freesound.org/search/?q=squelch+gore+visceral&f=license:%22Creative+Commons+0%22 | Cuidado com excesso de gore — manter cômico |
| `sfx/comadre_cipo.ogg` | candidate | Freesound CC0 | https://freesound.org/search/?q=whip+vine+swoosh&f=license:%22Creative+Commons+0%22 | — |
| `sfx/bestafera_fire.ogg` | candidate | Freesound CC0 | https://freesound.org/search/?q=fire+roar+monster&f=license:%22Creative+Commons+0%22 | — |
| `sfx/checkpoint.ogg`, `sfx/score_milestone.ogg` | candidate | Kenney Interface | https://kenney.nl/assets/interface-sounds | Sino curto, fanfarra mini |
| `sfx/boss_appear.ogg` | candidate | Freesound CC0 + camada | https://freesound.org/search/?q=fanfare+horn+short&f=license:%22Creative+Commons+0%22 | Camada com sino + vocalize "OXE" para identidade |

---

## 3. Ambiência — candidatos

| Arquivo destino | Status | Fonte | Licença | Link | Notas |
|---|---|---|---|---|---|
| `ambience/amb_marco_zero_crowd.ogg` | candidate | Freesound CC0 | CC0 | https://freesound.org/search/?q=brazilian+street+festival&f=license:%22Creative+Commons+0%22 | Loop 20-30s, low-pass para ficar "longe" |
| `ambience/amb_capibaribe_water.ogg` | candidate | Freesound CC0 | CC0 | https://freesound.org/search/?q=river+water+gentle+loop&f=license:%22Creative+Commons+0%22 | Loop limpo |
| `ambience/amb_sertao_wind.ogg` | candidate | Freesound CC0 | CC0 | https://freesound.org/search/?q=desert+wind+dry+loop&f=license:%22Creative+Commons+0%22 | Loop, sem rajadas bruscas |

---

## 4. Tabela final por arquivo (preencher conforme instalado)

> Esta tabela é a única que precisa estar **completa antes de release**. Cada arquivo realmente instalado em `public/assets/` deve ter sua linha aqui.

| Arquivo | Fonte | Autor | Licença | Link original | Notas / pós-processamento |
|---|---|---|---|---|---|
| _(vazio — preencher conforme arquivos forem aprovados e commitados)_ | | | | | |

---

## 5. Procedimento de inclusão

Para **cada** áudio entrar em `public/assets/`:

1. Baixar do link CC0/CC-BY validado.
2. Processar em Audacity (trim, normalize, fade, export OGG).
3. Renomear seguindo `snake_case` da convenção de `SOUND_LIST.md`.
4. Mover para `public/assets/{sfx,music,ambience}/`.
5. **Adicionar linha na tabela §4** com fonte, autor, licença, link, notas.
6. Commit com mensagem `audio: add <arquivo> (<licença>)`.

Áudio sem entrada na tabela §4 = áudio que **não vai pro release**. CI/QA deve validar que todo arquivo em `public/assets/{sfx,music,ambience}/` tem linha aqui.

---

## 6. Créditos consolidados (para tela "QUEM FEZ ESSE TRAÇADO")

Quando preencher §4, consolidar os autores únicos aqui em formato pronto pra UI:

```
Áudio:
  Kenney (kenney.nl) — pacotes Interface, Impact, Sci-fi (CC0)
  OpenGameArt — vários autores (CC0) — ver docs/AUDIO_LICENSES.md
  Pixabay Music & Pixabay SFX — vários autores (Pixabay Content License)
  Free Music Archive — vários autores (CC-BY, ver docs/AUDIO_LICENSES.md)
  Freesound — vários autores (CC0)
  Vocalizes pernombucanos: <usuário> + amigos (gravações originais)
```
