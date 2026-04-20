import {
  LOCALSTORAGE_HIGHSCORE_KEY,
  CHAIN_THRESHOLD,
  CHAIN_MULTIPLIER,
  CHAIN_RESET_MS
} from '../config';

interface HighscoreRecord {
  best: number;
  updatedAt: string;
}

export interface ScoreSnapshot {
  score: number;
  chainCount: number;
  lastKillAt: number;
}

export class ScoreManager {
  private score = 0;
  private chainCount = 0;
  private lastKillAt = 0;
  onChange?: (score: number, multiplierActive: boolean) => void;
  onChainStart?: () => void;

  registerKill(points: number, now: number) {
    if (now - this.lastKillAt > CHAIN_RESET_MS) {
      this.chainCount = 0;
    }
    const wasActive = this.chainCount >= CHAIN_THRESHOLD;
    this.chainCount += 1;
    this.lastKillAt = now;
    const isActive = this.chainCount >= CHAIN_THRESHOLD;
    if (!wasActive && isActive) this.onChainStart?.();
    const mult = isActive ? CHAIN_MULTIPLIER : 1;
    this.score += Math.round(points * mult);
    this.onChange?.(this.score, mult > 1);
  }

  tick(now: number) {
    if (this.chainCount > 0 && now - this.lastKillAt > CHAIN_RESET_MS) {
      this.chainCount = 0;
      this.onChange?.(this.score, false);
    }
  }

  resetChain() {
    if (this.chainCount > 0) {
      this.chainCount = 0;
      this.onChange?.(this.score, false);
    }
  }

  snapshot(): ScoreSnapshot {
    return { score: this.score, chainCount: this.chainCount, lastKillAt: this.lastKillAt };
  }

  restore(s: ScoreSnapshot) {
    this.score = s.score;
    this.chainCount = s.chainCount;
    this.lastKillAt = s.lastKillAt;
    this.onChange?.(this.score, this.chainCount >= CHAIN_THRESHOLD);
  }

  get value(): number {
    return this.score;
  }

  get multiplierActive(): boolean {
    return this.chainCount >= CHAIN_THRESHOLD;
  }

  saveHighscore() {
    try {
      const existing = ScoreManager.loadHighscore();
      if (this.score > existing) {
        const record: HighscoreRecord = {
          best: this.score,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(LOCALSTORAGE_HIGHSCORE_KEY, JSON.stringify(record));
      }
    } catch {
      // localStorage indisponível (Safari privacy mode, etc.) — silencioso
    }
  }

  static loadHighscore(): number {
    try {
      const raw = localStorage.getItem(LOCALSTORAGE_HIGHSCORE_KEY);
      if (!raw) return 0;
      const r = JSON.parse(raw) as HighscoreRecord;
      return r.best ?? 0;
    } catch {
      return 0;
    }
  }
}
