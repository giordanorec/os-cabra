import { expect, test } from '@playwright/test';
import { waitForGameplay } from './helpers';

// TC-007 — Pausa congela (QA_PLAN.md §4)
//
// Em M2: a hint do HUD anuncia `[ESC] pausa` (src/strings.ts controls.hint),
// mas `InputManager` expõe `Action.PAUSE=ESC` sem nenhum consumer chamando
// `scene.pause()`. Ou seja, a feature está prometida na UI mas não
// implementada no código.
//
// Este spec faz dois jobs:
//  1. Regressão guard: confirma que ESC hoje NÃO pausa (se alguém meter
//     pausa parcial/bug, o teste quebra e a gente sabe).
//  2. `.fixme` com o assert correto pronto pra ativar quando o Gameplay Dev
//     implementar `scene.pause()` no handler de `justPressed(PAUSE)`.
//
// Nota: em runs paralelos com testes que mudam o estado via APIs de runtime,
// pode haver carryover. Rodar isolado (`--grep TC-007`) se precisar reproduzir.
test.describe('TC-007 — Pausa (prometida na HUD, não implementada em M2)', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (err) => {
      throw err;
    });
    await waitForGameplay(page);
  });

  test('ESC ainda não pausa a GameScene (regressão guard)', async ({ page }) => {
    const wasPausedBefore = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').scene.isPaused() as boolean;
    });
    expect(wasPausedBefore).toBe(false);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    const isPausedAfter = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').scene.isPaused() as boolean;
    });
    expect(isPausedAfter).toBe(false);
  });

  test.fixme('TODO: ESC pausa e ESC de novo retoma (quando implementado)', async ({ page }) => {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    const paused = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').scene.isPaused() as boolean;
    });
    expect(paused).toBe(true);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    const resumed = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').scene.isPaused() as boolean;
    });
    expect(resumed).toBe(false);
  });
});
