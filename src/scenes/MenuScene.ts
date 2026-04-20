import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, SCENE_BG } from '../config';
import { getString } from '../strings';
import { ScoreManager } from '../systems/ScoreManager';
import { InputManager, Action } from '../systems/InputManager';
import { AudioManager } from '../systems/AudioManager';
import { Parallax } from '../systems/Parallax';
import { attachFullscreenToggle, addFullscreenButton } from '../systems/Fullscreen';
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
    this.cameras.main.setBackgroundColor(SCENE_BG.MENU);
    this.parallax = new Parallax(this, 'menu');
    this.inputManager = new InputManager(this);
    this.audio = new AudioManager(this);
    this.audio.playMusic('music_menu', 800);
    attachFullscreenToggle(this);

    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    const title = this.add.text(cx, cy - 120, getString('boot.title'), {
      fontFamily: FONTS.DISPLAY,
      fontSize: '96px',
      color: '#f0c840',
      stroke: '#2a2540',
      strokeThickness: 6
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
      fontSize: '20px',
      color: '#fff2cc',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    const playText = this.add.text(cx, cy + 60, getString('menu.play'), {
      fontFamily: FONTS.DISPLAY,
      fontSize: '56px',
      color: '#fff2cc',
      stroke: '#2a2540',
      strokeThickness: 4
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
      color: '#fff2cc'
    }).setOrigin(0.5).setAlpha(0.8);

    // Fullscreen: ícone clicável + hint textual
    addFullscreenButton(this, GAME_WIDTH - 24, 24);
    this.add.text(GAME_WIDTH - 44, 46, getString('controls.fullscreen_hint'), {
      fontFamily: FONTS.MONO,
      fontSize: '11px',
      color: '#fff2cc'
    }).setOrigin(1, 0).setAlpha(0.75);

    const hs = ScoreManager.loadHighscore();
    if (hs > 0) {
      this.add.text(cx, GAME_HEIGHT - 30, getString('menu.highscore', hs.toString().padStart(6, '0')), {
        fontFamily: FONTS.MONO,
        fontSize: '16px',
        color: '#f0c840'
      }).setOrigin(0.5);
    }
  }

  override update(_time: number, delta: number) {
    this.parallax.tick(delta);
    if (this.confirmed) return;
    if (this.inputManager.justPressed(Action.CONFIRM) || this.inputManager.justPressed(Action.FIRE)) {
      this.confirmed = true;
      this.audio.play('ui_confirm');
      this.cameras.main.fadeOut(300);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.audio.stopMusic(200);
        this.scene.start('GameScene');
      });
    }
  }
}
