import { expect, test } from '@playwright/test';
import { waitForGameplay, holdKey } from './helpers';

// TC-001 — Player move e atira (QA_PLAN.md §4)
// M2: GameScene é iniciada a partir da MenuScene (Enter). Score passou a
// viver em `ScoreManager`, HUD é uma cena separada.
test.describe('TC-001 — Player move e atira (M2)', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (err) => {
      throw err;
    });
    await waitForGameplay(page);
  });

  test('movimento horizontal respeita bounds', async ({ page }) => {
    const initialX = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').player.x as number;
    });
    expect(initialX).toBeCloseTo(400, 0);

    await holdKey(page, 'ArrowRight', 500);
    const afterRightX = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').player.x as number;
    });
    expect(afterRightX).toBeGreaterThan(initialX + 80);
    expect(afterRightX).toBeLessThanOrEqual(784);

    await page.screenshot({
      path: 'docs/qa_screenshots/milestone_2/tc001-01-after-right.png',
      fullPage: false
    });

    await holdKey(page, 'ArrowLeft', 700);
    const afterLeftX = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').player.x as number;
    });
    expect(afterLeftX).toBeLessThan(afterRightX - 80);
  });

  test('Space dispara bullets com cooldown e score sobe via ScoreManager', async ({ page }) => {
    const scoreBefore = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').scoreManager.value as number;
    });
    expect(scoreBefore).toBe(0);

    // Wave 1 (delayAfterPreviousMs 1500) traz 3 caboclinhos a cada 200ms,
    // hp=1, 120pts cada. Segurar Space 4s cobre todos os 3 + sobra.
    await holdKey(page, 'Space', 4000);

    const scoreAfter = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').scoreManager.value as number;
    });
    expect(scoreAfter).toBeGreaterThan(0);

    const hudText = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('HUDScene').scoreValue.text as string;
    });
    expect(hudText).toMatch(/^\d{6}$/);
    expect(Number(hudText)).toBe(scoreAfter);

    await page.screenshot({
      path: 'docs/qa_screenshots/milestone_2/tc001-02-after-fire.png',
      fullPage: false
    });
  });
});
