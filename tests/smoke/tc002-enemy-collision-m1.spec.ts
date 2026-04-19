import { expect, test } from '@playwright/test';
import { waitForGameReady, holdKey } from './helpers';

// TC-002 — Colisão com inimigo (QA_PLAN.md §4)
//
// O TC-002 original cobre colisão player×enemy consumindo vidas com i-frames.
// Em M1 isso ainda NÃO é implementado: inimigo é estático no topo (y≈120),
// player fica na faixa inferior (y≈540), e `PLAYER_LIVES` existe em config.ts
// mas não há sistema de vidas/colisão ainda. Essa cobertura completa entra em M2.
//
// O que este spec valida pro M1:
//  1. Estado inicial consistente (inimigo vivo, player longe dele).
//  2. A colisão que EXISTE no M1 — bullet×enemy — dispara takeHit
//     e, ao zerar HP, o enemy desativa e respawna 400ms depois no topo.
//  3. Nenhum erro no console durante o loop de hits (regressão do bug
//     de ordem de args em physics.add.overlap descoberto no M1 spike).
test.describe('TC-002 (adaptado M1) — overlap bullet×enemy e respawn', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (err) => {
      throw err;
    });
    await waitForGameReady(page);
  });

  test('estado inicial: player embaixo, enemy ativo no topo', async ({ page }) => {
    const snapshot = await page.evaluate(() => {
      const s = window.__osCabra!.scene.getScene('GameScene');
      return {
        playerY: s.player.y as number,
        enemyActive: s.enemy.active as boolean,
        enemyY: s.enemy.y as number,
        enemyHp: s.enemy.hp as number
      };
    });
    expect(snapshot.playerY).toBeGreaterThan(500);
    expect(snapshot.enemyActive).toBe(true);
    expect(snapshot.enemyY).toBeLessThan(200);
    expect(snapshot.enemyHp).toBe(3);
  });

  test('matar enemy desativa-o e respawna em ~400ms', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // 3 tiros (HP=3) com margem — 2500ms garante 11+ disparos.
    await holdKey(page, 'Space', 2500);

    // Em algum momento o enemy deve ter morrido (score subiu).
    const scoreAfter = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').score as number;
    });
    expect(scoreAfter).toBeGreaterThan(0);

    // Após soltar Space ainda restam bullets em voo (trajeto ~720ms para
    // cobrir 540→120px a BULLET_SPEED=560). Aguardamos o bastante para que:
    //  a) as últimas bullets saiam da tela OU completem o último kill;
    //  b) o delayedCall(400) agendado pelo último onDeath dispare.
    // 1200ms cobre o pior caso (~720ms de voo + 400ms de respawn + margem).
    await page.waitForTimeout(1200);
    const enemyRespawned = await page.evaluate(() => {
      const e = window.__osCabra!.scene.getScene('GameScene').enemy;
      return { active: e.active as boolean, hp: e.hp as number };
    });
    expect(enemyRespawned.active).toBe(true);
    expect(enemyRespawned.hp).toBe(3);

    expect(errors, `Console errors: ${errors.join('\n')}`).toEqual([]);

    await page.screenshot({
      path: 'docs/qa_screenshots/milestone_1/tc002-respawn.png',
      fullPage: false
    });
  });
});
