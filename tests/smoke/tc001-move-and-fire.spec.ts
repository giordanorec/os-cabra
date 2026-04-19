import { expect, test } from '@playwright/test';
import { waitForGameReady, holdKey } from './helpers';

// TC-001 — Player move e atira (QA_PLAN.md §4)
// Dado a GameScene carregada, o player deve:
//  1. Mover com ArrowRight e ArrowLeft respeitando world bounds.
//  2. Disparar com Space em intervalos ~220ms, destruindo o inimigo estático
//     (que em M1 tem HP=3 e respawna 400ms após a morte).
test.describe('TC-001 — Player move e atira', () => {
  test.beforeEach(async ({ page }) => {
    // Console errors ficam anexados ao test; qualquer page error quebra o teste.
    page.on('pageerror', (err) => {
      throw err;
    });
    await waitForGameReady(page);
  });

  test('movimento horizontal respeita bounds e retorna ao centro', async ({ page }) => {
    const initialX = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').player.x as number;
    });
    expect(initialX).toBeCloseTo(400, 0);

    await holdKey(page, 'ArrowRight', 500);
    const afterRightX = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').player.x as number;
    });
    expect(afterRightX).toBeGreaterThan(initialX + 80);
    // World bounds: GAME_WIDTH=800, player 32px → max x ≈ 784.
    expect(afterRightX).toBeLessThanOrEqual(784);

    await page.screenshot({
      path: 'docs/qa_screenshots/milestone_1/tc001-01-after-right.png',
      fullPage: false
    });

    await holdKey(page, 'ArrowLeft', 700);
    const afterLeftX = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').player.x as number;
    });
    expect(afterLeftX).toBeLessThan(afterRightX - 80);

    await page.screenshot({
      path: 'docs/qa_screenshots/milestone_1/tc001-02-after-left.png',
      fullPage: false
    });
  });

  test('segurar Space dispara bullets com cooldown e incrementa score', async ({ page }) => {
    const scoreBefore = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').score as number;
    });
    expect(scoreBefore).toBe(0);

    await holdKey(page, 'Space', 2500);

    // 2500ms / 220ms de cooldown ≈ 11 tiros; enemy HP=3 → pelo menos 3 kills (300 pts).
    // Damos margem generosa (200) pra flutuação por respawn/frame timing.
    const scoreAfter = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').score as number;
    });
    expect(scoreAfter).toBeGreaterThanOrEqual(200);

    const hudText = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').scoreText.text as string;
    });
    expect(hudText).toMatch(/^SCORE \d{6}$/);

    await page.screenshot({
      path: 'docs/qa_screenshots/milestone_1/tc001-03-after-fire.png',
      fullPage: false
    });
  });
});
