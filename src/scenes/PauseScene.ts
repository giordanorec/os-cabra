import * as Phaser from 'phaser';
import { DEPTH, GAME_HEIGHT, GAME_WIDTH } from '../config';
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
    this.inputManager.registerAnyTapAsConfirm(this);
    this.audio = new AudioManager(this);
    this.audio.play('pause_in');
    this.justOpenedAt = this.time.now;

    const dim = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x2a2540, 0.55);
    dim.setDepth(DEPTH.PAUSE);

    const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, getString('pause.title'), {
      fontFamily: FONTS.DISPLAY,
      fontSize: '72px',
      color: '#fff2cc',
      stroke: '#2a2540',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(DEPTH.PAUSE + 1).setScale(0.5);
    this.tweens.add({
      targets: title,
      scale: { from: 0.5, to: 1 },
      duration: 250,
      ease: 'Back.easeOut'
    });

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, getString('pause.resume'), {
      fontFamily: FONTS.DISPLAY,
      fontSize: '36px',
      color: '#f0c840'
    }).setOrigin(0.5).setDepth(DEPTH.PAUSE + 1);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 90, getString('pause.controls_hint'), {
      fontFamily: FONTS.MONO,
      fontSize: '14px',
      color: '#fff2cc'
    }).setOrigin(0.5).setDepth(DEPTH.PAUSE + 1).setAlpha(0.8);
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
