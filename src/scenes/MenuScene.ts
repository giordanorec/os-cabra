import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, LOCALSTORAGE_ENDLESS_HIGHSCORE_KEY, SCENE_BG } from '../config';
import { getString } from '../strings';
import { ScoreManager } from '../systems/ScoreManager';
import { InputManager, Action } from '../systems/InputManager';
import { AudioManager } from '../systems/AudioManager';
import { Parallax } from '../systems/Parallax';
import { attachFullscreenToggle, addFullscreenButton } from '../systems/Fullscreen';
import { FONTS } from '../fonts';

export class MenuScene extends Phaser.Scene {
  private inputManager!: InputManager;
  private audio!: AudioManager;
  private confirmed = false;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.confirmed = false;
    this.cameras.main.setBackgroundColor(SCENE_BG.MENU);
    // Parallax construído mas NÃO tickado — menu é estático (pivot polish 2026-04-21).
    // Usuário reclamou de rolagem distraindo no menu. Imagem do galo fica
    // parada no fundo; texto sobre backdrops escuros. Instância descartada após
    // renderizar camadas iniciais (sem ref pra evitar tick acidental).
    new Parallax(this, 'menu');
    this.inputManager = new InputManager(this);
    this.inputManager.registerAnyTapAsConfirm(this);
    this.audio = new AudioManager(this);
    this.audio.playMusic('music_menu', 800);
    attachFullscreenToggle(this);

    const cx = GAME_WIDTH / 2;

    // Layout Opção A: título no topo, CTA no rodapé, galo (do background) ocupa
    // o centro visual. Backdrops semi-opacos garantem contraste sobre qualquer
    // arte de fundo sem esconder totalmente o galo.
    const BACKDROP_COLOR = 0x1a0f08;
    const BACKDROP_ALPHA = 0.55;
    const TEXT_DEPTH = 10;
    const BACKDROP_DEPTH = 9;

    // ── Título topo ──────────────────────────────────────────────
    this.add.rectangle(cx, 80, 640, 110, BACKDROP_COLOR, BACKDROP_ALPHA)
      .setDepth(BACKDROP_DEPTH);
    const title = this.add.text(cx, 80, getString('boot.title'), {
      fontFamily: FONTS.DISPLAY,
      fontSize: '88px',
      color: '#f0c840',
      stroke: '#1a0f08',
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(TEXT_DEPTH);
    this.tweens.add({
      targets: title,
      scale: { from: 1, to: 1.04 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    this.add.text(cx, 142, getString('boot.tagline'), {
      fontFamily: FONTS.BODY,
      fontSize: '18px',
      color: '#fff2cc',
      fontStyle: 'italic'
    }).setOrigin(0.5).setDepth(TEXT_DEPTH);

    // ── CTA centro-baixo ─────────────────────────────────────────
    this.add.rectangle(cx, 490, 520, 90, BACKDROP_COLOR, BACKDROP_ALPHA)
      .setDepth(BACKDROP_DEPTH);
    const playText = this.add.text(cx, 490, getString('menu.play'), {
      fontFamily: FONTS.DISPLAY,
      fontSize: '56px',
      color: '#fff2cc',
      stroke: '#1a0f08',
      strokeThickness: 5
    }).setOrigin(0.5).setDepth(TEXT_DEPTH);
    this.tweens.add({
      targets: playText,
      scale: { from: 1, to: 1.08 },
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // ── Hint rodapé + highscore ──────────────────────────────────
    this.add.rectangle(cx, GAME_HEIGHT - 35, 560, 55, BACKDROP_COLOR, BACKDROP_ALPHA)
      .setDepth(BACKDROP_DEPTH);
    this.add.text(cx, GAME_HEIGHT - 48, getString('menu.hint'), {
      fontFamily: FONTS.MONO,
      fontSize: '13px',
      color: '#fff2cc'
    }).setOrigin(0.5).setDepth(TEXT_DEPTH);

    // Highscore: endless é o modo canônico do v1. Se ainda não houver, tenta
    // o antigo (compat) — zero não aparece.
    const hsEndless = ScoreManager.loadHighscore(LOCALSTORAGE_ENDLESS_HIGHSCORE_KEY);
    const hs = hsEndless > 0 ? hsEndless : ScoreManager.loadHighscore();
    if (hs > 0) {
      this.add.text(cx, GAME_HEIGHT - 25, getString('hud.endless_highscore', hs.toString().padStart(6, '0')), {
        fontFamily: FONTS.MONO,
        fontSize: '14px',
        color: '#f0c840'
      }).setOrigin(0.5).setDepth(TEXT_DEPTH);
    }

    // Fullscreen: ícone clicável + hint textual (com backdrop próprio).
    this.add.rectangle(GAME_WIDTH - 90, 32, 172, 52, BACKDROP_COLOR, BACKDROP_ALPHA)
      .setDepth(BACKDROP_DEPTH);
    addFullscreenButton(this, GAME_WIDTH - 24, 24);
    this.add.text(GAME_WIDTH - 44, 46, getString('controls.fullscreen_hint'), {
      fontFamily: FONTS.MONO,
      fontSize: '11px',
      color: '#fff2cc'
    }).setOrigin(1, 0).setDepth(TEXT_DEPTH);
  }

  override update(_time: number, _delta: number) {
    // Parallax intencionalmente não tickado — menu é estático.
    if (this.confirmed) return;
    if (this.inputManager.justPressed(Action.CONFIRM) || this.inputManager.justPressed(Action.FIRE)) {
      this.confirmed = true;
      this.audio.play('ui_confirm');
      this.cameras.main.fadeOut(300);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.audio.stopMusic(200);
        this.scene.start('GameScene');
      });
    }
  }
}
