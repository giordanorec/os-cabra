import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { getString } from '../strings';
import { loadAudioConfig } from '../systems/AudioManager';
import { FONTS } from '../fonts';

interface RealSprite {
  key: string;
  path: string;
  frameWidth: number;
  frameHeight: number;
}

// Sprites reais em public/assets/sprites/ (entregues pelo Visual Designer M2+).
const REAL_SPRITES: RealSprite[] = [
  { key: 'enemy-passista',   path: 'assets/sprites/enemy-passista.png',   frameWidth: 32, frameHeight: 32 },
  { key: 'enemy-caboclinho', path: 'assets/sprites/enemy-caboclinho.png', frameWidth: 28, frameHeight: 28 },
  { key: 'enemy-mosca',      path: 'assets/sprites/enemy-mosca.png',      frameWidth: 14, frameHeight: 14 },
  { key: 'boss-maracatu',    path: 'assets/sprites/boss-maracatu.png',    frameWidth: 256, frameHeight: 256 }
];

// Sprites de imagem única (não spritesheet) — cada PNG é uma pose só.
// player.png é 128×128 ilustração completa; carregar como spritesheet 32×32
// fatiaria em 16 frames-pedaço e renderizaria uma tira ilegível.
// enemy-mamulengo.png é 96×96 ilustração única — mesmo caso.
const SINGLE_SPRITES: Array<{ key: string; path: string }> = [
  { key: 'player', path: 'assets/sprites/player.png' },
  { key: 'enemy-mamulengo', path: 'assets/sprites/enemy-mamulengo.png' }
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

// Backgrounds de parallax — Visual Designer entrega em art/milestone-3+.
// `load.image` silenciosamente falha se o arquivo não existir; Parallax.ts
// detecta `textures.exists(key)` e cai pro fallback procedural nesse caso.
//
// back.png (milestone-5) é a vista aérea de Recife — casas coloridas de cima,
// Capibaburibe, quarteirões — entregue alta (800×2400) para scroll ping-pong
// vertical ao longo da fase.
// mid.png: bandeirinhas/balões/nuvens em PNG com alpha — decorativo.
// fore.png (milestone-5) regerada mas AINDA é postal frontal (galo + pássaros
// tamanho tela inteira) → bloqueia gameplay. Desativado até Visual Designer
// entregar variante aérea/silhueta leve.
const BACKGROUND_IMAGES = [
  { key: 'bg-menu-back',  file: 'assets/backgrounds/menu.png' },
  { key: 'bg-fase1-back', file: 'assets/backgrounds/fase1/back.png' },
  { key: 'bg-fase1-mid',  file: 'assets/backgrounds/fase1/mid.png' }
  // { key: 'bg-fase1-fore', file: 'assets/backgrounds/fase1/fore.png' }  // bloqueia gameplay — ver comentário acima
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
    // Supressão de log quando o PNG de background ainda não existe em main
    // (Visual Designer push pendente) — textures.exists retornará false
    // e Parallax fallback cobre.
    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      if (!file.key.startsWith('bg-')) {
        console.warn('[preload] falha carregando', file.key, file.src);
      }
    });

    for (const s of REAL_SPRITES) {
      this.load.spritesheet(s.key, s.path, { frameWidth: s.frameWidth, frameHeight: s.frameHeight });
    }
    for (const s of SINGLE_SPRITES) {
      this.load.image(s.key, s.path);
    }
    this.generateAllPlaceholders();
    for (const k of SFX_KEYS) {
      this.load.audio(k, `assets/sfx/${k}.ogg`);
    }
    for (const m of MUSIC_TRACKS) {
      this.load.audio(m.key, m.file);
    }
    for (const a of AMBIENCE_TRACKS) {
      this.load.audio(a.key, a.file);
    }
    for (const b of BACKGROUND_IMAGES) {
      this.load.image(b.key, b.file);
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
      color: '#f0c840'
    }).setOrigin(0.5);
    this.add.text(cx, cy - 10, getString('tip.hold_on'), {
      fontFamily: FONTS.BODY,
      fontSize: '16px',
      color: '#fff2cc',
      fontStyle: 'italic'
    }).setOrigin(0.5).setAlpha(0.8);
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
    stroke.lineStyle(2, 0xfff2cc, 0.7);
    stroke.strokeRect(x, y, 400, 14);
    fill.clear();
    fill.fillStyle(0xf0c840, 1);
    fill.fillRect(x + 2, y + 2, Math.max(0, 396 * p), 10);
  }

  private generateAllPlaceholders() {
    // Bullet player — "típico Recife": diamante colorido (bandeirinha/confete)
    // Troca pelo sprite real quando Visual Designer entregar penas/milho/etc.
    this.generateDiamondBullet('bullet-player', 0xf06aa8, 0xf0c840);
    // Bullets inimigas
    this.generateRect('enemy-bullet-flecha', 6, 18, 0xe84a4a);
    this.generateRect('enemy-bullet-bombinha', 10, 10, 0xf0c840);
    this.generateCircle('enemy-bullet-cabeca', 16, 0x2a2540);
    this.generateCircle('enemy-bullet-figo', 14, 0xb84a2e);
    // HUD icons
    this.generateRect('ui-life-icon', 24, 24, 0xe84a4a);
    this.generateRect('ui-bomb-icon', 24, 24, 0xf0c840);
    // VFX
    this.generateRect('vfx-spark', 3, 3, 0xf0c840);
    this.generateRect('vfx-ember', 4, 4, 0xfff2cc);
    this.generateRect('vfx-shield-shatter', 4, 4, 0xd4a04c);
    // Boss members — Visual Designer ainda não separou o atlas; placeholders diferenciados
    this.generateRect('boss-rei', 48, 56, 0xf0c840);
    this.generateRect('boss-rainha', 48, 56, 0xe84a4a);
    this.generateRect('boss-calunga', 36, 44, 0x8dc850);
    // Inimigos sem asset entregue (Visual Designer M3+): placeholders distintos
    // por silhueta. Urubu = triângulo escuro (pássaro aéreo). Papa-figo = círculo
    // carmim com anel (criatura bio-orgânica central).
    this.generateTriangle('enemy-urubu', 56, 44, 0x2a2540);
    this.generateTargetBlob('enemy-papa-figo', 72, 72, 0xb84a2e, 0x2a2540);
    // Power-up sombrinha (placeholder): diamante dourado com cabo — evoca
    // sombrinha de frevo (versão final virá do Visual Designer).
    this.generateUmbrella('powerup-sombrinha', 0xf0c840, 0xe84a4a);
  }

  private generateCircle(key: string, d: number, color: number) {
    const g = this.add.graphics({ x: 0, y: 0 });
    g.fillStyle(color, 1);
    g.fillCircle(d / 2, d / 2, d / 2);
    g.generateTexture(key, d, d);
    g.destroy();
  }

  private generateTriangle(key: string, w: number, h: number, color: number) {
    const g = this.add.graphics({ x: 0, y: 0 });
    g.fillStyle(color, 1);
    // triângulo apontando pra baixo (urubu planando) com braços laterais
    g.fillTriangle(0, 0, w, 0, w / 2, h);
    g.lineStyle(2, 0xf4e4c1, 0.7);
    g.strokeTriangle(0, 0, w, 0, w / 2, h);
    g.generateTexture(key, w, h);
    g.destroy();
  }

  private generateTargetBlob(key: string, w: number, h: number, fill: number, stroke: number) {
    const g = this.add.graphics({ x: 0, y: 0 });
    const cx = w / 2;
    const cy = h / 2;
    g.fillStyle(fill, 1);
    g.fillCircle(cx, cy, Math.min(w, h) / 2 - 2);
    g.lineStyle(3, stroke, 1);
    g.strokeCircle(cx, cy, Math.min(w, h) / 2 - 2);
    g.lineStyle(2, 0xf0c840, 0.9);
    g.strokeCircle(cx, cy, Math.min(w, h) / 4);
    g.generateTexture(key, w, h);
    g.destroy();
  }

  private generateUmbrella(key: string, canopy: number, accent: number) {
    // 36×44 sombrinha: meia-cúpula no topo + cabo vertical curto
    const w = 36;
    const h = 44;
    const g = this.add.graphics({ x: 0, y: 0 });
    g.fillStyle(canopy, 1);
    g.slice(w / 2, 22, 16, Math.PI, 0, true);
    g.fillPath();
    g.lineStyle(2, 0x2a2540, 1);
    g.strokeCircle(w / 2, 22, 16);
    // gomos de cor alternada (xilogravura ingênua)
    g.lineStyle(1, accent, 0.9);
    g.lineBetween(w / 2, 22, 4, 22);
    g.lineBetween(w / 2, 22, w - 4, 22);
    g.lineBetween(w / 2, 22, w / 2, 6);
    // cabo
    g.fillStyle(accent, 1);
    g.fillRect(w / 2 - 1, 22, 2, 18);
    g.fillStyle(canopy, 1);
    g.fillCircle(w / 2, 42, 3);
    g.generateTexture(key, w, h);
    g.destroy();
  }

  private generateRect(key: string, w: number, h: number, color: number) {
    const g = this.add.graphics({ x: 0, y: 0 });
    g.fillStyle(color, 1);
    g.fillRect(0, 0, w, h);
    g.generateTexture(key, w, h);
    g.destroy();
  }

  private generateDiamondBullet(key: string, primary: number, accent: number) {
    // 12×18 bandeirinha/diamante: triângulo superior primary + inferior accent
    const w = 12;
    const h = 18;
    const g = this.add.graphics({ x: 0, y: 0 });
    g.fillStyle(primary, 1);
    g.fillTriangle(w / 2, 0, w, h / 2, 0, h / 2);
    g.fillStyle(accent, 1);
    g.fillTriangle(0, h / 2, w, h / 2, w / 2, h);
    g.lineStyle(1, 0x2a2540, 0.8);
    g.strokeTriangle(w / 2, 0, w, h / 2, 0, h / 2);
    g.strokeTriangle(0, h / 2, w, h / 2, w / 2, h);
    g.generateTexture(key, w, h);
    g.destroy();
  }
}
