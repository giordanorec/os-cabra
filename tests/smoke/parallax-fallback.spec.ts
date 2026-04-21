import { expect, test } from '@playwright/test';
import { waitForGameplay } from './helpers';

// Smoke do hotfix "parallax vista frontal errada — fallback temporário".
// Valida que:
//   1. Player é visível/ativo em (x, y ≈ GAME_HEIGHT-60) com alpha 1
//   2. `bg-fase1-back` NÃO foi carregado (desativado em PreloadScene até arte nova)
//   3. GameScene renderiza sem erros de console
//   4. Parallax cai em fallback procedural (layer kind 'procedural') ou tile
//      seamless — nunca scroll-single com textura que não existe
test.describe('Parallax fallback — fix/parallax-scroll-correto', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (err) => {
      throw err;
    });
    await waitForGameplay(page);
  });

  test('bg-fase1-back e fore desativados + player visível', async ({ page }) => {
    const info = await page.evaluate(() => {
      const g = window.__osCabra!;
      const gs = g.scene.getScene('GameScene') as any;
      return {
        backLoaded: gs.textures.exists('bg-fase1-back'),
        midLoaded: gs.textures.exists('bg-fase1-mid'),
        foreLoaded: gs.textures.exists('bg-fase1-fore'),
        playerAlpha: gs.player.alpha,
        playerActive: gs.player.active,
        parallaxLayersCount: gs.parallax?.layers?.length ?? 0
      };
    });
    expect(info.backLoaded).toBe(false); // desativado em PreloadScene
    expect(info.foreLoaded).toBe(false); // faixa frontal de casarios — desativada
    expect(info.midLoaded).toBe(true);   // balões/nuvens decorativos — mantido
    expect(info.playerAlpha).toBe(1);
    expect(info.playerActive).toBe(true);
    expect(info.parallaxLayersCount).toBe(3); // back/mid/fore sempre 3
  });

  test('cor chapada SCENE_BG.FASE1 aparece com back procedural', async ({ page }) => {
    // Espera bastante pra um eventual scroll problemático aparecer.
    await page.waitForTimeout(800);
    const backIsProcedural = await page.evaluate(() => {
      const g = window.__osCabra!;
      const gs = g.scene.getScene('GameScene') as any;
      const layers = gs.parallax?.layers ?? [];
      const backLayer = layers[0]; // primeira camada = back (LAYER_CONFIGS[0])
      return backLayer?.kind;
    });
    expect(backIsProcedural).toBe('procedural');

    await page.screenshot({
      path: 'docs/milestone-reports/parallax-fix/gameplay-without-back.png',
      fullPage: false
    });
  });

  test('parallax avança sem travar + sem erros de console', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    const snapshot1 = await page.evaluate(() => {
      const g = window.__osCabra!;
      const gs = g.scene.getScene('GameScene') as any;
      return { elapsed: gs.parallax?.elapsed ?? 0 };
    });
    await page.waitForTimeout(600);
    const snapshot2 = await page.evaluate(() => {
      const g = window.__osCabra!;
      const gs = g.scene.getScene('GameScene') as any;
      return { elapsed: gs.parallax?.elapsed ?? 0 };
    });
    expect(snapshot2.elapsed).toBeGreaterThan(snapshot1.elapsed);
    expect(consoleErrors).toEqual([]);
  });
});
