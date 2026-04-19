import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { getString } from '../strings';
import { Action, InputManager } from '../systems/InputManager';

export class PauseScene extends Phaser.Scene {
  private inputManager!: InputManager;
  private justOpenedAt = 0;

  constructor() {
    super({ key: 'PauseScene' });
  }

  create() {
    this.inputManager = new InputManager(this);
    this.justOpenedAt = this.time.now;

    const dim = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1a0f08, 0.65);
    dim.setDepth(1000);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, getString('pause.title'), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '72px',
      color: '#f4e4c1'
    }).setOrigin(0.5).setDepth(1001);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, getString('pause.resume'), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '32px',
      color: '#d4a04c'
    }).setOrigin(0.5).setDepth(1001);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80, getString('pause.hint'), {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#7a6850'
    }).setOrigin(0.5).setDepth(1001);
  }

  override update() {
    if (this.time.now - this.justOpenedAt < 200) return;
    if (this.inputManager.justPressed(Action.PAUSE) || this.inputManager.justPressed(Action.CONFIRM)) {
      this.scene.resume('GameScene');
      this.scene.resume('HUDScene');
      this.scene.stop();
    }
  }
}
