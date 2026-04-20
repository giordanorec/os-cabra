import * as Phaser from 'phaser';
import {
  PLAYER_SPEED,
  PLAYER_FIRE_COOLDOWN_MS,
  PLAYER_LIVES,
  PLAYER_INVULN_MS,
  PLAYER_BLINK_HZ
} from '../config';
import { Action, InputManager } from '../systems/InputManager';
import { BulletGroup } from './Bullet';

const BOB_AMP = 8;
const BOB_PERIOD_MS = 1200;

export class Player extends Phaser.Physics.Arcade.Sprite {
  private lastFireMs = 0;
  private invulnUntilMs = 0;
  private readonly baseY: number;
  private bobTween?: Phaser.Tweens.Tween;
  lives = PLAYER_LIVES;
  onDeath?: () => void;
  onDamage?: (livesLeft: number) => void;
  onFire?: (x: number, y: number) => void;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    // Sprite base 32×32 → 64×64 (≈10.7% da altura do game). Voltar pra 1x
    // quando Visual Designer empurrar assets já no tamanho 64-96px.
    this.setScale(2);
    this.baseY = y;
    this.startBob();
  }

  private startBob() {
    this.bobTween?.stop();
    this.bobTween = this.scene.tweens.add({
      targets: this,
      y: { from: this.baseY - BOB_AMP, to: this.baseY + BOB_AMP },
      duration: BOB_PERIOD_MS / 2,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  tick(time: number, input: InputManager, bullets: BulletGroup) {
    const left = input.isPressed(Action.MOVE_LEFT);
    const right = input.isPressed(Action.MOVE_RIGHT);
    let vx = 0;
    if (left) vx -= PLAYER_SPEED;
    if (right) vx += PLAYER_SPEED;
    this.setVelocityX(vx);

    if (input.isPressed(Action.FIRE) && time - this.lastFireMs >= PLAYER_FIRE_COOLDOWN_MS) {
      const by = this.y - this.height / 2;
      bullets.fireFrom(this.x, by, -1);
      this.onFire?.(this.x, by);
      this.lastFireMs = time;
    }

    if (this.invulnUntilMs > 0) {
      if (time >= this.invulnUntilMs) {
        this.invulnUntilMs = 0;
        this.setAlpha(1);
        if (this.bobTween && this.bobTween.isPaused()) this.bobTween.resume();
      } else {
        const blinkPeriodMs = 1000 / PLAYER_BLINK_HZ;
        const phase = Math.floor((this.invulnUntilMs - time) / (blinkPeriodMs / 2)) % 2;
        this.setAlpha(phase === 0 ? 1 : 0.3);
      }
    }
  }

  isInvulnerable(time: number): boolean {
    return time < this.invulnUntilMs;
  }

  takeDamage(time: number): boolean {
    if (this.isInvulnerable(time)) return false;
    this.lives -= 1;
    this.invulnUntilMs = time + PLAYER_INVULN_MS;
    // Trava o bob durante i-frames pra não conflitar com blink
    if (this.bobTween && !this.bobTween.isPaused()) {
      this.bobTween.pause();
      this.y = this.baseY;
    }
    this.onDamage?.(this.lives);
    if (this.lives <= 0) {
      this.onDeath?.();
    }
    return true;
  }
}
