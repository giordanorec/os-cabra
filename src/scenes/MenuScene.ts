import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { getString } from '../strings';
import { ScoreManager } from '../systems/ScoreManager';
import { InputManager, Action } from '../systems/InputManager';
import { AudioManager } from '../systems/AudioManager';
import { Parallax } from '../systems/Parallax';
import { FONTS } from '../fonts';

export class MenuScene extends Phaser.Scene {
  private inputManager!: InputManager;
  private audio!: AudioManager;
  private parallax!: Parallax;
  private confirmed = false;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.confirmed = false;
    this.parallax = new Parallax(this);
    this.inputManager = new InputManager(this);
    this.audio = new AudioManager(this);
    this.audio.playMusic('music_menu', 800);

    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    const title = this.add.text(cx, cy - 120, getString('boot.title'), {
      fontFamily: FONTS.DISPLAY,
      fontSize: '88px',
      color: '#d4a04c'
    }).setOrigin(0.5);
    this.tweens.add({
      targets: title,
      scale: { from: 1, to: 1.04 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.add.text(cx, cy - 40, getString('boot.tagline'), {
      fontFamily: FONTS.BODY,
      fontSize: '18px',
      color: '#f4e4c1',
      fontStyle: 'italic'
    }).setOrigin(0.5).setAlpha(0.8);

    const playText = this.add.text(cx, cy + 60, getString('menu.play'), {
      fontFamily: FONTS.DISPLAY,
      fontSize: '48px',
      color: '#f4e4c1'
    }).setOrigin(0.5);
    this.tweens.add({
      targets: playText,
      scale: { from: 1, to: 1.08 },
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.add.text(cx, cy + 130, getString('menu.hint'), {
      fontFamily: FONTS.MONO,
      fontSize: '14px',
      color: '#7a6850'
    }).setOrigin(0.5);

    const hs = ScoreManager.loadHighscore();
    if (hs > 0) {
      this.add.text(cx, GAME_HEIGHT - 30, getString('menu.highscore', hs.toString().padStart(6, '0')), {
        fontFamily: FONTS.MONO,
        fontSize: '16px',
        color: '#d4a04c'
      }).setOrigin(0.5);
    }
  }

  override update(_time: number, delta: number) {
    this.parallax.tick(delta);
    if (this.confirmed) return;
    if (this.inputManager.justPressed(Action.CONFIRM) || this.inputManager.justPressed(Action.FIRE)) {
      this.confirmed = true;
      this.audio.play('ui_confirm');
      this.cameras.main.fadeOut(300, 26, 15, 8);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.audio.stopMusic(200);
        this.scene.start('GameScene');
      });
    }
  }
}
