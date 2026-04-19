# Sound Spec — Os Cabra

> **Responsável**: Sound Designer. **Lê também**: Gameplay Developer, UI/UX.
> **Depende de**: `GDD.md`, `UX_SPEC.md`.

## 1. Filosofia

Som pernambucano sem virar karaokê. A música é ambiente e rítmica, não melódica a ponto de competir com gameplay. SFX são claros, punchy, com sabor local onde couber (ex: tiro do Galo tem um "cocoricó" sutil).

## 2. Música (BGM)

Uma faixa por contexto. Instrumentais preferencialmente (vocais ficam cansativos em loop).

| Contexto | Estilo | Referência |
|---|---|---|
| Menu | Frevo lento, instrumental, chamativo mas sem pressa | Frevo instrumental clássico (Spok, Duda) |
| Fase 1 (Marco Zero) | Frevo médio animado | Frevo instrumental |
| Fase 2 (Olinda) | Maracatu nação, percussivo | Nação Pernambuco, Estrela Brilhante |
| Fase 3 (Recife Antigo) | Coco de roda + frevo misturado | Coco gravado por DJ Dolores |
| Fase 4 (Capibaribe) | Manguebeat, mais sombrio | Chico Science (early) em ritmo instrumental |
| Fase 5 (Sertão/Final) | Baião pesado, tensão | Sivuca, Luiz Gonzaga instrumental |
| Boss genérico | Remix percussivo intenso do tema da fase | — |
| Game Over | Frevo fúnebre lento, melancólico-cômico | — |
| Vitória | Frevo festivo cheio | — |

## 3. SFX — inventário

### Player
- `player_move` — sutil, talvez só whoosh de asa
- `player_fire` — "cocoricó" curto + laser/tiro leve
- `player_hit` — "oxe" curto do galo + impacto
- `player_die` — "AÍ, VIU" lamentado + queda
- `player_respawn` — triunfal curto

### Inimigos
- Um SFX genérico `enemy_hit` (tint sound)
- Um SFX genérico `enemy_explode` (levar diferenciação por tamanho, 3 variantes: pequeno/médio/grande)
- SFX específicos para padrões-chave:
  - `passista_frevo_spawn` — apito de frevo
  - `caboclinho_spawn` — "ô rumbora" curto
  - `papafigo_attack` — som visceral
  - `urubu_dive` — crocito descendo
  - `bestafera_fire` — rugido de fogo

### Bosses
- `boss_appear` — fanfarra + sino + vocalize grave
- `boss_hit` — impacto grande
- `boss_phase_change` — "AAH" dramático + flash sonoro
- `boss_defeat` — explosão longa + reverb + cheer curto

### UI
- `ui_select` — movimentação no menu
- `ui_confirm` — "enter" satisfatório
- `ui_cancel` — "ESC"
- `pause_in` / `pause_out`
- `score_milestone` — sino curto a cada 10k pontos
- `checkpoint` — pequena fanfarra

### Power-ups
- Um SFX por power-up (5 total), 1-2s, triunfal e reconhecível

### Ambiente
- Ondas/mar na Fase 4 (loop baixo)
- Crowd/festa distante na Fase 1 (loop baixo)
- Vento no sertão na Fase 5 (loop baixo)

## 4. Fontes — onde buscar (CC0 / CC-BY)

### Música
- **Free Music Archive (FMA)** — buscar "frevo", "maracatu", "coco", "brazilian folk"
- **ccMixter** — remixes CC
- **Jamendo** — cuidado com licenças (alguns são non-commercial)
- **YouTube Audio Library** — limitado em estilos nordestinos mas alguns existem
- **Kevin MacLeod / Incompetech** — se não achar nada regional, tem tracks "world" que servem como placeholder
- **Pixabay Music** — muitos tracks royalty-free, alguns latino/brasileiros
- **Cantinho do Forró (YouTube)** — alguns artistas disponibilizam instrumentais CC

> **Atenção**: verificar licença de cada faixa antes de commitar ao repo. Preferir CC0 > CC-BY > CC-BY-SA.

### SFX
- **Freesound.org** — monstro do SFX, filtro por licença CC0
- **Kenney Audio Packs** — CC0, muito SFX limpo
- **Zapsplat** — free com atribuição (requer conta)
- **OpenGameArt audio section** — CC0 e CC-BY

### Vocalizes pernambucanos
- **Pode gravar localmente** — você ou um amigo grita "OXE", "ÉGUA", "ARRETADO" no celular. Processo: Audacity, trim, normalize, adicionar leve reverb/filter
- **Alternativa**: usar TTS com sotaque neutro e distorcer

## 5. Mixagem

- **Music**: -18 LUFS (baixo, para SFX se sobressair)
- **SFX loud** (player fire, enemy explode): -8 a -12 LUFS
- **SFX UI**: -14 LUFS
- **Vocalizes**: -10 LUFS com leve compressão

Phaser 4: `this.sound.add('key', { volume: 0.7 })` — manter volumes relativos em config.

## 6. Implementação técnica

```ts
// src/systems/AudioManager.ts — interface central
audioManager.playSfx('player_fire');
audioManager.playMusic('phase1', { loop: true, fade: 500 });
audioManager.crossfadeMusic('boss1', 800);
audioManager.setMusicVolume(0.5); // usuário
```

Formatos:
- **OGG** (principal) + **MP3** (fallback Safari antigo)
- Música: 128 kbps OGG (já é suficiente pra loop)
- SFX: 96-128 kbps OGG

Nomes de arquivo: `snake_case`, categoria prefixada. Ex:
```
public/assets/sfx/player_fire.ogg
public/assets/sfx/enemy_explode_small.ogg
public/assets/music/phase1_frevo.ogg
```

## 7. Entregáveis do Sound Designer

1. **Sound list** — CSV ou tabela com todos os SFX e músicas precisando, com prioridade P0/P1/P2
2. **Licença docs** — arquivo `docs/AUDIO_LICENSES.md` listando fonte, autor, licença, link original de cada áudio usado
3. **Assets prontos** — arquivos OGG na estrutura de pastas acima
4. **Recomendações de mixagem** — volumes relativos sugeridos em JSON que o dev usa no AudioManager

## 8. Open questions

- [ ] Conseguimos pelo menos 1 faixa de frevo instrumental CC0/CC-BY de qualidade decente? Se não, trocar direção de música?
- [ ] Gravar vocalizes pernambucanos do usuário ou colegas é OK? (decisão dele)
- [ ] Fade musical entre fases ou corte seco? (game feel)
