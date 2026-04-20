import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { getString } from '../strings';
import { Action, InputManager } from '../systems/InputManager';
import { AudioManager } from '../systems/AudioManager';
import { FONTS } from '../fonts';

export class PauseScene extends Phaser.Scene {
  private inputManager!: InputManager;
  private audio!: AudioManager;
  private justOpenedAt = 0;

  constructor() {
    super({ key: 'PauseScene' });
  }

  create() {
    this.inputManager = new InputManager(this);
    this.audio = new AudioManager(this);
    this.audio.play('pause_in');
    this.justOpenedAt = this.time.now;

    const dim = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1a0f08, 0.65);
    dim.setDepth(1000);

    const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, getString('pause.title'), {
      fontFamily: FONTS.DISPLAY,
      fontSize: '72px',
      color: '#f4e4c1'
    }).setOrigin(0.5).setDepth(1001).setScale(0.5);
    this.tweens.add({
      targets: title,
      scale: { from: 0.5, to: 1 },
      duration: 250,
      ease: 'Back.easeOut'
    });

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, getString('pause.resume'), {
      fontFamily: FONTS.DISPLAY,
      fontSize: '36px',
      color: '#d4a04c'
    }).setOrigin(0.5).setDepth(1001);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 90, getString('pause.controls_hint'), {
      fontFamily: FONTS.MONO,
      fontSize: '14px',
      color: '#7a6850'
    }).setOrigin(0.5).setDepth(1001);
  }

  override update() {
    if (this.time.now - this.justOpenedAt < 200) return;
    if (this.inputManager.justPressed(Action.PAUSE) || this.inputManager.justPressed(Action.CONFIRM)) {
      this.audio.play('pause_out');
      this.scene.resume('GameScene');
      this.scene.resume('HUDScene');
      this.scene.stop();
    }
  }
}
