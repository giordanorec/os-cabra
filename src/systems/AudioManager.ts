import * as Phaser from 'phaser';

type SoundKey = string;

interface AudioConfig {
  categories: {
    master: number;
    music: number;
    sfx: number;
    vocalize: number;
    ambience: number;
  };
  overrides: Record<string, number>;
  categoryOf: {
    vocalize_prefix: string;
    ambience_prefix: string;
    default: string;
  };
}

let cfg: AudioConfig | null = null;

const DEFAULT_CONFIG: AudioConfig = {
  categories: { master: 1.0, music: 0.5, sfx: 0.7, vocalize: 0.85, ambience: 0.3 },
  overrides: {},
  categoryOf: { vocalize_prefix: 'voc_', ambience_prefix: 'amb_', default: 'sfx' }
};

function categoryFor(key: SoundKey): keyof AudioConfig['categories'] {
  if (!cfg) return 'sfx';
  if (key.startsWith(cfg.categoryOf.vocalize_prefix)) return 'vocalize';
  if (key.startsWith(cfg.categoryOf.ambience_prefix)) return 'ambience';
  return 'sfx';
}

function volumeFor(key: SoundKey): number {
  const config = cfg ?? DEFAULT_CONFIG;
  const cat = categoryFor(key);
  const base = config.categories[cat] ?? 1;
  const override = config.overrides[key] ?? 1;
  return base * config.categories.master * override;
}

export async function loadAudioConfig(): Promise<void> {
  try {
    const res = await fetch('/assets/audio_config.json');
    if (!res.ok) throw new Error('no config');
    const json = await res.json();
    cfg = {
      categories: json.categories ?? DEFAULT_CONFIG.categories,
      overrides: json.overrides ?? {},
      categoryOf: json.categoryOf ?? DEFAULT_CONFIG.categoryOf
    };
  } catch {
    cfg = DEFAULT_CONFIG;
  }
}

export class AudioManager {
  private currentMusic?: Phaser.Sound.BaseSound;
  private currentMusicKey?: string;

  constructor(private readonly scene: Phaser.Scene) {}

  play(key: SoundKey, opts: { loop?: boolean } = {}): Phaser.Sound.BaseSound | null {
    if (!this.scene.cache.audio.exists(key)) return null;
    try {
      const s = this.scene.sound.add(key, { volume: volumeFor(key), loop: opts.loop ?? false });
      s.play();
      if (!opts.loop) {
        s.once('complete', () => s.destroy());
      }
      return s;
    } catch {
      return null;
    }
  }

  playMusic(key: SoundKey, crossfadeMs = 600): void {
    if (this.currentMusicKey === key && this.currentMusic?.isPlaying) return;
    if (!this.scene.cache.audio.exists(key)) return;
    const prev = this.currentMusic;
    const prevKey = this.currentMusicKey;
    const next = this.scene.sound.add(key, { volume: 0, loop: true });
    next.play();
    this.scene.tweens.add({
      targets: next,
      volume: volumeFor(key),
      duration: crossfadeMs,
      ease: 'Sine.easeInOut'
    });
    if (prev && prevKey) {
      this.scene.tweens.add({
        targets: prev,
        volume: 0,
        duration: crossfadeMs,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          prev.stop();
          prev.destroy();
        }
      });
    }
    this.currentMusic = next;
    this.currentMusicKey = key;
  }

  stopMusic(fadeMs = 400): void {
    if (!this.currentMusic) return;
    const m = this.currentMusic;
    this.scene.tweens.add({
      targets: m,
      volume: 0,
      duration: fadeMs,
      onComplete: () => {
        m.stop();
        m.destroy();
      }
    });
    this.currentMusic = undefined;
    this.currentMusicKey = undefined;
  }
}
