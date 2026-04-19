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

## 4. Tabela final por arquivo (instalados em v1)

> Esta tabela é a única que precisa estar **completa antes de release**. Cada arquivo realmente instalado em `public/assets/` deve ter sua linha aqui.

**Status v1**: 72 arquivos instalados — 60 SFX (incl. 9 vocalizes), 9 música, 3 ambiência. Total ~9.4 MB.
- 70 arquivos **CC0 puro** (Kenney + OpenGameArt + síntese própria)
- 1 arquivo **CC-BY 4.0** (`music/victory.ogg` — Of Far Different Nature, requer atribuição na tela de créditos)
- 9 vocalizes via **eSpeak NG TTS** — saída de TTS não é protegida por copyright; o software eSpeak NG é GPLv3 mas isso não afeta a saída

| Arquivo | Fonte / Pack | Licença | Link original | Notas / pós-processamento |
|---|---|---|---|---|
| `ambience/amb_capibaribe_water.ogg` | Synthesized via ffmpeg (brown noise + tremolo + lowpass) | CC0 (síntese própria) | (N/A — sintetizado em-build via ffmpeg) | ffmpeg anoisesrc |
| `ambience/amb_marco_zero_crowd.ogg` | Synthesized via ffmpeg (pink noise + bandpass + multi-tremolo + reverb) | CC0 (síntese própria) | (N/A — sintetizado em-build via ffmpeg) | ffmpeg anoisesrc |
| `ambience/amb_sertao_wind.ogg` | Synthesized via ffmpeg (pink noise + bandpass + tremolo) | CC0 (síntese própria) | (N/A — sintetizado em-build via ffmpeg) | ffmpeg anoisesrc |
| `sfx/bestafera_fire.ogg` | Kenney Sci-fi Sounds | CC0 | https://kenney.nl/assets/sci-fi-sounds | spaceEngine_001.ogg + slowdown + reverb |
| `sfx/boss_appear.ogg` | Kenney Music Jingles | CC0 | https://kenney.nl/assets/music-jingles | jingles_HIT05.ogg + reverb |
| `sfx/boss_coronel_laser.ogg` | Kenney Sci-fi Sounds | CC0 | https://kenney.nl/assets/sci-fi-sounds | laserLarge_004.ogg + slowdown + reverb |
| `sfx/boss_coronel_pergaminho.ogg` | Kenney Digital Audio | CC0 | https://kenney.nl/assets/digital-audio | spaceTrash3.ogg + slowdown |
| `sfx/boss_defeat.ogg` | Kenney Sci-fi Sounds | CC0 | https://kenney.nl/assets/sci-fi-sounds | explosionCrunch_004.ogg + multi-tap reverb |
| `sfx/boss_galo_cocorico.ogg` | Kenney Sci-fi Sounds | CC0 | https://kenney.nl/assets/sci-fi-sounds | spaceEngineLarge_002.ogg + slowdown + reverb |
| `music/boss_generic.ogg` | Cleyton R — Intense Boss Battle | CC0 | https://opengameart.org/content/intense-boss-battle | trim 90s + highpass + loudnorm |
| `sfx/boss_hit.ogg` | Kenney Impact Sounds | CC0 | https://kenney.nl/assets/impact-sounds | impactPlate_heavy_002.ogg |
| `sfx/boss_iara_water_attack.ogg` | Kenney Sci-fi Sounds | CC0 | https://kenney.nl/assets/sci-fi-sounds | slime_000.ogg + slowdown + reverb |
| `sfx/boss_laser_fire.ogg` | Kenney Sci-fi Sounds | CC0 | https://kenney.nl/assets/sci-fi-sounds | laserLarge_002.ogg |
| `sfx/boss_phase_change.ogg` | Kenney Music Jingles | CC0 | https://kenney.nl/assets/music-jingles | jingles_HIT09.ogg + slowdown + reverb |
| `sfx/boss_ring_burst.ogg` | Kenney Digital Audio | CC0 | https://kenney.nl/assets/digital-audio | zapTwoTone.ogg |
| `sfx/boss_telegraph_warn.ogg` | Kenney Digital Audio | CC0 | https://kenney.nl/assets/digital-audio | lowDown.ogg |
| `sfx/caboclinho_arrow.ogg` | Kenney Digital Audio | CC0 | https://kenney.nl/assets/digital-audio | laser1.ogg + pitch up |
| `sfx/caboclinho_spawn.ogg` | Kenney Music Jingles | CC0 | https://kenney.nl/assets/music-jingles | jingles_PIZZI03.ogg + trim + slight pitch up |
| `sfx/caboclo_lanca_throw.ogg` | Kenney Sci-fi Sounds | CC0 | https://kenney.nl/assets/sci-fi-sounds | thrusterFire_002.ogg + slowdown |
| `sfx/chain_multiplier.ogg` | Kenney Digital Audio | CC0 | https://kenney.nl/assets/digital-audio | threeTone1.ogg + pitch up |
| `sfx/checkpoint.ogg` | Kenney Music Jingles | CC0 | https://kenney.nl/assets/music-jingles | jingles_PIZZI05.ogg + trim |
| `sfx/comadre_cipo.ogg` | Kenney Sci-fi Sounds | CC0 | https://kenney.nl/assets/sci-fi-sounds | forceField_001.ogg + slight slowdown |
| `sfx/enemy_explode_large.ogg` | Kenney Sci-fi Sounds | CC0 | https://kenney.nl/assets/sci-fi-sounds | lowFrequency_explosion_001.ogg |
| `sfx/enemy_explode_medium.ogg` | Kenney Sci-fi Sounds | CC0 | https://kenney.nl/assets/sci-fi-sounds | explosionCrunch_002.ogg |
| `sfx/enemy_explode_small.ogg` | Kenney Sci-fi Sounds | CC0 | https://kenney.nl/assets/sci-fi-sounds | explosionCrunch_000.ogg |
| `sfx/enemy_hit.ogg` | Kenney Impact Sounds | CC0 | https://kenney.nl/assets/impact-sounds | impactGeneric_light_000.ogg |
| `sfx/enemy_shoot_generic.ogg` | Kenney Digital Audio | CC0 | https://kenney.nl/assets/digital-audio | laser5.ogg |
| `music/game_over.ogg` | yd — Sad Game Over | CC0 | https://opengameart.org/content/sad-game-over | trim 18s + loudnorm |
| `sfx/mamulengo_head_shoot.ogg` | Kenney Digital Audio | CC0 | https://kenney.nl/assets/digital-audio | twoTone1.ogg |
| `music/menu_frevo.ogg` | Of Far Different Nature — Urban Boss Battle | CC0 | https://opengameart.org/content/urban-boss-battle | trim 70s + slowdown 0.85x + lowpass (menu jazz vibe) |
| `sfx/mosca_swarm_loop.ogg` | Kenney Sci-fi Sounds | CC0 | https://kenney.nl/assets/sci-fi-sounds | spaceEngineSmall_001.ogg + trim 1.5s + pitch up |
| `sfx/papafigo_attack.ogg` | Kenney Impact Sounds | CC0 | https://kenney.nl/assets/impact-sounds | impactSoft_heavy_002.ogg + slowdown + reverb |
| `sfx/passista_bomb_drop.ogg` | Kenney Digital Audio | CC0 | https://kenney.nl/assets/digital-audio | spaceTrash2.ogg + slowdown |
| `sfx/passista_frevo_spawn.ogg` | Kenney Music Jingles | CC0 | https://kenney.nl/assets/music-jingles | jingles_SAX01.ogg + trim 0.45s + pitch up (apito de frevo) |
| `sfx/pause_in.ogg` | Kenney Sci-fi Sounds | CC0 | https://kenney.nl/assets/sci-fi-sounds | forceField_002.ogg + slowdown |
| `sfx/pause_out.ogg` | Kenney Sci-fi Sounds | CC0 | https://kenney.nl/assets/sci-fi-sounds | forceField_002.ogg + reverse + pitch up |
| `music/phase1_marco_zero.ogg` | Of Far Different Nature — Urban Boss Battle | CC0 | https://opengameart.org/content/urban-boss-battle | trim 90s offset 10s + highpass (sax-brass = frevo-adjacent) |
| `music/phase2_olinda.ogg` | Phlosioneer — Prehistoric Drum Loop **+** Of Far Different Nature — Tribal | CC0 | https://opengameart.org/content/prehistoric-drum-loop + https://opengameart.org/content/tribal | drum loop x15 (85s) layered with tribal lowpass (maracatu vibe) |
| `music/phase3_recife_antigo.ogg` | Of Far Different Nature — Tribal | CC0 | https://opengameart.org/content/tribal | trim 90s + highpass (festive/chill) |
| `music/phase4_capibaribe.ogg` | Cleyton R — Intense Boss Battle | CC0 | https://opengameart.org/content/intense-boss-battle | trim 90s + slowdown 0.9x + lowpass + reverb (manguebeat sombrio) |
| `music/phase5_sertao.ogg` | Of Far Different Nature — Tribal | CC0 | https://opengameart.org/content/tribal | trim 90s offset 90s + slowdown + multi-tap reverb (atmospheric) |
| `sfx/phase_intro.ogg` | Kenney Music Jingles | CC0 | https://kenney.nl/assets/music-jingles | jingles_HIT04.ogg + trim 0.6s + reverb |
| `sfx/pickup_baque_virado.ogg` | Kenney Music Jingles | CC0 | https://kenney.nl/assets/music-jingles | jingles_HIT11.ogg + slight pitch down |
| `sfx/pickup_cachaca.ogg` | Kenney Digital Audio | CC0 | https://kenney.nl/assets/digital-audio | pepSound1.ogg + slight pitch down |
| `sfx/pickup_fogo_triplo.ogg` | Kenney Digital Audio | CC0 | https://kenney.nl/assets/digital-audio | powerUp2.ogg |
| `sfx/pickup_generic.ogg` | Kenney Digital Audio | CC0 | https://kenney.nl/assets/digital-audio | powerUp1.ogg |
| `sfx/pickup_sombrinha.ogg` | Kenney Digital Audio | CC0 | https://kenney.nl/assets/digital-audio | powerUp4.ogg |
| `sfx/pickup_tapioca.ogg` | Kenney Music Jingles | CC0 | https://kenney.nl/assets/music-jingles | jingles_PIZZI13.ogg + trim 0.8s |
| `sfx/player_die.ogg` | Kenney Sci-fi Sounds | CC0 | https://kenney.nl/assets/sci-fi-sounds | lowFrequency_explosion_000.ogg |
| `sfx/player_fire.ogg` | Kenney Sci-fi Sounds | CC0 | https://kenney.nl/assets/sci-fi-sounds | laserSmall_001.ogg + highpass |
| `sfx/player_hit.ogg` | Kenney Impact Sounds | CC0 | https://kenney.nl/assets/impact-sounds | impactPunch_medium_002.ogg |
| `sfx/player_invuln_loop.ogg` | Kenney Digital Audio | CC0 | https://kenney.nl/assets/digital-audio | tone1.ogg + trim 0.15s (loopable tick) |
| `sfx/player_respawn.ogg` | Kenney Digital Audio | CC0 | https://kenney.nl/assets/digital-audio | powerUp7.ogg |
| `sfx/powerup_expire.ogg` | Kenney Interface Sounds | CC0 | https://kenney.nl/assets/interface-sounds | tick_002.ogg |
| `sfx/score_milestone.ogg` | Kenney Impact Sounds | CC0 | https://kenney.nl/assets/impact-sounds | impactBell_heavy_000.ogg + trim 0.5s |
| `sfx/shield_break.ogg` | Kenney Interface Sounds | CC0 | https://kenney.nl/assets/interface-sounds | glass_001.ogg |
| `sfx/smart_bomb_explode.ogg` | Kenney Sci-fi Sounds | CC0 | https://kenney.nl/assets/sci-fi-sounds | lowFrequency_explosion_001.ogg + multi-tap reverb |
| `sfx/ui_cancel.ogg` | Kenney Interface Sounds | CC0 | https://kenney.nl/assets/interface-sounds | back_001.ogg |
| `sfx/ui_confirm.ogg` | Kenney Interface Sounds | CC0 | https://kenney.nl/assets/interface-sounds | confirmation_002.ogg |
| `sfx/ui_select.ogg` | Kenney UI Audio | CC0 | https://kenney.nl/assets/ui-audio | click1.ogg |
| `sfx/urubu_dive.ogg` | Kenney Sci-fi Sounds | CC0 | https://kenney.nl/assets/sci-fi-sounds | spaceEngineLow_000.ogg + reverse-pitch-reverse trick (caw-like) |
| `music/victory.ogg` | Of Far Different Nature — Victory Party | **CC-BY 4.0** | https://opengameart.org/content/victory-party | trim 25s + loudnorm. ⚠️ Atribuir: "Of Far Different Nature" |
| `sfx/voc_ai_viu.ogg` | eSpeak NG (pt-br) + ffmpeg | TTS sem copyright | https://github.com/espeak-ng/espeak-ng | TTS "ai, viu?!" + pitch + reverb + loudnorm |
| `sfx/voc_arretado.ogg` | eSpeak NG (pt-br) + ffmpeg | TTS sem copyright | https://github.com/espeak-ng/espeak-ng | TTS "arretadôô!" + pitch + reverb + loudnorm |
| `sfx/voc_bora.ogg` | eSpeak NG (pt-br) + ffmpeg | TTS sem copyright | https://github.com/espeak-ng/espeak-ng | TTS "bôraa!" + pitch + reverb + loudnorm |
| `sfx/voc_egua.ogg` | eSpeak NG (pt-br) + ffmpeg | TTS sem copyright | https://github.com/espeak-ng/espeak-ng | TTS "êêgua!" + pitch + reverb + loudnorm |
| `sfx/voc_oxe.ogg` | eSpeak NG (pt-br) + ffmpeg | TTS sem copyright | https://github.com/espeak-ng/espeak-ng | TTS "oxêêh!" + pitch + reverb + loudnorm |
| `sfx/voc_pai_degua.ogg` | eSpeak NG (pt-br) + ffmpeg | TTS sem copyright | https://github.com/espeak-ng/espeak-ng | TTS "pai d'éguah!" + pitch + reverb + loudnorm |
| `sfx/voc_se_lascou.ogg` | eSpeak NG (pt-br) + ffmpeg | TTS sem copyright | https://github.com/espeak-ng/espeak-ng | TTS "se lascôô!" + pitch + reverb + loudnorm |
| `sfx/voc_ta_com_tudo.ogg` | eSpeak NG (pt-br) + ffmpeg | TTS sem copyright | https://github.com/espeak-ng/espeak-ng | TTS "tá com tudooo!" + pitch + reverb + loudnorm |
| `sfx/voc_visse.ogg` | eSpeak NG (pt-br) + ffmpeg | TTS sem copyright | https://github.com/espeak-ng/espeak-ng | TTS "vissêê?!" + pitch + reverb + loudnorm |
| `sfx/wave_clear.ogg` | Kenney Music Jingles | CC0 | https://kenney.nl/assets/music-jingles | jingles_PIZZI07.ogg + trim 0.5s |

---

## 5. Procedimento de inclusão (pipeline automatizado v1)

A v1 foi construída com pipeline **totalmente reproduzível** via shell + ffmpeg + espeak-ng — sem GUI, sem Audacity, sem fricção humana. Os scripts vivem em `/tmp/audio_acquisition/build_*.sh` durante o build (não commitados, intencional — são receitas, não código de produto). Para reconstruir do zero:

```bash
# Pré-requisitos: ffmpeg 5+, curl, unzip, espeak (pt-br data)
# 1) Baixar packs Kenney CC0 (Interface, Impact, Sci-fi, UI, Music Jingles, Digital, Voiceover)
# 2) Baixar OGA tracks: tribal.mp3, urban_boss_battle.ogg, intense_boss_battle.mp3,
#    sad_game_over.wav, victory_party.mp3, prehistoric_drum.wav
# 3) Rodar build_sfx.sh   → 51 SFX em public/assets/sfx/
# 4) Rodar build_voc.sh   → 9 vocalizes em public/assets/sfx/
# 5) Rodar build_music.sh → 9 músicas em public/assets/music/
# 6) Rodar build_ambience.sh → 3 ambiências sintetizadas em public/assets/ambience/
```

**Convenções de processamento** (ffmpeg):
- Encoder: `-c:a vorbis -strict -2 -q:a 3` (~96kbps stereo) — 100% nativo, sem libvorbis
- Stereo 44.1 kHz (vorbis nativo só suporta stereo)
- Loudness alvo via `loudnorm=I=<lufs>:TP=-1.5:LRA=11` (single-pass, "good enough")
- Fade in 20ms (SFX) / 1.0s (music); fade out proporcional
- LC_ALL=C no ambiente — evita awk gerar `0,1` em vez de `0.1` por causa do locale pt_BR

**Para adicionar um novo arquivo manualmente**:
1. Baixar do link CC0/CC-BY validado.
2. Processar com ffmpeg seguindo as convenções acima.
3. Nomear em `snake_case` conforme `SOUND_LIST.md`.
4. Salvar em `public/assets/{sfx,music,ambience}/`.
5. **Adicionar linha na tabela §4**.
6. Commit `audio: add <arquivo> (<licença>)`.

Áudio sem entrada na tabela §4 = áudio que **não vai pro release**. CI/QA pode validar com:
```bash
diff <(ls public/assets/{sfx,music,ambience}/*.ogg | xargs -n1 basename | sort) \
     <(grep -oE '`(sfx|music|ambience)/[^`]+\.ogg`' docs/AUDIO_LICENSES.md | tr -d '`' | xargs -n1 basename | sort)
```

---

## 6. Créditos consolidados (para tela "QUEM FEZ ESSE TRAÇADO")

Texto pronto pra colar na tela de créditos:

```
ÁUDIO

Efeitos Sonoros (CC0)
  Kenney.nl — pacotes Interface, Impact, Sci-fi, UI, Digital, Music Jingles
  https://kenney.nl

Música (CC0)
  Of Far Different Nature — "Tribal", "Urban Boss Battle"
  Cleyton R — "Intense Boss Battle"
  yd — "Sad Game Over"
  Phlosioneer — "Prehistoric Drum Loop"
  Todos via opengameart.org

Música (CC-BY 4.0)
  Of Far Different Nature — "Victory Party"
  https://opengameart.org/content/victory-party

Vocalizes (TTS)
  eSpeak NG (pt-br) com pós-processamento ffmpeg
  https://github.com/espeak-ng/espeak-ng

Ambiência
  Sintetizada via ffmpeg (anoisesrc + filtros)
```

> Versão markdown / JSON para a tela: gerar em `src/data/audio_credits.ts` quando UI for implementada.
