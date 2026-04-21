import * as Phaser from 'phaser';
import { DEPTH, GAME_HEIGHT, GAME_WIDTH } from '../config';

export interface EnemyConfig {
  hp: number;
  points: number;
  texture: string;
  scale?: number;
  onDeath?: (enemy: Enemy) => void;
}

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  hp: number;
  readonly points: number;
  private readonly onDeath?: (enemy: Enemy) => void;
  protected spawnedAt = 0;
  // Pivot juice 2026-04-21: inimigos cresceram 50% sobre o scale config de cada
  // subclasse — usuário reclamou "inimigos pequenos, sem impacto". baseScale é
  // o valor-alvo após spawn-jump; pulse idle yoyo gira em torno dele.
  protected baseScale: number;
  private idlePulseTween?: Phaser.Tweens.Tween;
  private hitPunchTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number, cfg: EnemyConfig) {
    super(scene, x, y, cfg.texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    this.hp = cfg.hp;
    this.points = cfg.points;
    this.onDeath = cfg.onDeath;
    this.setDepth(DEPTH.ENEMY);
    // Scale final de presença visual (10-15% altura = 60-90px). Cada subclasse
    // já passa o scale calibrado para seu sprite; aplicamos um bump universal
    // em quem não sobrescrever explicitamente.
    this.baseScale = cfg.scale ?? 3;
    // Spawn-jump: começa pequeno e invisível, cresce com Back.easeOut.
    this.setScale(this.baseScale * 0.3);
    this.setAlpha(0);
    scene.tweens.add({
      targets: this,
      alpha: 1,
      scaleX: this.baseScale,
      scaleY: this.baseScale,
      duration: 350,
      ease: 'Back.easeOut',
      onComplete: () => {
        if (!this.active) return;
        this.startIdlePulse();
      }
    });
  }

  private startIdlePulse() {
    this.idlePulseTween?.stop();
    this.idlePulseTween = this.scene.tweens.add({
      targets: this,
      scaleX: this.baseScale * 1.08,
      scaleY: this.baseScale * 1.08,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  takeHit(damage = 1): boolean {
    this.hp -= damage;
    this.flashHit();
    if (this.hp <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  private flashHit() {
    // Tint branco puro + punch scale — muito mais visível que o tint creme anterior.
    this.setTint(0xffffff);
    this.scene.time.delayedCall(120, () => {
      if (this.active) this.clearTint();
    });
    this.hitPunchTween?.stop();
    this.idlePulseTween?.pause();
    this.setScale(this.baseScale * 1.18);
    this.hitPunchTween = this.scene.tweens.add({
      targets: this,
      scaleX: this.baseScale,
      scaleY: this.baseScale,
      duration: 80,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        if (this.active) this.idlePulseTween?.resume();
      }
    });
  }

  private die() {
    this.idlePulseTween?.stop();
    this.hitPunchTween?.stop();
    this.disableBody(true, true);
    this.onDeath?.(this);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (!this.active) return;
    if (this.spawnedAt === 0) this.spawnedAt = time;
    this.onTick(time, delta);
    if (this.isOffscreen()) {
      this.idlePulseTween?.stop();
      this.disableBody(true, true);
    }
  }

  protected onTick(_time: number, _delta: number) {
    // override em subclasses
  }

  private isOffscreen(): boolean {
    return this.y > GAME_HEIGHT + 60 || this.x < -60 || this.x > GAME_WIDTH + 60;
  }
}
