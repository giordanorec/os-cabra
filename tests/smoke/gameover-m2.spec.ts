import { expect, test } from '@playwright/test';
import { waitForGameplay, waitForGameOver } from './helpers';

// Game Over — M2
// `GameScene.endGame(false)` dispara quando lives<=0. Após delayedCall(600),
// `scene.start('GameOverScene', {score, victory})`. GameOverScene mostra
// "SE LASCOU" (ou "FASE COMPLETA" em caso victory=true) + score zero-pad.
test.describe('Game Over — M2', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (err) => {
      throw err;
    });
    await waitForGameplay(page);
  });

  test('zerar vidas leva à GameOverScene com score preservado', async ({ page }) => {
    const expected = await page.evaluate(() => {
      const gs = window.__osCabra!.scene.getScene('GameScene') as any;
      const now = gs.time.now as number;
      gs.scoreManager.registerKill(500, now);
      gs.player.takeDamage(now + 0);
      gs.player.takeDamage(now + 2000);
      gs.player.takeDamage(now + 4000);
      return gs.scoreManager.value as number;
    });
    expect(expected).toBe(500);

    await waitForGameOver(page, 5_000);

    const gameOverState = await page.evaluate(() => {
      const go = window.__osCabra!.scene.getScene('GameOverScene') as any;
      return {
        score: go.overData.score as number,
        victory: go.overData.victory as boolean
      };
    });
    expect(gameOverState.score).toBe(500);
    expect(gameOverState.victory).toBe(false);

    await page.screenshot({
      path: 'docs/qa_screenshots/milestone_2/gameover-01-se-lascou.png',
      fullPage: false
    });
  });

  test('Enter na GameOverScene volta pro menu', async ({ page }) => {
    await page.evaluate(() => {
      const gs = window.__osCabra!.scene.getScene('GameScene') as any;
      const now = gs.time.now as number;
      for (let i = 0; i < 3; i++) gs.player.takeDamage(now + i * 1500);
    });
    await waitForGameOver(page, 5_000);

    // keyboard.press é rápido demais pro Phaser JustDown — usa down+wait+up.
    await page.keyboard.down('Enter');
    await page.waitForTimeout(50);
    await page.keyboard.up('Enter');
    await page.waitForFunction(() => {
      const m = window.__osCabra!.scene.getScene('MenuScene');
      return !!m && m.scene.isActive();
    }, null, { timeout: 3_000 });

    const activeScenes = await page.evaluate(() => {
      return window.__osCabra!.scene.getScenes(true).map((s: any) => s.scene.key as string);
    });
    expect(activeScenes).toContain('MenuScene');
    expect(activeScenes).not.toContain('GameOverScene');
  });
});
