import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { Player } from '../entities/Player';
import { BulletGroup } from '../entities/Bullet';
import { Enemy } from '../entities/Enemy';
import { EnemyBullet, EnemyBulletGroup } from '../entities/EnemyBullet';
import { InputManager } from '../systems/InputManager';
import { EnemySpawner } from '../systems/EnemySpawner';
import { ScoreManager, ScoreSnapshot } from '../systems/ScoreManager';
import { getString } from '../strings';

interface Checkpoint {
  waveIndex: number;
  lives: number;
  score: ScoreSnapshot;
}

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private playerBullets!: BulletGroup;
  private enemyBullets!: EnemyBulletGroup;
  private enemies!: Phaser.GameObjects.Group;
  private inputManager!: InputManager;
  private spawner!: EnemySpawner;
  private scoreManager!: ScoreManager;
  private checkpoint: Checkpoint | null = null;
  private ended = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.ended = false;
    this.inputManager = new InputManager(this);
    this.scoreManager = new ScoreManager();

    this.player = new Player(this, GAME_WIDTH / 2, GAME_HEIGHT - 60);
    this.playerBullets = new BulletGroup(this, 'bullet-player', 32);
    this.enemyBullets = new EnemyBulletGroup(this, 'enemy-bullet-flecha', 64);
    this.enemies = this.add.group({ runChildUpdate: false });

    this.player.onDamage = (lives) => {
      this.scoreManager.resetChain();
      this.events.emit('hud-lives', lives);
    };
    this.player.onDeath = () => this.endGame(false);

    this.scoreManager.onChange = (score, mult) => {
      this.events.emit('hud-score', score, mult);
    };

    this.spawner = new EnemySpawner(
      this,
      this.enemyBullets,
      {
        onEnemySpawned: (e) => this.onEnemySpawned(e),
        onEnemyKilled: (e) => this.onEnemyKilled(e),
        onCheckpoint: (waveIdx) => this.saveCheckpoint(waveIdx),
        onAllWavesCleared: () => this.endGame(true)
      },
      this.checkpoint?.waveIndex ?? 0
    );

    if (this.checkpoint) {
      this.player.lives = this.checkpoint.lives;
      this.scoreManager.restore(this.checkpoint.score);
    }

    this.registerPlayerVsEnemyBullets();

    this.scene.launch('HUDScene');
    this.time.delayedCall(50, () => {
      this.events.emit('hud-lives', this.player.lives);
      this.events.emit('hud-score', this.scoreManager.value, this.scoreManager.multiplierActive);
      this.events.emit('hud-phase-intro', getString('stage.1.name'), getString('stage.1.subtitle'), 1);
    });

    this.spawner.start();
  }

  override update(time: number, _delta: number) {
    if (this.ended) return;
    this.player.tick(time, this.inputManager, this.playerBullets);
    this.spawner.tick();
    this.scoreManager.tick(time);
  }

  private onEnemySpawned(enemy: Enemy) {
    this.enemies.add(enemy);
    this.physics.add.overlap(enemy, this.playerBullets, (enemyObj, bulletObj) => {
      const bullet = bulletObj as Phaser.Physics.Arcade.Sprite;
      const e = enemyObj as Enemy;
      if (!bullet.active || !e.active) return;
      bullet.disableBody(true, true);
      e.takeHit(1);
    });
    this.physics.add.overlap(this.player, enemy, (_p, enemyObj) => {
      const e = enemyObj as Enemy;
      if (!e.active) return;
      if (this.player.takeDamage(this.time.now)) {
        e.takeHit(99); // colisão mata o inimigo (exceto boss — fica pra M3)
      }
    });
  }

  private onEnemyKilled(enemy: Enemy) {
    this.scoreManager.registerKill(enemy.points, this.time.now);
  }

  private saveCheckpoint(waveIndex: number) {
    this.checkpoint = {
      waveIndex: waveIndex + 1,
      lives: this.player.lives,
      score: this.scoreManager.snapshot()
    };
    this.events.emit('hud-checkpoint');
  }

  private registerPlayerVsEnemyBullets() {
    this.physics.add.overlap(this.player, this.enemyBullets, (_p, bulletObj) => {
      const bullet = bulletObj as EnemyBullet;
      if (!bullet.active) return;
      if (this.player.takeDamage(this.time.now)) {
        bullet.disableBody(true, true);
      }
    });
  }

  private endGame(victory: boolean) {
    if (this.ended) return;
    this.ended = true;
    this.scoreManager.saveHighscore();
    this.scene.stop('HUDScene');
    this.time.delayedCall(600, () => {
      this.scene.start('GameOverScene', { score: this.scoreManager.value, victory });
    });
  }
}
