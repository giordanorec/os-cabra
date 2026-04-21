import * as Phaser from 'phaser';
import { Enemy } from '../Enemy';

const INITIAL_SPEED = 80;
const TARGET_SPEED = 360;
const ACCEL_MS = 600;

// Urubu do Capibaribe: kamikaze. Entra do topo, trava direção no vetor para
// o player no momento do spawn, acelera nessa linha. Não faz tracking depois
// do lock — senão vira aim-bot. Dano só por colisão.
export class UrubuCapibaribe extends Enemy {
  private readonly dirX: number;
  private readonly dirY: number;
  private readonly spawnTime: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    target: Phaser.GameObjects.Sprite,
    onDeath: (enemy: Enemy) => void
  ) {
    // Urubu é 56×44 triângulo — scale 1.7 → 95×75 (~12-16% área).
    super(scene, x, y, { hp: 1, points: 150, texture: 'enemy-urubu', scale: 1.7, onDeath });
    const dx = target.x - x;
    const dy = Math.max(60, target.y - y);
    const mag = Math.hypot(dx, dy) || 1;
    this.dirX = dx / mag;
    this.dirY = dy / mag;
    this.spawnTime = scene.time.now;
    this.setVelocity(this.dirX * INITIAL_SPEED, this.dirY * INITIAL_SPEED);
    const angle = Math.atan2(this.dirY, this.dirX);
    this.setRotation(angle - Math.PI / 2);
  }

  protected override onTick(time: number, _delta: number) {
    const t = Math.min(1, (time - this.spawnTime) / ACCEL_MS);
    const speed = INITIAL_SPEED + (TARGET_SPEED - INITIAL_SPEED) * t;
    this.setVelocity(this.dirX * speed, this.dirY * speed);
  }
}
