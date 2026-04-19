import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { Player } from '../entities/Player';
import { BulletGroup } from '../entities/Bullet';
import { Enemy } from '../entities/Enemy';
import { InputManager } from '../systems/InputManager';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private playerBullets!: BulletGroup;
  private enemy!: Enemy;
  private inputManager!: InputManager;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.inputManager = new InputManager(this);

    this.player = new Player(this, GAME_WIDTH / 2, GAME_HEIGHT - 60);
    this.playerBullets = new BulletGroup(this, 'bullet-player', 32);

    this.enemy = new Enemy(this, GAME_WIDTH / 2, 120, {
      hp: 3,
      points: 100,
      texture: 'enemy-static',
      onDeath: (points) => this.onEnemyDeath(points)
    });

    this.physics.add.overlap(this.enemy, this.playerBullets, (enemyObj, bulletObj) => {
      const bullet = bulletObj as Phaser.Physics.Arcade.Sprite;
      const enemy = enemyObj as Enemy;
      if (!bullet.active || !enemy.active) return;
      bullet.disableBody(true, true);
      enemy.takeHit(1);
    });

    this.scoreText = this.add.text(20, 12, this.formatScore(), {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#f4e4c1'
    }).setDepth(100);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 18, '[SETAS] move  [ESPAÇO] atira', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#7a6850'
    }).setOrigin(0.5, 1);
  }

  override update(time: number, _delta: number) {
    this.player.tick(time, this.inputManager, this.playerBullets);
  }

  private onEnemyDeath(points: number) {
    this.score += points;
    this.scoreText.setText(this.formatScore());
    this.time.delayedCall(400, () => this.respawnEnemy());
  }

  private formatScore(): string {
    return `SCORE ${this.score.toString().padStart(6, '0')}`;
  }

  private respawnEnemy() {
    this.enemy.enableBody(true, GAME_WIDTH / 2, 120, true, true);
    this.enemy.hp = 3;
  }
}
