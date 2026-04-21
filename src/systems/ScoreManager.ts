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

// Marcos de score que emitem floating text "ÉGUA! 10 MIL" etc.
const MILESTONES = [10_000, 50_000, 100_000];

export class ScoreManager {
  private score = 0;
  private chainCount = 0;
  private lastKillAt = 0;
  private milestonesHit = new Set<number>();
  onChange?: (score: number, multiplierActive: boolean) => void;
  onChainStart?: () => void;
  onChainChange?: (multiplier: number, active: boolean) => void;
  onMilestone?: (milestone: number) => void;

  registerKill(points: number, now: number) {
    if (now - this.lastKillAt > CHAIN_RESET_MS) {
      this.emitChainChange(0);
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
    if (wasActive !== isActive || isActive) {
      this.emitChainChange(isActive ? mult : 1);
    }
    this.checkMilestones();
  }

  tick(now: number) {
    if (this.chainCount > 0 && now - this.lastKillAt > CHAIN_RESET_MS) {
      this.chainCount = 0;
      this.onChange?.(this.score, false);
      this.emitChainChange(0);
    }
  }

  resetChain() {
    if (this.chainCount > 0) {
      this.chainCount = 0;
      this.onChange?.(this.score, false);
      this.emitChainChange(0);
    }
  }

  private emitChainChange(multiplier: number) {
    this.onChainChange?.(multiplier, multiplier > 1);
  }

  private checkMilestones() {
    for (const m of MILESTONES) {
      if (this.score >= m && !this.milestonesHit.has(m)) {
        this.milestonesHit.add(m);
        this.onMilestone?.(m);
      }
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
    // marca milestones já atingidos no snapshot pra não re-dispar ao restaurar
    for (const m of MILESTONES) {
      if (this.score >= m) this.milestonesHit.add(m);
    }
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
