import * as Phaser from 'phaser';
import { ENDLESS, SCENE_BG } from '../config';
import { Parallax } from './Parallax';

type ParallaxSceneId = 'fase1' | 'fase2' | 'fase4';

// Tint noturno aplicado a partir do segundo loop inteiro — sinaliza progressão
// sem exigir novos assets. Valor escolhido pra escurecer sem ficar preto.
const NIGHT_TINT = 0x7a7ab0;

/**
 * Gerencia o Parallax atual e faz crossfade pro próximo biome quando o
 * EndlessDirector emite `endless-biome-change`. Também atualiza o background
 * color da câmera pra combinar com o biome.
 *
 * Uso: `const bt = new BiomeTransition(this); bt.attachToScene();`
 * GameScene chama `bt.tick(delta)` em update().
 */
export class BiomeTransition {
  private parallax: Parallax;
  private readonly scene: Phaser.Scene;
  private currentSceneId: ParallaxSceneId = 'fase1';

  constructor(scene: Phaser.Scene, initialSceneId: ParallaxSceneId = 'fase1') {
    this.scene = scene;
    this.currentSceneId = initialSceneId;
    this.parallax = new Parallax(scene, initialSceneId);
    scene.cameras.main.setBackgroundColor(this.bgColorFor(initialSceneId));
  }

  attachToScene() {
    this.scene.events.on(
      'endless-biome-change',
      (
        sceneId: ParallaxSceneId,
        _shortLabel: string,
        _nameKey: string,
        _subtitleKey: string,
        _biomeIndex: number,
        loopIndex: number,
        initial: boolean
      ) => {
        if (initial) return; // primeiro biome já construído pelo ctor
        this.transition(sceneId, loopIndex);
      }
    );
  }

  tick(deltaMs: number) {
    this.parallax.tick(deltaMs);
  }

  private transition(newSceneId: ParallaxSceneId, loopIndex: number) {
    if (newSceneId === this.currentSceneId && loopIndex === 0) return;
    const tint = loopIndex >= 1 ? NIGHT_TINT : undefined;
    this.parallax = this.parallax.transitionTo(newSceneId, ENDLESS.BIOME_CROSSFADE_MS, tint);
    this.currentSceneId = newSceneId;
    // bg color também faz crossfade "seco" (Phaser não anima setBackgroundColor,
    // então só flip no meio do fade — visualmente aceitável porque o Parallax
    // cobre 100% da viewport durante o fade).
    this.scene.time.delayedCall(ENDLESS.BIOME_CROSSFADE_MS / 2, () => {
      this.scene.cameras.main.setBackgroundColor(this.bgColorFor(newSceneId));
    });
  }

  private bgColorFor(sceneId: ParallaxSceneId): string {
    return sceneId === 'fase1' ? SCENE_BG.FASE1
      : sceneId === 'fase2' ? SCENE_BG.FASE2
      : SCENE_BG.FASE4;
  }

  destroy() {
    this.parallax.destroy();
  }
}
