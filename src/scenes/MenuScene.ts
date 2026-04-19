import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { getString } from '../strings';
import { ScoreManager } from '../systems/ScoreManager';
import { InputManager, Action } from '../systems/InputManager';

export class MenuScene extends Phaser.Scene {
  private inputManager!: InputManager;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.inputManager = new InputManager(this);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 120, getString('boot.title'), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '80px',
      color: '#d4a04c'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, getString('boot.tagline'), {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#f4e4c1',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    const playText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, getString('menu.play'), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '48px',
      color: '#f4e4c1'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: playText,
      scale: { from: 1, to: 1.06 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 110, getString('menu.hint'), {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#7a6850'
    }).setOrigin(0.5);

    const hs = ScoreManager.loadHighscore();
    if (hs > 0) {
      this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 30, getString('menu.highscore', hs.toString().padStart(6, '0')), {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#d4a04c'
      }).setOrigin(0.5);
    }
  }

  override update() {
    if (this.inputManager.justPressed(Action.CONFIRM) || this.inputManager.justPressed(Action.FIRE)) {
      this.scene.start('GameScene');
    }
  }
}
