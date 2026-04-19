import * as Phaser from 'phaser';

const PLAYER_KEY = 'player';
const BULLET_PLAYER_KEY = 'bullet-player';
const ENEMY_STATIC_KEY = 'enemy-static';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.generatePlaceholder(PLAYER_KEY, 32, 32, 0xd4a04c);
    this.generatePlaceholder(BULLET_PLAYER_KEY, 6, 14, 0xf4e4c1);
    this.generatePlaceholder(ENEMY_STATIC_KEY, 36, 36, 0xb84a2e);
  }

  create() {
    this.scene.start('GameScene');
  }

  private generatePlaceholder(key: string, width: number, height: number, color: number) {
    const g = this.add.graphics({ x: 0, y: 0 });
    g.fillStyle(color, 1);
    g.fillRect(0, 0, width, height);
    g.generateTexture(key, width, height);
    g.destroy();
  }
}
