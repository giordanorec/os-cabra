import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, BACKGROUND_COLOR } from './config';
import { BootScene } from './scenes/BootScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game',
  backgroundColor: BACKGROUND_COLOR,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [BootScene]
};

new Phaser.Game(config);
