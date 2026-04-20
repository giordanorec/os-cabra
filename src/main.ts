import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, BACKGROUND_COLOR } from './config';
import { waitForFonts } from './fonts';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { HUDScene } from './scenes/HUDScene';
import { GameOverScene } from './scenes/GameOverScene';
import { PauseScene } from './scenes/PauseScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: BACKGROUND_COLOR,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [BootScene, PreloadScene, MenuScene, GameScene, HUDScene, GameOverScene, PauseScene]
};

async function bootstrap() {
  await waitForFonts();
  const game = new Phaser.Game(config);
  if (import.meta.env.DEV) {
    (window as unknown as { __osCabra?: Phaser.Game }).__osCabra = game;
  }
}

bootstrap();
