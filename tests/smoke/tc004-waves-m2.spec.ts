import { expect, test } from '@playwright/test';
import { waitForGameplay } from './helpers';

// TC-004 — Checkpoint / progressão de waves (QA_PLAN.md §4 — adaptado M2)
// Fase 1 completa entra em M3 com o boss. Em M2 temos 5 waves sem boss.
// O caso original TC-004 (morrer, voltar pro checkpoint) só faz sentido
// quando o jogo sobrevive 1+ round; aqui validamos a mecânica do spawner:
//  - Wave 0 dispara após ~1500ms com 3 caboclinhos.
//  - Progressão: matar uma wave faz o spawner avançar pra próxima.
//  - Wave 3 (`wave-3-enfeite`) tem `checkpointOnClear: true` e, ao limpar,
//    chama `GameScene.saveCheckpoint`. Testamos isso emitindo matança
//    programática das waves anteriores pra chegar no checkpoint.
test.describe('TC-004 — Waves + checkpoint (adaptado M2)', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (err) => {
      throw err;
    });
    await waitForGameplay(page);
  });

  test('wave 0 spawna 3 caboclinhos após ~1500ms', async ({ page }) => {
    // Espera os 3 spawns do wave 0. Spawns em delayMs 0/200/400 após o
    // delayAfterPreviousMs de 1500ms → último inimigo em ~1900ms.
    await page.waitForFunction(() => {
      const gs = window.__osCabra!.scene.getScene('GameScene') as any;
      return gs.enemies.getLength() >= 3;
    }, null, { timeout: 4_000 });

    const waveState = await page.evaluate(() => {
      const gs = window.__osCabra!.scene.getScene('GameScene') as any;
      return {
        enemiesAlive: gs.enemies.getLength() as number,
        currentWave: gs.spawner.currentWaveIndex as number
      };
    });
    expect(waveState.enemiesAlive).toBeGreaterThanOrEqual(3);
    expect(waveState.currentWave).toBe(0);

    await page.screenshot({
      path: 'docs/qa_screenshots/milestone_2/tc004-01-wave0-spawned.png',
      fullPage: false
    });
  });

  test('limpar waves 0-2 dispara checkpoint na wave 3', async ({ page }) => {
    // Fast-forward: mata inimigos vivos em loop pela API do runtime.
    // Wave 3 tem `checkpointOnClear` na `fase1Waves[2]` (currentWave 2
    // quando começa; currentWave 3 depois de concluída). Quando ela limpa,
    // o spawner chama `onCheckpoint(2)` e GameScene grava `waveIndex: 3`.
    await killAllEnemiesLoop(page, 45_000);

    const checkpointed = await page.evaluate(() => {
      const gs = window.__osCabra!.scene.getScene('GameScene') as any;
      return {
        checkpoint: gs.checkpoint,
        currentWave: gs.spawner.currentWaveIndex as number
      };
    });
    expect(checkpointed.checkpoint).not.toBeNull();
    expect(checkpointed.checkpoint.waveIndex).toBe(3);
    expect(checkpointed.checkpoint.lives).toBeGreaterThan(0);

    await page.screenshot({
      path: 'docs/qa_screenshots/milestone_2/tc004-02-checkpoint-saved.png',
      fullPage: false
    });
  });
});

// Helper local: mata todo enemy vivo a cada 120ms até o spawner passar da wave
// 3 OU o Game Over (ex.: bomba do PassistaFrevo tira as 3 vidas antes).
async function killAllEnemiesLoop(page: import('@playwright/test').Page, timeoutMs: number) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const status = await page.evaluate(() => {
      const gs = window.__osCabra!.scene.getScene('GameScene') as any;
      if (gs.ended) return 'ended';
      if (gs.checkpoint && gs.checkpoint.waveIndex >= 3) return 'checkpoint-done';
      const list = gs.enemies.getChildren() as any[];
      for (const e of list) {
        if (e.active) e.takeHit(99);
      }
      return 'running';
    });
    if (status === 'checkpoint-done' || status === 'ended') return;
    await page.waitForTimeout(120);
  }
  throw new Error('Timeout: waves 0-2 não foram limpas dentro de ' + timeoutMs + 'ms');
}
