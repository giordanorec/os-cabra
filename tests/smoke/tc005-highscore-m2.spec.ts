import { expect, test } from '@playwright/test';
import { waitForMenu, waitForGameplay, waitForGameOver } from './helpers';

// TC-005 — Highscore persiste (QA_PLAN.md §4)
// M2 implementa em `ScoreManager.saveHighscore` + `loadHighscore`, usando
// `localStorage['os_cabra_highscore']` = `{best, updatedAt}`.
// Save dispara em `GameScene.endGame` (tanto victory quanto defeat).
test.describe('TC-005 — Highscore persiste (M2)', () => {
  test.beforeEach(async ({ page, context }) => {
    page.on('pageerror', (err) => {
      throw err;
    });
    // Limpa localStorage entre testes pra evitar contaminação.
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('os_cabra_highscore'));
  });

  test('Game Over grava highscore no localStorage em formato {best, updatedAt}', async ({ page }) => {
    await waitForGameplay(page);
    await page.evaluate(() => {
      const gs = window.__osCabra!.scene.getScene('GameScene') as any;
      const now = gs.time.now as number;
      gs.scoreManager.registerKill(1500, now);
      for (let i = 0; i < 3; i++) gs.player.takeDamage(now + i * 1500);
    });
    await waitForGameOver(page, 5_000);

    const raw = await page.evaluate(() => localStorage.getItem('os_cabra_highscore'));
    expect(raw).not.toBeNull();
    const record = JSON.parse(raw!) as { best: number; updatedAt: string };
    expect(record.best).toBe(1500);
    expect(record.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  test('score menor NÃO sobrescreve recorde maior', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        'os_cabra_highscore',
        JSON.stringify({ best: 9999, updatedAt: '2026-04-19T00:00:00.000Z' })
      );
    });

    await waitForGameplay(page);
    await page.evaluate(() => {
      const gs = window.__osCabra!.scene.getScene('GameScene') as any;
      const now = gs.time.now as number;
      gs.scoreManager.registerKill(200, now);
      for (let i = 0; i < 3; i++) gs.player.takeDamage(now + i * 1500);
    });
    await waitForGameOver(page, 5_000);

    const record = await page.evaluate(() => {
      const raw = localStorage.getItem('os_cabra_highscore')!;
      return JSON.parse(raw) as { best: number };
    });
    expect(record.best).toBe(9999); // preservado
  });

  test('após reload, MenuScene mostra RECORDE com o valor persistido', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        'os_cabra_highscore',
        JSON.stringify({ best: 12345, updatedAt: '2026-04-19T00:00:00.000Z' })
      );
    });
    await page.reload();
    await waitForMenu(page);

    const menuTexts = await page.evaluate(() => {
      const m = window.__osCabra!.scene.getScene('MenuScene') as any;
      return (m.children.list as any[])
        .filter((c) => c.type === 'Text')
        .map((t) => t.text as string);
    });
    expect(menuTexts.some((t) => /RECORDE:\s*012345/.test(t))).toBe(true);

    await page.screenshot({
      path: 'docs/qa_screenshots/milestone_2/tc005-menu-highscore.png',
      fullPage: false
    });
  });
});
