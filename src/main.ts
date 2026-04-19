import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, BACKGROUND_COLOR } from './config';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { GameScene } from './scenes/GameScene';

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
  scene: [BootScene, PreloadScene, GameScene]
};

const game = new Phaser.Game(config);

if (import.meta.env.DEV) {
  (window as unknown as { __osCabra?: Phaser.Game }).__osCabra = game;
}
