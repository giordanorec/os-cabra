import * as Phaser from 'phaser';

interface Placeholder {
  key: string;
  w: number;
  h: number;
  color: number;
}

const PLACEHOLDERS: Placeholder[] = [
  { key: 'player', w: 32, h: 32, color: 0xd4a04c },
  { key: 'bullet-player', w: 6, h: 14, color: 0xf4e4c1 },
  { key: 'enemy-caboclinho', w: 28, h: 28, color: 0xb84a2e },
  { key: 'enemy-passista', w: 32, h: 32, color: 0xe87a3e },
  { key: 'enemy-mosca', w: 14, h: 14, color: 0x7a6850 },
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
