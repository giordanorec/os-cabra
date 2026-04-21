import * as Phaser from 'phaser';
import { Enemy } from '../Enemy';
import { EnemyBulletGroup } from '../EnemyBullet';

const DESCEND_SPEED_Y = 70;
const ANCHOR_Y = 80;
const LATERAL_AMPLITUDE = 40;
const LATERAL_PERIOD_MS = 6000;
const BURST_INTERVAL_MS = 2500;
const BURST_COUNT = 3;
const BURST_SPACING_MS = 150;
const BULLET_SPEED = 180;
const SPREAD_DEG = 20;

// Papa-Figo: estacionário bio-orgânico. Desce até y=80, fica estacionário com
// oscilação lateral lenta. A cada 2.5s, rajada leque de 3 fígados.
export class PapaFigo extends Enemy {
  private readonly target: Phaser.GameObjects.Sprite;
  private readonly bullets: EnemyBulletGroup;
  private anchored = false;
  private baseX: number;
  private anchorSpawnedAt = 0;
  private lastBurstAt = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    bullets: EnemyBulletGroup,
    target: Phaser.GameObjects.Sprite,
    onDeath: (enemy: Enemy) => void
  ) {
    // Papa-Figo é 72×72 blob — scale 1.3 → 94px (~15% altura).
    super(scene, x, y, { hp: 4, points: 400, texture: 'enemy-papa-figo', scale: 1.3, onDeath });
    this.baseX = x;
    this.target = target;
    this.bullets = bullets;
    this.setVelocity(0, DESCEND_SPEED_Y);
  }

  protected override onTick(time: number, _delta: number) {
    if (!this.anchored) {
      if (this.y >= ANCHOR_Y) {
        this.anchored = true;
        this.anchorSpawnedAt = time;
        this.lastBurstAt = time - BURST_INTERVAL_MS + 1000; // primeiro tiro em 1s
        this.setVelocity(0, 0);
        this.y = ANCHOR_Y;
      }
      return;
    }
    const t = (time - this.anchorSpawnedAt) / LATERAL_PERIOD_MS;
    this.x = this.baseX + Math.sin(t * Math.PI * 2) * LATERAL_AMPLITUDE;

    if (time - this.lastBurstAt >= BURST_INTERVAL_MS) {
      this.fireBurst();
      this.lastBurstAt = time;
    }
  }

  private fireBurst() {
    const centerAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
    const spreadRad = Phaser.Math.DegToRad(SPREAD_DEG);
    for (let i = 0; i < BURST_COUNT; i++) {
      this.scene.time.delayedCall(i * BURST_SPACING_MS, () => {
        if (!this.active) return;
        const offset = (i - (BURST_COUNT - 1) / 2) * spreadRad;
        const angle = centerAngle + offset;
        const vx = Math.cos(angle) * BULLET_SPEED;
        const vy = Math.sin(angle) * BULLET_SPEED;
        const bullet = this.bullets.fireLinear(this.x, this.y + 20, vx, vy);
        if (bullet) {
          bullet.setTexture('enemy-bullet-figo');
          // Pulse visual: scale 1 ↔ 1.3 a cada 200ms
          this.scene.tweens.add({
            targets: bullet,
            scale: 1.3,
            duration: 200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });
        }
      });
    }
  }
}
