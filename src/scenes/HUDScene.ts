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
  private bossHpBg?: Phaser.GameObjects.Rectangle;
  private bossHpFill?: Phaser.GameObjects.Rectangle;
  private bossIntroContainer?: Phaser.GameObjects.Container;
  private bossPhaseLabel?: Phaser.GameObjects.Text;
  private bossDefeatedContainer?: Phaser.GameObjects.Container;

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
    game.events.on('hud-boss-intro', (name: string, epithet: string) => this.showBossIntro(name, epithet));
    game.events.on('hud-boss-hp', (hp: number, hpMax: number) => this.updateBossHp(hp, hpMax));
    game.events.on('hud-boss-phase', (label: string) => this.showBossPhaseLabel(label));
    game.events.on('hud-boss-defeated', (bonus: number, lives: number, total: number) =>
      this.showBossDefeated(bonus, lives, total)
    );
    game.events.on('hud-boss-hide', () => this.hideBossHp());
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

  private showBossIntro(name: string, epithet: string) {
    if (this.bossIntroContainer) this.bossIntroContainer.destroy();
    const cx = GAME_WIDTH / 2;
    const oxe = this.add.text(0, -100, getString('boss.appear'), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '120px',
      color: '#b84a2e',
      stroke: '#1a0f08',
      strokeThickness: 6
    }).setOrigin(0.5);
    const bar = this.add.rectangle(0, -20, 400, 2, 0xb84a2e).setOrigin(0.5);
    const bossName = this.add.text(0, 20, name, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '44px',
      color: '#f4e4c1'
    }).setOrigin(0.5);
    const ep = this.add.text(0, 70, epithet, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#d4a04c',
      fontStyle: 'italic'
    }).setOrigin(0.5);
    const bar2 = this.add.rectangle(0, 110, 400, 2, 0xb84a2e).setOrigin(0.5);
    this.bossIntroContainer = this.add.container(cx, 300, [oxe, bar, bossName, ep, bar2]).setAlpha(0);
    this.tweens.add({
      targets: this.bossIntroContainer,
      alpha: { from: 0, to: 1 },
      duration: 300,
      onComplete: () => {
        this.time.delayedCall(1200, () => {
          this.tweens.add({
            targets: this.bossIntroContainer,
            alpha: 0,
            duration: 300,
            onComplete: () => {
              this.bossIntroContainer?.destroy();
              this.bossIntroContainer = undefined;
            }
          });
        });
      }
    });
    this.cameras.main.shake(400, 0.005);
    this.showBossHp();
  }

  private showBossHp() {
    if (!this.bossHpBg) {
      this.bossHpBg = this.add.rectangle(GAME_WIDTH / 2, 560, 600, 20, 0x1a0f08, 1)
        .setStrokeStyle(2, 0xf4e4c1);
      this.bossHpFill = this.add.rectangle(GAME_WIDTH / 2 - 298, 560, 596, 16, 0xb84a2e)
        .setOrigin(0, 0.5);
    }
    this.bossHpBg.setVisible(true);
    this.bossHpFill?.setVisible(true);
  }

  private updateBossHp(hp: number, hpMax: number) {
    if (!this.bossHpFill) return;
    const ratio = Math.max(0, hp / hpMax);
    this.bossHpFill.width = 596 * ratio;
  }

  private hideBossHp() {
    this.bossHpBg?.setVisible(false);
    this.bossHpFill?.setVisible(false);
  }

  private showBossPhaseLabel(label: string) {
    if (this.bossPhaseLabel) this.bossPhaseLabel.destroy();
    this.bossPhaseLabel = this.add.text(GAME_WIDTH / 2, 300, label, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '44px',
      color: '#d4a04c',
      stroke: '#1a0f08',
      strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({
      targets: this.bossPhaseLabel,
      alpha: { from: 0, to: 1 },
      scale: { from: 1.3, to: 1 },
      duration: 300,
      ease: 'Back.easeOut',
      yoyo: true,
      hold: 600,
      onComplete: () => {
        this.bossPhaseLabel?.destroy();
        this.bossPhaseLabel = undefined;
      }
    });
    this.cameras.main.flash(120, 255, 255, 255);
  }

  private showBossDefeated(bonus: number, lives: number, total: number) {
    if (this.bossDefeatedContainer) this.bossDefeatedContainer.destroy();
    const cx = GAME_WIDTH / 2;
    const seFoi = this.add.text(0, -80, getString('boss.defeated'), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '96px',
      color: '#5a7a3a',
      stroke: '#1a0f08',
      strokeThickness: 6
    }).setOrigin(0.5);
    const bonusLine = this.add.text(0, 20, `${getString('boss.bonus_label')}:  +${bonus}`, {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#f4e4c1'
    }).setOrigin(0.5);
    const livesLine = this.add.text(0, 55, `${getString('boss.lives_label')}: ${lives} × 1000 = +${lives * 1000}`, {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#f4e4c1'
    }).setOrigin(0.5);
    const totalLine = this.add.text(0, 100, `${getString('boss.total_label')}: +${total}`, {
      fontFamily: 'Arial Black, monospace',
      fontSize: '26px',
      color: '#d4a04c'
    }).setOrigin(0.5);
    this.bossDefeatedContainer = this.add.container(cx, 300, [seFoi, bonusLine, livesLine, totalLine]).setAlpha(0);
    this.tweens.add({
      targets: this.bossDefeatedContainer,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.8, to: 1 },
      duration: 500,
      ease: 'Back.easeOut'
    });
    this.cameras.main.flash(150, 255, 255, 255);
    this.cameras.main.shake(500, 0.008);
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
