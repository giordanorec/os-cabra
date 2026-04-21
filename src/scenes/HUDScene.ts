import * as Phaser from 'phaser';
import { DEPTH, GAME_WIDTH, PLAYER_LIVES, CHAIN_MULTIPLIER } from '../config';
import { getString } from '../strings';
import { FONTS } from '../fonts';

const HUD_DEPTH = DEPTH.HUD;
const OVERLAY_DEPTH = DEPTH.HUD_OVERLAY;

export class HUDScene extends Phaser.Scene {
  private lifeIcons: Phaser.GameObjects.Image[] = [];
  private lifeSlots: Phaser.GameObjects.Rectangle[] = [];
  private scoreValue!: Phaser.GameObjects.Text;
  private multiplierText!: Phaser.GameObjects.Text;
  private multiplierCenter!: Phaser.GameObjects.Text;
  private multiplierCenterPulse?: Phaser.Tweens.Tween;
  private multiplierTween?: Phaser.Tweens.Tween;
  private phaseGroup: Phaser.GameObjects.GameObject[] = [];
  private checkpointText?: Phaser.GameObjects.Text;
  private bossHpBg?: Phaser.GameObjects.Rectangle;
  private bossHpFill?: Phaser.GameObjects.Rectangle;
  private bossIntroGroup: Phaser.GameObjects.GameObject[] = [];
  private bossPhaseLabel?: Phaser.GameObjects.Text;
  private bossDefeatedGroup: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super({ key: 'HUDScene' });
  }

  create() {
    // Backdrop da faixa HUD: rect escuro no topo pra garantir contraste do texto
    // sobre qualquer cenário (pivot polish 2026-04-21 — usuário reclamou de HUD
    // "cortado, sem contraste"). Depth abaixo dos widgets mas no HUDScene inteiro
    // está acima do GameScene por ordem de launch.
    this.add.rectangle(GAME_WIDTH / 2, 26, GAME_WIDTH, 52, 0x1a0f08, 0.6)
      .setDepth(HUD_DEPTH - 1);
    // Backdrop do hint inferior (mesma lógica).
    this.add.rectangle(GAME_WIDTH / 2, 600 - 12, GAME_WIDTH, 24, 0x1a0f08, 0.55)
      .setDepth(HUD_DEPTH - 1);

    for (let i = 0; i < PLAYER_LIVES; i++) {
      const x = 20 + i * 34 + 12;
      const slot = this.add.rectangle(x, 26, 28, 28, 0xb84a2e, 0.35)
        .setStrokeStyle(2, 0xf0c840, 0.75)
        .setDepth(HUD_DEPTH);
      const icon = this.add.image(x, 26, 'ui-life-icon')
        .setDepth(HUD_DEPTH + 1)
        .setTint(0xffffff);
      this.lifeSlots.push(slot);
      this.lifeIcons.push(icon);
    }

    this.add.text(300, 12, getString('hud.score_label'), {
      fontFamily: FONTS.BODY,
      fontSize: '14px',
      color: '#f4e4c1',
      stroke: '#1a0f08',
      strokeThickness: 2
    }).setDepth(HUD_DEPTH);

    this.scoreValue = this.add.text(360, 4, '000000', {
      fontFamily: FONTS.MONO,
      fontSize: '28px',
      color: '#fff2cc',
      fontStyle: 'bold',
      stroke: '#1a0f08',
      strokeThickness: 3,
      shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 2, fill: true }
    }).setDepth(HUD_DEPTH);

    this.multiplierText = this.add.text(540, 8, '×1.5', {
      fontFamily: FONTS.DISPLAY,
      fontSize: '22px',
      color: '#f0c840',
      stroke: '#1a0f08',
      strokeThickness: 3
    }).setVisible(false).setDepth(HUD_DEPTH);

    // Multiplier central (top-center) — pulso suave enquanto chain ativo.
    this.multiplierCenter = this.add.text(GAME_WIDTH / 2, 44, `×${CHAIN_MULTIPLIER}`, {
      fontFamily: FONTS.DISPLAY,
      fontSize: '32px',
      color: '#f0c840',
      stroke: '#2a2540',
      strokeThickness: 4
    }).setOrigin(0.5).setVisible(false).setDepth(HUD_DEPTH);

    this.add.text(GAME_WIDTH / 2, 600 - 12, getString('controls.hint'), {
      fontFamily: FONTS.MONO,
      fontSize: '12px',
      color: '#f4e4c1',
      stroke: '#1a0f08',
      strokeThickness: 2
    }).setOrigin(0.5, 0.5).setDepth(HUD_DEPTH);

    const game = this.scene.get('GameScene');
    game.events.on('hud-lives', (lives: number) => this.setLives(lives));
    game.events.on('hud-score', (score: number, mult: boolean) => this.setScore(score, mult));
    game.events.on('hud-phase-intro', (name: string, subtitle: string, num: number) =>
      this.showPhaseIntro(name, subtitle, num)
    );
    game.events.on('hud-checkpoint', () => this.showCheckpointFlash());
    game.events.on('hud-boss-intro', (name: string, epithet: string) => this.showBossIntro(name, epithet));
    game.events.on('hud-boss-hp', (hp: number, hpMax: number) => this.updateBossHp(hp, hpMax));
    game.events.on('hud-boss-phase', (label: string) => this.showBossPhaseLabel(label));
    game.events.on('hud-boss-defeated', (bonus: number, lives: number, total: number) =>
      this.showBossDefeated(bonus, lives, total)
    );
    game.events.on('hud-boss-hide', () => this.hideBossHp());
    game.events.on('hud-chain', (multiplier: number, active: boolean) =>
      this.setChainMultiplier(multiplier, active)
    );
    game.events.on('hud-milestone', (ms: number) => this.showMilestone(ms));
    game.events.on('hud-pickup-text', (type: string) => this.showPickupText(type));
  }

  private setChainMultiplier(multiplier: number, active: boolean) {
    if (active) {
      this.multiplierCenter.setText(`×${multiplier}`);
      if (!this.multiplierCenter.visible) {
        this.multiplierCenter.setVisible(true).setAlpha(0).setScale(1.4);
        this.tweens.add({
          targets: this.multiplierCenter,
          alpha: 1,
          scale: 1,
          duration: 250,
          ease: 'Back.easeOut',
          onComplete: () => {
            this.multiplierCenterPulse = this.tweens.add({
              targets: this.multiplierCenter,
              scale: 1.08,
              duration: 450,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            });
          }
        });
      }
    } else if (this.multiplierCenter.visible) {
      this.multiplierCenterPulse?.stop();
      this.multiplierCenterPulse = undefined;
      this.tweens.add({
        targets: this.multiplierCenter,
        alpha: 0,
        duration: 250,
        onComplete: () => this.multiplierCenter.setVisible(false)
      });
    }
  }

  private showMilestone(ms: number) {
    const key = ms >= 100_000
      ? 'feedback.milestone_100k'
      : ms >= 50_000
      ? 'feedback.milestone_50k'
      : 'feedback.milestone_10k';
    const label = this.add.text(GAME_WIDTH / 2, 300, getString(key), {
      fontFamily: FONTS.DISPLAY,
      fontSize: '56px',
      color: '#f0c840',
      stroke: '#2a2540',
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(OVERLAY_DEPTH).setAlpha(0).setScale(0.6);
    this.tweens.add({
      targets: label,
      alpha: 1,
      scale: 1,
      duration: 400,
      ease: 'Back.easeOut',
      hold: 400,
      yoyo: true,
      onComplete: () => label.destroy()
    });
    this.cameras.main.flash(120, 240, 200, 64);
  }

  private showPickupText(type: string) {
    const key = type === 'sombrinha' ? 'pickup.arretado' : 'pickup.visse';
    const txt = this.add.text(GAME_WIDTH / 2, 200, getString(key), {
      fontFamily: FONTS.DISPLAY,
      fontSize: '40px',
      color: '#f0c840',
      stroke: '#2a2540',
      strokeThickness: 5
    }).setOrigin(0.5).setDepth(OVERLAY_DEPTH).setAlpha(0).setScale(0.6);
    this.tweens.add({
      targets: txt,
      alpha: 1,
      scale: 1,
      duration: 250,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: txt,
          alpha: 0,
          y: 170,
          duration: 600,
          delay: 400,
          onComplete: () => txt.destroy()
        });
      }
    });
  }

  private setLives(lives: number) {
    this.lifeIcons.forEach((icon, i) => {
      icon.setVisible(i < lives);
    });
  }

  private setScore(score: number, multiplierActive: boolean) {
    this.scoreValue.setText(score.toString().padStart(6, '0'));
    if (multiplierActive && !this.multiplierText.visible) {
      this.multiplierText.setVisible(true).setScale(1.4);
      this.multiplierTween?.stop();
      this.tweens.add({
        targets: this.multiplierText,
        scale: 1,
        duration: 200,
        ease: 'Back.easeOut',
        onComplete: () => {
          this.multiplierTween = this.tweens.add({
            targets: this.multiplierText,
            scale: 1.06,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });
        }
      });
    } else if (!multiplierActive && this.multiplierText.visible) {
      this.multiplierTween?.stop();
      this.multiplierText.setVisible(false);
    }
  }

  private clearGroup(group: Phaser.GameObjects.GameObject[]) {
    for (const g of group) g.destroy();
    group.length = 0;
  }

  private showPhaseIntro(name: string, subtitle: string, num: number) {
    this.clearGroup(this.phaseGroup);
    const cx = GAME_WIDTH / 2;
    const panel = this.add.rectangle(cx, 300, 620, 180, 0x1a0f08, 0.7)
      .setDepth(OVERLAY_DEPTH - 1).setAlpha(0);
    this.phaseGroup.push(panel);
    const header = this.add.text(cx, 240, getString('stage.header', num), {
      fontFamily: FONTS.MONO,
      fontSize: '20px',
      color: '#d4a04c'
    }).setOrigin(0.5).setDepth(OVERLAY_DEPTH).setAlpha(0);
    const title = this.add.text(cx, 300, name, {
      fontFamily: FONTS.DISPLAY,
      fontSize: '64px',
      color: '#f4e4c1'
    }).setOrigin(0.5).setDepth(OVERLAY_DEPTH).setAlpha(0);
    const sub = this.add.text(cx, 360, subtitle, {
      fontFamily: FONTS.BODY,
      fontSize: '18px',
      color: '#f4e4c1',
      fontStyle: 'italic'
    }).setOrigin(0.5).setDepth(OVERLAY_DEPTH).setAlpha(0);
    this.phaseGroup = [panel, header, title, sub];
    this.tweens.add({
      targets: this.phaseGroup,
      alpha: 1,
      duration: 300,
      onComplete: () => {
        this.time.delayedCall(1500, () => {
          this.tweens.add({
            targets: this.phaseGroup,
            alpha: 0,
            duration: 400,
            onComplete: () => this.clearGroup(this.phaseGroup)
          });
        });
      }
    });
  }

  private showBossIntro(name: string, epithet: string) {
    this.clearGroup(this.bossIntroGroup);
    const cx = GAME_WIDTH / 2;
    const oxe = this.add.text(cx, 200, getString('boss.appear'), {
      fontFamily: FONTS.DISPLAY,
      fontSize: '120px',
      color: '#b84a2e',
      stroke: '#2a2540',
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(OVERLAY_DEPTH).setAlpha(0).setScale(2);
    const bar1 = this.add.rectangle(cx, 280, 400, 2, 0xb84a2e).setDepth(OVERLAY_DEPTH).setAlpha(0);
    const bossName = this.add.text(cx, 320, name, {
      fontFamily: FONTS.DISPLAY,
      fontSize: '44px',
      color: '#f4e4c1'
    }).setOrigin(0.5).setDepth(OVERLAY_DEPTH).setAlpha(0);
    const ep = this.add.text(cx, 370, epithet, {
      fontFamily: FONTS.BODY,
      fontSize: '18px',
      color: '#d4a04c',
      fontStyle: 'italic'
    }).setOrigin(0.5).setDepth(OVERLAY_DEPTH).setAlpha(0);
    const bar2 = this.add.rectangle(cx, 410, 400, 2, 0xb84a2e).setDepth(OVERLAY_DEPTH).setAlpha(0);
    this.bossIntroGroup = [oxe, bar1, bossName, ep, bar2];
    this.tweens.add({ targets: oxe, alpha: 1, scale: 1, duration: 300, ease: 'Back.easeOut' });
    this.tweens.add({ targets: [bar1, bar2, bossName, ep], alpha: 1, duration: 300, delay: 200 });
    this.time.delayedCall(1500, () => {
      this.tweens.add({
        targets: this.bossIntroGroup,
        alpha: 0,
        duration: 300,
        onComplete: () => this.clearGroup(this.bossIntroGroup)
      });
    });
    this.cameras.main.shake(400, 0.005);
    this.showBossHp();
  }

  private showBossHp() {
    if (!this.bossHpBg) {
      this.bossHpBg = this.add.rectangle(GAME_WIDTH / 2, 560, 600, 20, 0x2a2540, 1)
        .setStrokeStyle(2, 0xf4e4c1)
        .setDepth(HUD_DEPTH);
      this.bossHpFill = this.add.rectangle(GAME_WIDTH / 2 - 298, 560, 596, 16, 0xb84a2e)
        .setOrigin(0, 0.5)
        .setDepth(HUD_DEPTH + 1);
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
    this.bossPhaseLabel?.destroy();
    this.bossPhaseLabel = this.add.text(GAME_WIDTH / 2, 300, label, {
      fontFamily: FONTS.DISPLAY,
      fontSize: '44px',
      color: '#d4a04c',
      stroke: '#2a2540',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(OVERLAY_DEPTH).setAlpha(0).setScale(1.3);
    this.tweens.add({
      targets: this.bossPhaseLabel,
      alpha: 1,
      scale: 1,
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
    this.clearGroup(this.bossDefeatedGroup);
    const cx = GAME_WIDTH / 2;
    const seFoi = this.add.text(cx, 240, getString('boss.defeated'), {
      fontFamily: FONTS.DISPLAY,
      fontSize: '96px',
      color: '#5a7a3a',
      stroke: '#2a2540',
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(OVERLAY_DEPTH).setAlpha(0).setScale(0);
    const bonusLine = this.add.text(cx, 320, `${getString('boss.bonus_label')}:  +${bonus}`, {
      fontFamily: FONTS.MONO,
      fontSize: '22px',
      color: '#f4e4c1'
    }).setOrigin(0.5).setDepth(OVERLAY_DEPTH).setAlpha(0);
    const livesLine = this.add.text(
      cx,
      355,
      `${getString('boss.lives_label')}: ${lives} × 1000 = +${lives * 1000}`,
      { fontFamily: FONTS.MONO, fontSize: '18px', color: '#f4e4c1' }
    ).setOrigin(0.5).setDepth(OVERLAY_DEPTH).setAlpha(0);
    const totalLine = this.add.text(cx, 400, `${getString('boss.total_label')}: +${total}`, {
      fontFamily: FONTS.MONO,
      fontSize: '26px',
      color: '#d4a04c',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(OVERLAY_DEPTH).setAlpha(0);
    this.bossDefeatedGroup = [seFoi, bonusLine, livesLine, totalLine];
    this.tweens.add({ targets: seFoi, alpha: 1, scale: 1, duration: 500, ease: 'Back.easeOut' });
    this.tweens.add({ targets: [bonusLine, livesLine, totalLine], alpha: 1, duration: 400, delay: 400 });
    this.cameras.main.flash(150, 255, 255, 255);
    this.cameras.main.shake(500, 0.008);
  }

  private showCheckpointFlash() {
    this.checkpointText?.destroy();
    this.checkpointText = this.add.text(GAME_WIDTH / 2, 300, getString('checkpoint.title'), {
      fontFamily: FONTS.DISPLAY,
      fontSize: '36px',
      color: '#d4a04c'
    }).setOrigin(0.5).setDepth(OVERLAY_DEPTH).setAlpha(0);
    this.tweens.add({
      targets: this.checkpointText,
      alpha: 1,
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
