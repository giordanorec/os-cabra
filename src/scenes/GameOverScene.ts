import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { getString, getGameOverTitle } from '../strings';
import { InputManager, Action } from '../systems/InputManager';
import { AudioManager } from '../systems/AudioManager';
import { Parallax } from '../systems/Parallax';
import { FONTS } from '../fonts';

export interface GameOverData {
  score: number;
  victory: boolean;
}

export class GameOverScene extends Phaser.Scene {
  private inputManager!: InputManager;
  private overData!: GameOverData;
  private audio!: AudioManager;
  private parallax!: Parallax;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: GameOverData) {
    this.overData = data;
  }

  create() {
    this.parallax = new Parallax(this);
    this.inputManager = new InputManager(this);
    this.audio = new AudioManager(this);

    const isVictory = this.overData.victory;
    const titleText = isVictory ? getString('stage.complete') : getGameOverTitle();
    const color = isVictory ? '#d4a04c' : '#b84a2e';
    const musicKey = isVictory ? 'music_victory' : 'music_gameover';
    const vocalKey = isVictory ? 'voc_pai_degua' : 'voc_se_lascou';

    this.audio.playMusic(musicKey, 500);
    this.time.delayedCall(200, () => this.audio.play(vocalKey));

    this.cameras.main.setBackgroundColor('#1a0f08');
    this.cameras.main.fadeIn(400, 26, 15, 8);

    const cx = GAME_WIDTH / 2;
    const title = this.add.text(cx, GAME_HEIGHT / 2 - 80, titleText, {
      fontFamily: FONTS.DISPLAY,
      fontSize: '88px',
      color,
      stroke: '#1a0f08',
      strokeThickness: 4
    }).setOrigin(0.5).setScale(0);
    this.tweens.add({
      targets: title,
      scale: { from: 0, to: 1 },
      duration: 600,
      ease: 'Back.easeOut'
    });

    const scoreStr = this.overData.score.toString().padStart(6, '0');
    this.add.text(cx, GAME_HEIGHT / 2 + 10, `${getString('gameover.score_label')} ${scoreStr}`, {
      fontFamily: FONTS.MONO,
      fontSize: '32px',
      color: '#f4e4c1'
    }).setOrigin(0.5);

    const hintKey = isVictory ? 'stage.complete.hint' : 'gameover.hint';
    this.add.text(cx, GAME_HEIGHT - 80, getString(hintKey), {
      fontFamily: FONTS.MONO,
      fontSize: '14px',
      color: '#7a6850'
    }).setOrigin(0.5);
  }

  override update(_time: number, delta: number) {
    this.parallax.tick(delta);
    if (this.inputManager.justPressed(Action.CONFIRM) || this.inputManager.justPressed(Action.FIRE)) {
      this.audio.play('ui_confirm');
      this.audio.stopMusic(300);
      this.cameras.main.fadeOut(400, 26, 15, 8);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('MenuScene'));
    }
  }
}
