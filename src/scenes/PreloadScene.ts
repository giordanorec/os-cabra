import * as Phaser from 'phaser';

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

// Sprites reais em public/assets/sprites/ (entregues pelo Visual Designer M2, PR #11).
// Carregados como spritesheet — primeira frame (0) vira a textura default quando usada só como 'key'.
const REAL_SPRITES: RealSprite[] = [
  { key: 'player',           path: 'assets/sprites/player.png',           frameWidth: 32, frameHeight: 32 },
  { key: 'enemy-passista',   path: 'assets/sprites/enemy-passista.png',   frameWidth: 32, frameHeight: 32 },
  { key: 'enemy-caboclinho', path: 'assets/sprites/enemy-caboclinho.png', frameWidth: 28, frameHeight: 28 },
  { key: 'enemy-mosca',      path: 'assets/sprites/enemy-mosca.png',      frameWidth: 14, frameHeight: 14 }
];

// Assets ainda sem sprite real — continuam como placeholders coloridos.
// Bullets e bosses do trio Maracatu ficam pro próximo ciclo de arte.
const PLACEHOLDERS: Placeholder[] = [
  { key: 'bullet-player', w: 6, h: 14, color: 0xf4e4c1 },
  { key: 'enemy-bullet-flecha', w: 6, h: 18, color: 0xb84a2e },
  { key: 'enemy-bullet-bombinha', w: 10, h: 10, color: 0xd4a04c },
  { key: 'boss-rei', w: 48, h: 56, color: 0xd4a04c },
  { key: 'boss-rainha', w: 48, h: 56, color: 0xb84a2e },
  { key: 'boss-calunga', w: 36, h: 44, color: 0x5a7a3a }
];

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    for (const s of REAL_SPRITES) {
      this.load.spritesheet(s.key, s.path, {
        frameWidth: s.frameWidth,
        frameHeight: s.frameHeight
      });
    }
    for (const p of PLACEHOLDERS) {
      this.generatePlaceholder(p);
    }
  }

  create() {
    this.scene.start('MenuScene');
  }

  private generatePlaceholder(p: Placeholder) {
    const g = this.add.graphics({ x: 0, y: 0 });
    g.fillStyle(p.color, 1);
    g.fillRect(0, 0, p.w, p.h);
    g.generateTexture(p.key, p.w, p.h);
    g.destroy();
  }
}
