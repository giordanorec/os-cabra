# Sound List — Os Cabra

> **Responsável**: Sound Designer. **Lê também**: Gameplay Developer.
> **Depende de**: `GDD.md` (§5, §6, §7), `UX_SPEC.md` (§6), `SOUND_SPEC.md` (§2-§3).

Inventário completo de áudio para v1. Cada item tem prioridade:
- **P0** — indispensável; sem isso o jogo soa mudo ou quebra game feel
- **P1** — importante; fortemente desejado pra polish e identidade
- **P2** — polish opcional; pode entrar em iterações posteriores

Total estimado: **~60 SFX + 9 músicas + 3 ambiências = 72 itens**.

---

## 1. Música (BGM)

Loops instrumentais, 60-120s cada, fade-in/out preparados em arquivo.

| # | Arquivo | Tipo | Descrição | Prioridade | Duração alvo |
|---|---|---|---|---|---|
| M01 | `menu_frevo.ogg` | Music | Frevo lento instrumental, atmosfera de menu | P0 | 60-90s loop |
| M02 | `phase1_marco_zero.ogg` | Music | Frevo médio animado, Fase 1 (Marco Zero) | P0 | 90-120s loop |
| M03 | `phase2_olinda.ogg` | Music | Maracatu nação percussivo, Fase 2 | P0 | 90-120s loop |
| M04 | `phase3_recife_antigo.ogg` | Music | Coco de roda + frevo, Fase 3 | P1 | 90-120s loop |
| M05 | `phase4_capibaribe.ogg` | Music | Manguebeat sombrio instrumental, Fase 4 | P1 | 90-120s loop |
| M06 | `phase5_sertao.ogg` | Music | Baião pesado/tenso, Fase 5 | P1 | 90-120s loop |
| M07 | `boss_generic.ogg` | Music | Remix percussivo intenso (boss universal v1) | P0 | 60-90s loop |
| M08 | `game_over.ogg` | Music | Frevo fúnebre, melancólico-cômico | P0 | 15-25s one-shot |
| M09 | `victory.ogg` | Music | Frevo festivo curto | P1 | 15-25s one-shot |

**Notas:**
- Em v1, **um único `boss_generic.ogg`** atende todos os bosses. Em v2, cada boss tem remix do tema da fase.
- Se faltar Fase 4/5, usar `boss_generic` ou repetir tema da Fase 3 como fallback.

---

## 2. SFX — Player

| # | Arquivo | Tipo | Descrição | Prioridade | Duração |
|---|---|---|---|---|---|
| S01 | `player_fire.ogg` | SFX | Tiro do galo, "cocoricó" curto + laser leve | P0 | 150-300ms |
| S02 | `player_hit.ogg` | SFX | "Oxe!" curto + impacto seco | P0 | 250-400ms |
| S03 | `player_die.ogg` | SFX | "Aí, viu" lamentado + queda/explosão | P0 | 600-900ms |
| S04 | `player_respawn.ogg` | SFX | Triunfal curto, sino + galo | P1 | 400-700ms |
| S05 | `player_move.ogg` | SFX | Whoosh sutil de asa (loop curto on movement) | P2 | 200-400ms |
| S06 | `player_invuln_loop.ogg` | SFX | Tique sutil de invulnerabilidade pós-dano (1.5s) | P2 | 100ms loop |

---

## 3. SFX — Inimigos genéricos

| # | Arquivo | Tipo | Descrição | Prioridade | Duração |
|---|---|---|---|---|---|
| S10 | `enemy_hit.ogg` | SFX | Hit genérico (tint sound), curto | P0 | 80-150ms |
| S11 | `enemy_explode_small.ogg` | SFX | Explosão pequena (Passista, Caboclinho, Urubu, Mosca) | P0 | 300-500ms |
| S12 | `enemy_explode_medium.ogg` | SFX | Explosão média (Mamulengo, Comadre Fulozinha) | P0 | 400-700ms |
| S13 | `enemy_explode_large.ogg` | SFX | Explosão grande (Caboclo de Lança, Papa-Figo, Besta-Fera) | P0 | 600-1000ms |
| S14 | `enemy_shoot_generic.ogg` | SFX | Disparo genérico de inimigo (fallback) | P0 | 120-250ms |

---

## 4. SFX — Inimigos específicos

| # | Arquivo | Tipo | Descrição | Prioridade | Duração |
|---|---|---|---|---|---|
| S20 | `passista_frevo_spawn.ogg` | SFX | Apito de frevo curto ao entrar | P1 | 200-400ms |
| S21 | `passista_bomb_drop.ogg` | SFX | Sopro/whoosh da bombinha caindo | P1 | 200-300ms |
| S22 | `caboclinho_spawn.ogg` | SFX | "Ô rumbora!" curto vocal | P1 | 300-500ms |
| S23 | `caboclinho_arrow.ogg` | SFX | Whoosh de flecha rápida | P1 | 150-300ms |
| S24 | `mamulengo_head_shoot.ogg` | SFX | Cabeça-projétil "tlec" + voo | P1 | 200-400ms |
| S25 | `caboclo_lanca_throw.ogg` | SFX | Telegrama brilho 300ms + lança whoosh | P2 | 500-700ms |
| S26 | `urubu_dive.ogg` | SFX | Crocito descendo grave | P1 | 400-700ms |
| S27 | `papafigo_attack.ogg` | SFX | Som visceral, líquido pulsante | P1 | 400-600ms |
| S28 | `comadre_cipo.ogg` | SFX | Cipó serpenteando, chicote lento | P2 | 400-700ms |
| S29 | `bestafera_fire.ogg` | SFX | Rugido de fogo grave | P1 | 500-800ms |
| S30 | `mosca_swarm_loop.ogg` | SFX | Zumbido enxame loop curto | P2 | 1-2s loop |

---

## 5. SFX — Bosses

| # | Arquivo | Tipo | Descrição | Prioridade | Duração |
|---|---|---|---|---|---|
| S40 | `boss_appear.ogg` | SFX | Fanfarra + sino + vocalize grave | P0 | 1.5-2.5s |
| S41 | `boss_hit.ogg` | SFX | Impacto pesado, mais rico que enemy_hit | P0 | 200-350ms |
| S42 | `boss_phase_change.ogg` | SFX | "AAH" dramático + flash sonoro grave | P0 | 800-1200ms |
| S43 | `boss_defeat.ogg` | SFX | Explosão longa + reverb + cheer curto | P0 | 1.5-2.5s |
| S44 | `boss_telegraph_warn.ogg` | SFX | Aviso grave de varredura/laser (~500ms antes) | P1 | 400-600ms |
| S45 | `boss_laser_fire.ogg` | SFX | Laser pesado (Homem da Meia-Noite, Coronel) | P1 | 400-700ms |
| S46 | `boss_ring_burst.ogg` | SFX | Disparo radial (Homem da Meia-Noite) | P1 | 300-500ms |
| S47 | `boss_galo_cocorico.ogg` | SFX | Cacarejo distorcido grande (Galo Maligno) | P1 | 700-1200ms |

---

## 6. SFX — Power-ups

| # | Arquivo | Tipo | Descrição | Prioridade | Duração |
|---|---|---|---|---|---|
| S50 | `pickup_generic.ogg` | SFX | Triunfal genérico, sino curto | P0 | 300-500ms |
| S51 | `pickup_fogo_triplo.ogg` | SFX | Estalo de fogo de artifício | P1 | 400-700ms |
| S52 | `pickup_sombrinha.ogg` | SFX | Whoosh + tilintar (sombrinha-escudo) | P1 | 400-600ms |
| S53 | `pickup_cachaca.ogg` | SFX | "Glub" curto + risadinha | P1 | 400-700ms |
| S54 | `pickup_tapioca.ogg` | SFX | Sino festivo (1-up raro) | P1 | 500-800ms |
| S55 | `pickup_baque_virado.ogg` | SFX | Tambor curto + chamada | P1 | 500-800ms |
| S56 | `smart_bomb_explode.ogg` | SFX | Explosão grande + reverb (cachaça smart bomb) | P0 | 800-1500ms |
| S57 | `shield_break.ogg` | SFX | Vidro/sombrinha quebrando (sombrinha consome hit) | P1 | 300-500ms |
| S58 | `powerup_expire.ogg` | SFX | Aviso curto de power-up acabando | P2 | 200-400ms |

---

## 7. SFX — UI / Menu / Eventos

| # | Arquivo | Tipo | Descrição | Prioridade | Duração |
|---|---|---|---|---|---|
| S60 | `ui_select.ogg` | SFX | Movimentação no menu (curto, seco) | P0 | 80-150ms |
| S61 | `ui_confirm.ogg` | SFX | Enter satisfatório | P0 | 200-350ms |
| S62 | `ui_cancel.ogg` | SFX | ESC, "back" | P0 | 150-250ms |
| S63 | `pause_in.ogg` | SFX | Entrar na pausa (whoosh + zoom) | P0 | 250-400ms |
| S64 | `pause_out.ogg` | SFX | Sair da pausa | P0 | 250-400ms |
| S65 | `score_milestone.ogg` | SFX | Sino curto a cada 10k pontos | P1 | 300-500ms |
| S66 | `checkpoint.ogg` | SFX | Pequena fanfarra de checkpoint | P1 | 500-900ms |
| S67 | `chain_multiplier.ogg` | SFX | Sino agudo ao ativar ×1.5 | P2 | 200-400ms |
| S68 | `wave_clear.ogg` | SFX | Pequeno cheer entre ondas | P2 | 300-500ms |
| S69 | `phase_intro.ogg` | SFX | Drum hit + reverb pra abrir letreiro de fase | P1 | 400-700ms |

---

## 8. Vocalizes pernambucanos

Idealmente gravados pelo usuário (ver `VOCALIZES_RECORDING.md`). Caso contrário, TTS distorcido como placeholder.

| # | Arquivo | Tipo | Descrição | Prioridade | Duração |
|---|---|---|---|---|---|
| V01 | `voc_oxe.ogg` | Vocalize | "OXE!" surpreso (boss appear, dano) | P0 | 400-700ms |
| V02 | `voc_egua.ogg` | Vocalize | "ÉGUA!" alegre (power-up, milestone) | P0 | 400-700ms |
| V03 | `voc_arretado.ogg` | Vocalize | "ARRETADO!" (power-up forte) | P0 | 500-900ms |
| V04 | `voc_visse.ogg` | Vocalize | "VISSE?!" (chain multiplier) | P1 | 400-600ms |
| V05 | `voc_ai_viu.ogg` | Vocalize | "AÍ, VIU?!" lamentado (perdeu vida) | P0 | 600-900ms |
| V06 | `voc_se_lascou.ogg` | Vocalize | "SE LASCOU!" (game over) | P1 | 700-1100ms |
| V07 | `voc_pai_degua.ogg` | Vocalize | "PAI D'ÉGUA!" (ready / vitória) | P1 | 600-900ms |
| V08 | `voc_bora.ogg` | Vocalize | "BORA!" (continuar, retomada) | P2 | 400-600ms |
| V09 | `voc_ta_com_tudo.ogg` | Vocalize | "TÁ COM TUDO!" (1-up) | P2 | 600-900ms |

> **Importante**: vocalizes têm impacto desproporcional na identidade. P0 mesmo placeholder TTS é melhor que silêncio.

---

## 9. Ambiência (loops baixos)

| # | Arquivo | Tipo | Descrição | Prioridade | Duração |
|---|---|---|---|---|---|
| A01 | `amb_marco_zero_crowd.ogg` | Ambience | Festa/multidão distante, Fase 1 | P2 | 20-30s loop |
| A02 | `amb_capibaribe_water.ogg` | Ambience | Água/ondas suaves, Fase 4 | P1 | 20-30s loop |
| A03 | `amb_sertao_wind.ogg` | Ambience | Vento seco, Fase 5 | P1 | 20-30s loop |

---

## 10. Resumo por prioridade

| Prioridade | Música | SFX | Vocalize | Ambience | Total |
|---|---|---|---|---|---|
| **P0** | 5 | 21 | 4 | 0 | **30** |
| **P1** | 4 | 24 | 3 | 2 | **33** |
| **P2** | 0 | 9 | 2 | 1 | **12** |
| **Total** | **9** | **54** | **9** | **3** | **75** |

**Mínimo viável (P0 only)**: 30 itens — jogo joga, soa coerente, identidade preservada.
**Build polido (P0 + P1)**: 63 itens — meta realista para v1 final.

---

## 11. Mapeamento eventos → SFX (referência rápida)

Tabela cruzada para o Gameplay Dev. Eventos já listados em `UX_SPEC.md §6`.

| Evento (UX) | SFX(s) |
|---|---|
| Player atira | `player_fire` |
| Inimigo atingido | `enemy_hit` |
| Inimigo morre (small) | `enemy_explode_small` |
| Inimigo morre (medium) | `enemy_explode_medium` |
| Inimigo morre (large) | `enemy_explode_large` |
| Boss atingido | `boss_hit` |
| Player leva dano | `player_hit` + `voc_ai_viu` |
| Power-up pego (genérico) | `pickup_generic` + vocalize aleatório (`voc_arretado`/`voc_visse`/`voc_egua`) |
| Power-up específico | `pickup_<tipo>` |
| Smart bomb usada | `smart_bomb_explode` |
| Sombrinha consome hit | `shield_break` |
| Power-up expirando | `powerup_expire` |
| Checkpoint | `checkpoint` |
| Boss aparece | `boss_appear` + `voc_oxe` |
| Boss muda fase | `boss_phase_change` |
| Boss derrotado | `boss_defeat` |
| Score milestone (10k) | `score_milestone` + `voc_egua` |
| Chain ×1.5 | `chain_multiplier` + `voc_visse` |
| Onda limpa | `wave_clear` |
| Pausa entra | `pause_in` |
| Pausa sai | `pause_out` |
| Menu navega | `ui_select` |
| Menu confirma | `ui_confirm` |
| Menu volta/cancela | `ui_cancel` |
| Game Over | `voc_se_lascou` (música `game_over` toma o lugar) |
| Vitória final | `voc_pai_degua` (música `victory`) |

---

## 12. Open questions

- [ ] Player_move (S05) e mosca_swarm_loop (S30) valem o esforço de implementar loops com cleanup? Decisão do Gameplay Dev se dá problema.
- [ ] Vocalizes randomizados em pickup — pool de 3 ou só um fixo? Pool dá variedade mas pode soar inconsistente.
- [ ] Boss específico de cada fase tem cocorocó próprio (S47 só do galo) ou todo boss usa `boss_appear`? Em v1, todos usam `boss_appear`.
