import * as Phaser from 'phaser';
import { FASE1, GAME_HEIGHT, GAME_WIDTH, SCENE_BG } from '../config';
import { Player } from '../entities/Player';
import { BulletGroup } from '../entities/Bullet';
import { Enemy } from '../entities/Enemy';
import { EnemyBullet, EnemyBulletGroup } from '../entities/EnemyBullet';
import { HomingEnemyBullet, HomingEnemyBulletGroup } from '../entities/HomingEnemyBullet';
import { PowerUp, PowerUpType } from '../entities/PowerUp';
import { Action, InputManager } from '../systems/InputManager';
import { EnemySpawner } from '../systems/EnemySpawner';
import { ScoreManager, ScoreSnapshot } from '../systems/ScoreManager';
import { AudioManager } from '../systems/AudioManager';
import { Parallax } from '../systems/Parallax';
import { Effects } from '../systems/Effects';
import { attachFullscreenToggle } from '../systems/Fullscreen';
import { TouchInput } from '../systems/TouchInput';
import { shouldUseTouchControls } from '../systems/Platform';
import { getString } from '../strings';
import { MaracatuNacao } from '../bosses/MaracatuNacao';

const BOSS_BONUS_BASE = 5000;
const BOSS_BONUS_PER_LIFE = 1000;
const BOSS_DEFEATED_VIEW_MS = 2500;

interface Checkpoint {
  waveIndex: number;
  lives: number;
  score: ScoreSnapshot;
}

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private playerBullets!: BulletGroup;
  private enemyBullets!: EnemyBulletGroup;
  private homingEnemyBullets!: HomingEnemyBulletGroup;
  private powerUps!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.GameObjects.Group;
  private inputManager!: InputManager;
  private spawner!: EnemySpawner;
  private scoreManager!: ScoreManager;
  private audio!: AudioManager;
  private parallax!: Parallax;
  private fx!: Effects;
  private checkpoint: Checkpoint | null = null;
  private ended = false;
  private boss?: MaracatuNacao;
  private bossActive = false;
  private touchInput?: TouchInput;
  private killCount = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.ended = false;
    this.bossActive = false;
    this.boss = undefined;
    this.cameras.main.setBackgroundColor(SCENE_BG.FASE1);
    this.parallax = new Parallax(this, 'fase1');
    this.inputManager = new InputManager(this);
    if (shouldUseTouchControls()) {
      this.touchInput = new TouchInput(this);
      this.touchInput.mount();
      this.inputManager.attachTouch(this.touchInput);
    }
    this.scoreManager = new ScoreManager();
    this.audio = new AudioManager(this);
    this.fx = new Effects(this);
    attachFullscreenToggle(this);

    this.audio.playMusic('music_phase1', 800);

    this.player = new Player(this, GAME_WIDTH / 2, GAME_HEIGHT - 100);
    this.player.onFire = (x, y) => {
      this.audio.play('player_fire');
      this.fx.muzzleFlash(x, y - 10);
    };
    this.playerBullets = new BulletGroup(this, 'bullet-player', 32);
    this.enemyBullets = new EnemyBulletGroup(this, 'enemy-bullet-flecha', 64);
    this.homingEnemyBullets = new HomingEnemyBulletGroup(this, 'enemy-bullet-cabeca', 16);
    this.powerUps = this.physics.add.group({ classType: PowerUp, runChildUpdate: true });
    this.enemies = this.add.group({ runChildUpdate: false });

    this.player.onDamage = (lives) => {
      this.audio.play('player_hit');
      this.fx.playerHit();
      this.scoreManager.resetChain();
      this.events.emit('hud-lives', lives);
    };
    this.player.onDeath = () => {
      this.audio.play('player_die');
      this.endGame(false);
    };
    this.player.onShieldBreak = (x, y) => {
      this.audio.play('shield_break');
      this.fx.shieldShatter(x, y);
    };
    this.player.onPowerUpCollected = (type) => {
      this.audio.play('pickup_sombrinha');
      this.fx.pickup(this.player.x, this.player.y);
      this.events.emit('hud-pickup-text', type);
    };

    this.scoreManager.onChange = (score, mult) => {
      this.events.emit('hud-score', score, mult);
    };
    this.scoreManager.onChainStart = () => this.audio.play('chain_multiplier');
    this.scoreManager.onChainChange = (multiplier, active) => {
      this.events.emit('hud-chain', multiplier, active);
    };
    this.scoreManager.onMilestone = (ms) => {
      this.audio.play('score_milestone');
      this.events.emit('hud-milestone', ms);
    };

    this.spawner = new EnemySpawner(
      this,
      this.enemyBullets,
      this.homingEnemyBullets,
      this.player,
      {
        onEnemySpawned: (e) => this.onEnemySpawned(e),
        onEnemyKilled: (e) => this.onEnemyKilled(e),
        onCheckpoint: (waveIdx) => this.saveCheckpoint(waveIdx),
        onAllWavesCleared: () => this.scheduleBossEntry()
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
      this.events.emit('hud-kills', this.killCount);
      this.events.emit('hud-phase-intro', getString('stage.1.name'), getString('stage.1.subtitle'), 1);
      this.audio.play('phase_intro');
    });

    this.spawner.start();
  }

  override update(time: number, delta: number) {
    this.parallax.tick(delta);
    this.touchInput?.update(time);
    if (this.ended) return;
    if (this.inputManager.justPressed(Action.PAUSE)) {
      this.pauseGame();
      return;
    }
    this.player.tick(time, this.inputManager, this.playerBullets);
    if (!this.bossActive) this.spawner.tick();
    this.boss?.tick(time);
    this.scoreManager.tick(time);
  }

  private pauseGame() {
    this.scene.pause();
    this.scene.pause('HUDScene');
    this.scene.launch('PauseScene');
  }

  private registerPlayerVsEnemyBullets() {
    this.physics.add.overlap(this.player, this.enemyBullets, (_p, bulletObj) => {
      const bullet = bulletObj as EnemyBullet;
      if (!bullet.active) return;
      if (this.player.takeDamage(this.time.now)) {
        bullet.disableBody(true, true);
      }
    });
    this.physics.add.overlap(this.player, this.homingEnemyBullets, (_p, bulletObj) => {
      const bullet = bulletObj as HomingEnemyBullet;
      if (!bullet.active) return;
      if (this.player.takeDamage(this.time.now)) {
        bullet.disableBody(true, true);
      }
    });
    this.physics.add.overlap(this.player, this.powerUps, (_p, puObj) => {
      const pu = puObj as PowerUp;
      if (!pu.active) return;
      pu.collect();
      this.player.applyPowerUp(pu.type);
    });
  }

  private onEnemySpawned(enemy: Enemy) {
    this.enemies.add(enemy);
    this.physics.add.overlap(enemy, this.playerBullets, (enemyObj, bulletObj) => {
      const bullet = bulletObj as Phaser.Physics.Arcade.Sprite;
      const e = enemyObj as Enemy;
      if (!bullet.active || !e.active) return;
      bullet.disableBody(true, true);
      this.audio.play('enemy_hit');
      e.takeHit(1);
    });
    this.physics.add.overlap(this.player, enemy, (_p, enemyObj) => {
      const e = enemyObj as Enemy;
      if (!e.active) return;
      if (this.player.takeDamage(this.time.now)) {
        e.takeHit(99);
      }
    });
  }

  private onEnemyKilled(enemy: Enemy) {
    this.audio.play('enemy_explode_small');
    // Pivot juice 2026-04-21: enemyDeath recebe points pra score popup.
    this.fx.enemyDeath(enemy.x, enemy.y, enemy.points);
    this.killCount += 1;
    this.events.emit('hud-kills', this.killCount);
    this.scoreManager.registerKill(enemy.points, this.time.now);
    this.maybeDropPowerUp(enemy.x, enemy.y);
  }

  private maybeDropPowerUp(x: number, y: number) {
    const dropRate = (window as unknown as { __DEBUG_POWERUP_RATE?: number }).__DEBUG_POWERUP_RATE ?? 0.15;
    if (Math.random() >= dropRate) return;
    // Só sombrinha implementada; escolha randômica dos 5 tipos prevista
    // mas neutralizada até os outros 4 efeitos entrarem.
    const type: PowerUpType = 'sombrinha';
    const pu = new PowerUp(this, x, y, type);
    this.powerUps.add(pu);
  }

  private saveCheckpoint(waveIndex: number) {
    this.checkpoint = {
      waveIndex: waveIndex + 1,
      lives: this.player.lives,
      score: this.scoreManager.snapshot()
    };
    this.audio.play('checkpoint');
    this.events.emit('hud-checkpoint');
  }

  private scheduleBossEntry() {
    this.bossActive = true;
    this.audio.play('wave_clear');
    this.time.delayedCall(FASE1.BREATHER_BEFORE_BOSS_MS, () => this.spawnBoss());
  }

  private spawnBoss() {
    this.boss = new MaracatuNacao(
      this,
      this.enemyBullets,
      () => this.player,
      {
        onPhaseChange: (phase) => {
          const key = phase === 'B' ? 'boss.phase2' : phase === 'C' ? 'boss.phase3' : '';
          if (key) {
            this.events.emit('hud-boss-phase', getString(key));
            this.audio.play('boss_phase_change');
            this.fx.bossPhaseChange();
          }
        },
        onHPChange: (hp, hpMax) => this.events.emit('hud-boss-hp', hp, hpMax),
        onDefeated: () => this.finishBoss()
      }
    );
    this.boss.playIntro(() => undefined);
    this.audio.playMusic('music_boss', 600);
    this.audio.play('boss_appear');
    this.audio.play('voc_oxe');
    this.events.emit('hud-boss-intro', getString('boss.1.name'), getString('boss.1.epithet'));
    this.events.emit('hud-boss-hp', this.boss.hp, this.boss.hpMax);
    this.registerBossCollisions();
  }

  private registerBossCollisions() {
    if (!this.boss) return;
    for (const member of this.boss.members()) {
      this.physics.add.overlap(member, this.playerBullets, (memberObj, bulletObj) => {
        const bullet = bulletObj as Phaser.Physics.Arcade.Sprite;
        if (!bullet.active || !this.boss) return;
        bullet.disableBody(true, true);
        this.audio.play('boss_hit');
        this.fx.bossHit(memberObj as Phaser.GameObjects.Sprite);
        this.boss.registerMemberHit(memberObj as typeof member);
      });
      this.physics.add.overlap(this.player, member, () => {
        if (!this.boss) return;
        this.player.takeDamage(this.time.now);
      });
    }
  }

  private finishBoss() {
    const lives = this.player.lives;
    const bonus = BOSS_BONUS_BASE + BOSS_BONUS_PER_LIFE * lives;
    this.scoreManager.registerKill(bonus, this.time.now);
    if (this.boss) this.fx.bossDefeated(this.boss.calunga.x, this.boss.calunga.y);
    this.audio.play('boss_defeat');
    this.audio.play('voc_pai_degua');
    this.events.emit('hud-boss-defeated', BOSS_BONUS_BASE, lives, bonus);
    this.events.emit('hud-boss-hide');
    this.time.delayedCall(BOSS_DEFEATED_VIEW_MS, () => this.endGame(true));
  }

  private endGame(victory: boolean) {
    if (this.ended) return;
    this.ended = true;
    this.scoreManager.saveHighscore();
    this.audio.stopMusic(400);
    this.scene.stop('HUDScene');
    this.time.delayedCall(600, () => {
      this.scene.start('GameOverScene', { score: this.scoreManager.value, victory });
    });
  }
}
