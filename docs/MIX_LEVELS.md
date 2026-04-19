# Mix Levels — Os Cabra

> **Responsável**: Sound Designer. **Lê também**: Gameplay Developer.
> **Pareado com**: `public/assets/audio_config.json` (consumido em runtime pelo `AudioManager`).

## 1. Filosofia de mixagem

- **Música nunca compete com SFX** — música é cama, SFX é informação.
- **SFX é informação de gameplay** — todo hit, dano, pickup tem que cortar.
- **Vocalizes têm prioridade** — quando soam, devem ser ouvidos por cima.
- **Volume "loud" é exceção** — reservado pra eventos que mudam o estado do jogo (boss defeat, smart bomb).

## 2. Volumes relativos por categoria (multiplicadores 0.0–1.0)

**Decisão**: 4 sliders na tela de Opções (master + music + sfx + vocalize). Ambience herda de `sfx` (volume baixo demais pra justificar slider próprio).

| Categoria | Volume default | Faixa típica | Slider em Opções |
|---|---|---|---|
| `master` | 1.0 | 0.0–1.0 | ✅ "Volume Geral" |
| `music` | 0.50 | 0.0–1.0 | ✅ "Música" |
| `sfx` | 0.70 | 0.0–1.0 | ✅ "Efeitos" |
| `vocalize` | 0.85 | 0.0–1.0 | ✅ "Vozes" |
| `ambience` | 0.30 | 0.0–1.0 | herdada de `sfx` (sem slider próprio) |

> Volume final por som = `master * categoria * override_se_houver`.

## 3. Overrides por evento (sons que precisam estar fora da curva)

| Evento / arquivo | Volume override | Motivo |
|---|---|---|
| `boss_defeat` | 0.95 | Catarse — recompensa do boss inteiro |
| `smart_bomb_explode` | 0.95 | Tela toda virou explosão; precisa preencher |
| `boss_appear` | 0.90 | Anúncio dramático |
| `boss_phase_change` | 0.88 | Transição importante |
| `player_die` | 0.90 | Perda de vida é crítico |
| `pickup_tapioca` | 0.92 | Drop raro (1%) — tem que soar |
| `voc_oxe` (boss appear) | 0.95 | Vocalize + boss = momento marcante |
| `voc_se_lascou` (game over) | 0.95 | Encerra a partida |
| `enemy_hit` | 0.55 | Atenuado — toca demais, evitar fadiga |
| `ui_select` | 0.45 | Atenuado — navegação rápida no menu |
| `mosca_swarm_loop` | 0.35 | Loop ambiente, não pode cansar |
| `player_invuln_loop` | 0.40 | Loop tique sutil |
| `amb_*` (todos) | herdam `ambience` (0.30) | Ambiência sempre baixa |

## 4. Ducking (atenuação automática)

Implementação no `AudioManager`:

| Quando | Ducka quem | Por quanto | Duração |
|---|---|---|---|
| `boss_appear` toca | `music` | -50% (multiplica por 0.5) | 2.0s com fade-out 200ms / fade-in 600ms |
| `voc_*` toca | `sfx` | -30% | duração do vocalize + 100ms |
| `smart_bomb_explode` toca | `music` + `sfx` | -60% | 600ms |
| Pausa entra | `music` | -80% (background quase mute) | enquanto pausado |

## 5. Crossfade entre músicas

| Transição | Tempo de crossfade |
|---|---|
| Menu → Fase | 800ms |
| Fase → Boss | 600ms (cortar fase, entrar boss) |
| Boss → Próxima fase | 1000ms |
| Qualquer → Game Over | 500ms (corte mais seco, dramático) |
| Qualquer → Vitória | 1000ms |

## 6. Loudness técnico (referência para Audacity)

Ao processar cada arquivo:

| Tipo | LUFS alvo | True Peak máx | Notas |
|---|---|---|---|
| Música | -18 LUFS integrado | -1.5 dBTP | Loudness baixo deixa SFX brilhar |
| SFX UI | -16 LUFS | -1.5 dBTP | — |
| SFX gameplay normal | -14 LUFS | -1.5 dBTP | — |
| SFX loud (explosão grande, smart bomb) | -10 LUFS | -1.0 dBTP | Punch — cuidado com clip |
| Vocalize | -12 LUFS + leve compressão (3:1) | -1.5 dBTP | Reverb sutil opcional |
| Ambience | -22 LUFS | -3 dBTP | Bem baixo, não distrair |

> Audacity: `Effect > Loudness Normalization` para LUFS, `Effect > Limiter` para true peak.

## 7. Como o Gameplay Dev consome

```ts
// src/systems/AudioManager.ts (referência)
import audioConfig from '../../public/assets/audio_config.json';

class AudioManager {
  private master = audioConfig.categories.master;
  private music = audioConfig.categories.music;
  private sfx = audioConfig.categories.sfx;
  // ...

  playSfx(key: string) {
    const override = audioConfig.overrides[key];
    const categoryVol = this.resolveCategory(key); // sfx | vocalize | ambience
    const finalVol = this.master * categoryVol * (override ?? 1.0);
    this.scene.sound.play(key, { volume: finalVol });
  }
}
```

Sliders de Opções alteram `master`/`music`/`sfx` em runtime; persistir em `localStorage` chave `os_cabra_audio_settings`.

## 8. Decisões fechadas (v1)

- ✅ **4 sliders** (master + music + sfx + vocalize). Ambience herda de `sfx`.
- ✅ Persistir todos os 4 sliders em `localStorage` (chave `os_cabra_audio_settings`).
- ✅ Ducking sempre com fade — corte seco fica desconfortável.
- ✅ Vocalizes via TTS (espeak-ng pt-br + ffmpeg) em v1; gravação humana fica como upgrade pós-v1.
