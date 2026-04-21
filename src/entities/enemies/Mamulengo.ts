import * as Phaser from 'phaser';
import { Enemy } from '../Enemy';
import { HomingEnemyBulletGroup } from '../HomingEnemyBullet';

const DESCEND_SPEED_Y = 90;
const ANCHOR_Y = 120;
const LATERAL_AMPLITUDE = 100;
const LATERAL_PERIOD_MS = 4000;
const FIRE_INTERVAL_MS = 2000;
const BULLET_SPEED = 200;
const HOMING_TRACKING_MS = 2000;
const HOMING_TURN_DEG_PER_SEC = 60;

export interface MamulengoParams {
  // sem params por enquanto — movimento é determinístico pela âncora
}

// Mamulengo: boneco de mão estacionário. Desce, ancora em y=120 e faz
// movimento lateral sine. Dispara "cabeça-projétil" com homing fraco.
export class Mamulengo extends Enemy {
  private readonly target: Phaser.GameObjects.Sprite;
  private readonly homingBullets: HomingEnemyBulletGroup;
  private anchored = false;
  private baseX: number;
  private anchorSpawnedAt = 0;
  private lastFireAt = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    homingBullets: HomingEnemyBulletGroup,
    target: Phaser.GameObjects.Sprite,
    _params: MamulengoParams,
    onDeath: (enemy: Enemy) => void
  ) {
    super(scene, x, y, { hp: 2, points: 200, texture: 'enemy-mamulengo', scale: 0.5, onDeath });
    this.baseX = x;
    this.target = target;
    this.homingBullets = homingBullets;
    this.setVelocity(0, DESCEND_SPEED_Y);
  }

  protected override onTick(time: number, _delta: number) {
    if (!this.anchored) {
      if (this.y >= ANCHOR_Y) {
        this.anchored = true;
        this.anchorSpawnedAt = time;
        this.lastFireAt = time;
        this.setVelocity(0, 0);
        this.y = ANCHOR_Y;
      }
      return;
    }
    const t = (time - this.anchorSpawnedAt) / LATERAL_PERIOD_MS;
    this.x = this.baseX + Math.sin(t * Math.PI * 2) * LATERAL_AMPLITUDE;

    if (time - this.lastFireAt >= FIRE_INTERVAL_MS) {
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      this.homingBullets.fireHoming(
        this.x,
        this.y + 18,
        BULLET_SPEED,
        dx,
        dy,
        this.target,
        HOMING_TRACKING_MS,
        HOMING_TURN_DEG_PER_SEC
      );
      this.lastFireAt = time;
    }
  }
}
