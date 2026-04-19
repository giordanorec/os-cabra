import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { getString } from '../strings';
import { InputManager, Action } from '../systems/InputManager';

export interface GameOverData {
  score: number;
  victory: boolean;
}

export class GameOverScene extends Phaser.Scene {
  private inputManager!: InputManager;
  private overData!: GameOverData;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: GameOverData) {
    this.overData = data;
  }

  create() {
    this.inputManager = new InputManager(this);

    const titleKey = this.overData.victory ? 'stage.complete' : 'gameover.title';
    const color = this.overData.victory ? '#d4a04c' : '#b84a2e';

    this.cameras.main.setBackgroundColor('#1a0f08');

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, getString(titleKey), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '72px',
      color
    }).setOrigin(0.5);

    const scoreStr = this.overData.score.toString().padStart(6, '0');
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, `${getString('gameover.score_label')} ${scoreStr}`, {
      fontFamily: 'Arial Black, monospace',
      fontSize: '32px',
      color: '#f4e4c1'
    }).setOrigin(0.5);

    const hintKey = this.overData.victory ? 'stage.complete.hint' : 'gameover.hint';
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 80, getString(hintKey), {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#7a6850'
    }).setOrigin(0.5);
  }

  override update() {
    if (this.inputManager.justPressed(Action.CONFIRM) || this.inputManager.justPressed(Action.FIRE)) {
      this.scene.start('MenuScene');
    }
  }
}
