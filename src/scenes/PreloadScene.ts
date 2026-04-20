import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { getString } from '../strings';
import { loadAudioConfig } from '../systems/AudioManager';
import { FONTS } from '../fonts';

interface Placeholder {
  key: string;
  w: number;
  h: number;
  color: number;
}

interface RealSprite {
  key: string;
  path: string;
  frameWidth: number;
  frameHeight: number;
}

// Sprites reais em public/assets/sprites/ (entregues pelo Visual Designer M2+).
const REAL_SPRITES: RealSprite[] = [
  { key: 'player',           path: 'assets/sprites/player.png',           frameWidth: 32, frameHeight: 32 },
  { key: 'enemy-passista',   path: 'assets/sprites/enemy-passista.png',   frameWidth: 32, frameHeight: 32 },
  { key: 'enemy-caboclinho', path: 'assets/sprites/enemy-caboclinho.png', frameWidth: 28, frameHeight: 28 },
  { key: 'enemy-mosca',      path: 'assets/sprites/enemy-mosca.png',      frameWidth: 14, frameHeight: 14 },
  { key: 'boss-maracatu',    path: 'assets/sprites/boss-maracatu.png',    frameWidth: 256, frameHeight: 256 }
];

// Placeholders procedurais (paleta ART_BIBLE) pro que ainda não tem sprite.
const PLACEHOLDERS: Placeholder[] = [
  { key: 'bullet-player',         w: 6,  h: 14, color: 0xf4e4c1 },
  { key: 'enemy-bullet-flecha',   w: 6,  h: 18, color: 0xb84a2e },
  { key: 'enemy-bullet-bombinha', w: 10, h: 10, color: 0xd4a04c },
  { key: 'ui-life-icon',          w: 24, h: 24, color: 0xb84a2e },
  { key: 'ui-bomb-icon',          w: 24, h: 24, color: 0xd4a04c },
  { key: 'vfx-spark',             w: 3,  h: 3,  color: 0xd4a04c },
  { key: 'vfx-ember',             w: 4,  h: 4,  color: 0xf4e4c1 },
  // Rei/Rainha/Calunga — Visual Designer ainda não separou o trio; seguimos com placeholders diferenciados
  { key: 'boss-rei',              w: 48, h: 56, color: 0xd4a04c },
  { key: 'boss-rainha',           w: 48, h: 56, color: 0xb84a2e },
  { key: 'boss-calunga',          w: 36, h: 44, color: 0x5a7a3a }
];

const SFX_KEYS = [
  'player_fire', 'player_hit', 'player_die', 'player_respawn',
  'enemy_hit', 'enemy_explode_small', 'enemy_explode_medium', 'enemy_explode_large',
  'enemy_shoot_generic', 'caboclinho_arrow', 'caboclinho_spawn',
  'passista_bomb_drop', 'passista_frevo_spawn',
  'boss_appear', 'boss_hit', 'boss_defeat', 'boss_phase_change', 'boss_ring_burst',
  'chain_multiplier', 'checkpoint', 'phase_intro', 'wave_clear', 'score_milestone',
  'pickup_generic', 'pickup_tapioca', 'pickup_fogo_triplo', 'pickup_sombrinha',
  'pickup_cachaca', 'pickup_baque_virado', 'powerup_expire', 'shield_break',
  'smart_bomb_explode',
  'pause_in', 'pause_out', 'ui_select', 'ui_confirm', 'ui_cancel',
  'voc_oxe', 'voc_arretado', 'voc_egua', 'voc_visse', 'voc_pai_degua',
  'voc_se_lascou', 'voc_ta_com_tudo', 'voc_ai_viu', 'voc_bora'
];

const MUSIC_TRACKS = [
  { key: 'music_menu',     file: 'assets/music/menu_frevo.ogg' },
  { key: 'music_phase1',   file: 'assets/music/phase1_marco_zero.ogg' },
  { key: 'music_boss',     file: 'assets/music/boss_generic.ogg' },
  { key: 'music_gameover', file: 'assets/music/game_over.ogg' },
  { key: 'music_victory',  file: 'assets/music/victory.ogg' }
];

const AMBIENCE_TRACKS = [
  { key: 'amb_marco_zero', file: 'assets/ambience/amb_marco_zero_crowd.ogg' }
];

export class PreloadScene extends Phaser.Scene {
  private progressStroke?: Phaser.GameObjects.Graphics;
  private progressFill?: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.setupLoadingUI();
    this.load.on('progress', (p: number) => this.drawProgress(p));

    for (const s of REAL_SPRITES) {
      this.load.spritesheet(s.key, s.path, { frameWidth: s.frameWidth, frameHeight: s.frameHeight });
    }
    for (const p of PLACEHOLDERS) {
      this.generatePlaceholder(p);
    }
    for (const k of SFX_KEYS) {
      this.load.audio(k, `assets/sfx/${k}.ogg`);
    }
    for (const m of MUSIC_TRACKS) {
      this.load.audio(m.key, m.file);
    }
    for (const a of AMBIENCE_TRACKS) {
      this.load.audio(a.key, a.file);
    }
  }

  async create() {
    await loadAudioConfig();
    this.scene.start('MenuScene');
  }

  private setupLoadingUI() {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    this.add.text(cx, cy - 80, getString('boot.title'), {
      fontFamily: FONTS.DISPLAY,
      fontSize: '72px',
      color: '#d4a04c'
    }).setOrigin(0.5);
    this.add.text(cx, cy - 10, getString('tip.hold_on'), {
      fontFamily: FONTS.BODY,
      fontSize: '16px',
      color: '#f4e4c1',
      fontStyle: 'italic'
    }).setOrigin(0.5).setAlpha(0.7);
    this.progressStroke = this.add.graphics();
    this.progressFill = this.add.graphics();
    this.drawProgress(0);
  }

  private drawProgress(p: number) {
    const stroke = this.progressStroke;
    const fill = this.progressFill;
    if (!stroke || !fill) return;
    const x = GAME_WIDTH / 2 - 200;
    const y = GAME_HEIGHT / 2 + 30;
    stroke.clear();
    stroke.lineStyle(2, 0xf4e4c1, 0.6);
    stroke.strokeRect(x, y, 400, 14);
    fill.clear();
    fill.fillStyle(0xd4a04c, 1);
    fill.fillRect(x + 2, y + 2, Math.max(0, 396 * p), 10);
  }

  private generatePlaceholder(p: Placeholder) {
    const g = this.add.graphics({ x: 0, y: 0 });
    g.fillStyle(p.color, 1);
    g.fillRect(0, 0, p.w, p.h);
    g.generateTexture(p.key, p.w, p.h);
    g.destroy();
  }
}
