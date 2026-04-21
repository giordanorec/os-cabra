import * as Phaser from 'phaser';
import {
  DEPTH,
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_SPEED,
  PLAYER_FIRE_COOLDOWN_MS,
  PLAYER_LIVES,
  PLAYER_INVULN_MS,
  PLAYER_BLINK_HZ
} from '../config';
import { Action, InputManager } from '../systems/InputManager';
import { BulletGroup } from './Bullet';
import { PowerUpType } from './PowerUp';

const SHIELD_ORBIT_RADIUS = 38;
const SHIELD_ORBIT_RAD_PER_MS = Phaser.Math.DegToRad(120) / 1000;

// Folgas das bordas do canvas — HUD fica sempre visível (80px top/bottom).
const BOUND_MARGIN_X = 32;
const BOUND_MARGIN_Y = 80;
const MIN_X = BOUND_MARGIN_X;
const MAX_X = GAME_WIDTH - BOUND_MARGIN_X;
const MIN_Y = BOUND_MARGIN_Y;
const MAX_Y = GAME_HEIGHT - BOUND_MARGIN_Y;
const INV_SQRT2 = 1 / Math.SQRT2;

export class Player extends Phaser.Physics.Arcade.Sprite {
  private lastFireMs = 0;
  private invulnUntilMs = 0;
  lives = PLAYER_LIVES;
  hasShield = false;
  private shieldSprite?: Phaser.GameObjects.Sprite;
  onDeath?: () => void;
  onDamage?: (livesLeft: number) => void;
  onFire?: (x: number, y: number) => void;
  onShieldBreak?: (x: number, y: number) => void;
  onPowerUpCollected?: (type: PowerUpType) => void;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    // player.png é 128×128. Polish visual: escala 1.0 (128px ≈ 21% da altura)
    // pra dar presença visual no meio do cenário denso.
    this.setScale(1.0);
    // Hitbox proporcional ~75% do sprite.
    const body = this.body as Phaser.Physics.Arcade.Body | null;
    if (body) body.setSize(96, 96).setOffset(16, 24);
    this.setDepth(DEPTH.PLAYER);
    // Bob sutil — dá "vida" ao sprite parado e destaca sobre o background.
    scene.tweens.add({
      targets: this,
      scaleX: { from: 1.0, to: 1.04 },
      scaleY: { from: 1.0, to: 0.96 },
      duration: 520,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  tick(time: number, input: InputManager, bullets: BulletGroup) {
    const left = input.isPressed(Action.MOVE_LEFT);
    const right = input.isPressed(Action.MOVE_RIGHT);
    const up = input.isPressed(Action.MOVE_UP);
    const down = input.isPressed(Action.MOVE_DOWN);
    let vx = 0;
    let vy = 0;
    if (left) vx -= 1;
    if (right) vx += 1;
    if (up) vy -= 1;
    if (down) vy += 1;
    // Normaliza diagonal pra não exceder PLAYER_SPEED no vetor resultante.
    if (vx !== 0 && vy !== 0) {
      vx *= INV_SQRT2;
      vy *= INV_SQRT2;
    }
    this.setVelocity(vx * PLAYER_SPEED, vy * PLAYER_SPEED);

    // Clamp de posição (bounds customizados: 32..768 x 80..520). setCollideWorldBounds
    // não serve aqui porque usa o world bounds inteiro (0..800 x 0..600) e a margem
    // de HUD é específica deste player.
    if (this.x < MIN_X) this.x = MIN_X;
    else if (this.x > MAX_X) this.x = MAX_X;
    if (this.y < MIN_Y) this.y = MIN_Y;
    else if (this.y > MAX_Y) this.y = MAX_Y;

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
      } else {
        const blinkPeriodMs = 1000 / PLAYER_BLINK_HZ;
        const phase = Math.floor((this.invulnUntilMs - time) / (blinkPeriodMs / 2)) % 2;
        this.setAlpha(phase === 0 ? 1 : 0.3);
      }
    }

    if (this.shieldSprite) {
      const angle = time * SHIELD_ORBIT_RAD_PER_MS;
      this.shieldSprite.x = this.x + Math.cos(angle) * SHIELD_ORBIT_RADIUS;
      this.shieldSprite.y = this.y + Math.sin(angle) * SHIELD_ORBIT_RADIUS;
      this.shieldSprite.setRotation(angle + Math.PI / 2);
    }
  }

  isInvulnerable(time: number): boolean {
    return time < this.invulnUntilMs;
  }

  takeDamage(time: number): boolean {
    if (this.isInvulnerable(time)) return false;
    if (this.hasShield) {
      this.breakShield();
      this.invulnUntilMs = time + PLAYER_INVULN_MS;
      return true;
    }
    this.lives -= 1;
    this.invulnUntilMs = time + PLAYER_INVULN_MS;
    this.onDamage?.(this.lives);
    if (this.lives <= 0) {
      this.onDeath?.();
    }
    return true;
  }

  applyPowerUp(type: PowerUpType) {
    this.onPowerUpCollected?.(type);
    if (type === 'sombrinha') {
      this.enableShield();
    }
    // outros tipos: no-op por enquanto (implementação futura)
  }

  private enableShield() {
    if (this.shieldSprite) this.shieldSprite.destroy();
    this.hasShield = true;
    this.shieldSprite = this.scene.add.sprite(this.x, this.y - SHIELD_ORBIT_RADIUS, 'powerup-sombrinha');
    this.shieldSprite.setDepth(DEPTH.PLAYER + 1);
    this.shieldSprite.setScale(0.6);
  }

  private breakShield() {
    this.hasShield = false;
    const sx = this.shieldSprite?.x ?? this.x;
    const sy = this.shieldSprite?.y ?? this.y;
    this.shieldSprite?.destroy();
    this.shieldSprite = undefined;
    this.onShieldBreak?.(sx, sy);
  }
}
