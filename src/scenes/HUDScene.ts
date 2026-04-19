import * as Phaser from 'phaser';
import { GAME_WIDTH, PLAYER_LIVES } from '../config';
import { getString } from '../strings';

export interface HUDEvents {
  livesChanged: (lives: number) => void;
  scoreChanged: (score: number, multiplierActive: boolean) => void;
  phaseIntro: (name: string, subtitle: string, headerNum: number) => void;
  checkpointFlash: () => void;
}

export class HUDScene extends Phaser.Scene {
  private lifeIcons: Phaser.GameObjects.Rectangle[] = [];
  private lifeSlots: Phaser.GameObjects.Rectangle[] = [];
  private scoreValue!: Phaser.GameObjects.Text;
  private multiplierText!: Phaser.GameObjects.Text;
  private introContainer?: Phaser.GameObjects.Container;
  private checkpointText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'HUDScene' });
  }

  create() {
    for (let i = 0; i < PLAYER_LIVES; i++) {
      const x = 20 + i * 32 + 12;
      const slot = this.add.rectangle(x, 22, 24, 24, 0xb84a2e, 0.3).setStrokeStyle(1, 0xb84a2e, 0.5);
      const icon = this.add.rectangle(x, 22, 24, 24, 0xb84a2e, 1);
      this.lifeSlots.push(slot);
      this.lifeIcons.push(icon);
    }

    this.add.text(300, 12, getString('hud.score_label'), {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#f4e4c1'
    }).setAlpha(0.7);

    this.scoreValue = this.add.text(360, 8, '000000', {
      fontFamily: 'Arial Black, monospace',
      fontSize: '24px',
      color: '#f4e4c1'
    });

    this.multiplierText = this.add.text(520, 10, '×1.5', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '20px',
      color: '#d4a04c',
      fontStyle: 'italic'
    }).setVisible(false);

    this.add.text(GAME_WIDTH / 2, 600 - 14, getString('controls.hint'), {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#7a6850'
    }).setOrigin(0.5, 1).setAlpha(0.7);

    const game = this.scene.get('GameScene');
    game.events.on('hud-lives', (lives: number) => this.setLives(lives));
    game.events.on('hud-score', (score: number, mult: boolean) => this.setScore(score, mult));
    game.events.on('hud-phase-intro', (name: string, subtitle: string, num: number) => this.showPhaseIntro(name, subtitle, num));
    game.events.on('hud-checkpoint', () => this.showCheckpointFlash());
  }

  private setLives(lives: number) {
    this.lifeIcons.forEach((icon, i) => {
      icon.setVisible(i < lives);
    });
  }

  private setScore(score: number, multiplierActive: boolean) {
    this.scoreValue.setText(score.toString().padStart(6, '0'));
    this.multiplierText.setVisible(multiplierActive);
  }

  private showPhaseIntro(name: string, subtitle: string, num: number) {
    if (this.introContainer) this.introContainer.destroy();
    const cx = GAME_WIDTH / 2;
    const cy = 300;
    const header = this.add.text(0, -60, getString('stage.header', num), {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#d4a04c'
    }).setOrigin(0.5);
    const title = this.add.text(0, 0, name, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '64px',
      color: '#f4e4c1'
    }).setOrigin(0.5);
    const sub = this.add.text(0, 60, subtitle, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#f4e4c1',
      fontStyle: 'italic'
    }).setOrigin(0.5).setAlpha(0.8);
    this.introContainer = this.add.container(cx, cy, [header, title, sub]);
    this.tweens.add({
      targets: this.introContainer,
      alpha: { from: 0, to: 1 },
      duration: 400,
      onComplete: () => {
        this.time.delayedCall(1500, () => {
          this.tweens.add({
            targets: this.introContainer,
            alpha: 0,
            duration: 400,
            onComplete: () => {
              this.introContainer?.destroy();
              this.introContainer = undefined;
            }
          });
        });
      }
    });
  }

  private showCheckpointFlash() {
    if (this.checkpointText) this.checkpointText.destroy();
    this.checkpointText = this.add.text(GAME_WIDTH / 2, 300, getString('checkpoint.title'), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '36px',
      color: '#d4a04c'
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({
      targets: this.checkpointText,
      alpha: { from: 0, to: 1 },
      duration: 300,
      yoyo: true,
      hold: 1200,
      onComplete: () => {
        this.checkpointText?.destroy();
        this.checkpointText = undefined;
      }
    });
  }
}
