import * as Phaser from 'phaser';
import { DEPTH, GAME_HEIGHT, GAME_WIDTH } from '../config';

// Projétil de inimigo com homing fraco: rastreia o alvo por `trackingMs` ms
// girando a direção até `turnRateDegPerSec` graus/segundo. Após o tracking
// expirar, vira projétil balístico normal.
export class HomingEnemyBullet extends Phaser.Physics.Arcade.Sprite {
  private speed = 0;
  private target: Phaser.GameObjects.Sprite | null = null;
  private trackingUntilMs = 0;
  private turnRateRadPerMs = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.setDepth(DEPTH.ENEMY_BULLET);
  }

  fire(
    x: number,
    y: number,
    speed: number,
    initialVx: number,
    initialVy: number,
    target: Phaser.GameObjects.Sprite,
    trackingMs: number,
    turnRateDegPerSec: number
  ) {
    this.enableBody(true, x, y, true, true);
    this.speed = speed;
    this.target = target;
    this.trackingUntilMs = this.scene.time.now + trackingMs;
    this.turnRateRadPerMs = Phaser.Math.DegToRad(turnRateDegPerSec) / 1000;
    const mag = Math.hypot(initialVx, initialVy) || 1;
    this.setVelocity((initialVx / mag) * speed, (initialVy / mag) * speed);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (this.target && time < this.trackingUntilMs) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      const currentAngle = Math.atan2(body.velocity.y, body.velocity.x);
      const desiredAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
      let diff = Phaser.Math.Angle.Wrap(desiredAngle - currentAngle);
      const maxTurn = this.turnRateRadPerMs * delta;
      if (diff > maxTurn) diff = maxTurn;
      else if (diff < -maxTurn) diff = -maxTurn;
      const newAngle = currentAngle + diff;
      body.setVelocity(Math.cos(newAngle) * this.speed, Math.sin(newAngle) * this.speed);
    }
    if (this.x < -40 || this.x > GAME_WIDTH + 40 || this.y > GAME_HEIGHT + 40 || this.y < -40) {
      this.disableBody(true, true);
    }
  }
}

export class HomingEnemyBulletGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene, texture: string, max = 16) {
    super(scene.physics.world, scene, {
      classType: HomingEnemyBullet,
      defaultKey: texture,
      maxSize: max,
      runChildUpdate: true
    });
  }

  fireHoming(
    x: number,
    y: number,
    speed: number,
    initialVx: number,
    initialVy: number,
    target: Phaser.GameObjects.Sprite,
    trackingMs: number,
    turnRateDegPerSec: number
  ): HomingEnemyBullet | null {
    const b = this.get(x, y) as HomingEnemyBullet | null;
    if (!b) return null;
    b.fire(x, y, speed, initialVx, initialVy, target, trackingMs, turnRateDegPerSec);
    return b;
  }
}
