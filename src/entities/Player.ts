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

export class Player extends Phaser.Physics.Arcade.Sprite {
  private lastFireMs = 0;
  private invulnUntilMs = 0;
  lives = PLAYER_LIVES;
  onDeath?: () => void;
  onDamage?: (livesLeft: number) => void;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }

  tick(time: number, input: InputManager, bullets: BulletGroup) {
    const left = input.isPressed(Action.MOVE_LEFT);
    const right = input.isPressed(Action.MOVE_RIGHT);
    let vx = 0;
    if (left) vx -= PLAYER_SPEED;
    if (right) vx += PLAYER_SPEED;
    this.setVelocityX(vx);

    if (input.isPressed(Action.FIRE) && time - this.lastFireMs >= PLAYER_FIRE_COOLDOWN_MS) {
      bullets.fireFrom(this.x, this.y - this.height / 2, -1);
      this.lastFireMs = time;
    }

    if (this.invulnUntilMs > 0) {
      if (time >= this.invulnUntilMs) {
        this.invulnUntilMs = 0;
        this.setAlpha(1);
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
    this.onDamage?.(this.lives);
    if (this.lives <= 0) {
      this.onDeath?.();
    }
    return true;
  }
}
