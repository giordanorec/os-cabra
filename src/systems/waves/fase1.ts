import { ZigzagStartDir } from '../../entities/enemies/PassistaFrevo';

export type EnemyType = 'passistaFrevo' | 'caboclinho' | 'moscaManga';

export interface CaboclinhoOverride {
  canFire?: boolean;
  diagonalInward?: boolean;
}

export interface PassistaOverride {
  zigzagStartDir?: ZigzagStartDir;
}

export interface Spawn {
  type: EnemyType;
  x: number;
  delayMs: number;
  paramOverride?: CaboclinhoOverride | PassistaOverride;
}

export interface Wave {
  id: string;
  delayAfterPreviousMs: number;
  spawns: Spawn[];
  checkpointOnClear?: boolean;
}

const swarmMosca = (): Spawn[] =>
  Array.from({ length: 10 }, (_, i) => ({
    type: 'moscaManga' as const,
    x: 100 + i * 60,
    delayMs: i * 120
  }));

export const fase1Waves: Wave[] = [
  {
    id: 'wave-1-abertura',
    delayAfterPreviousMs: 1500,
    spawns: [
      { type: 'caboclinho', x: 200, delayMs: 0, paramOverride: { canFire: false } },
      { type: 'caboclinho', x: 400, delayMs: 200, paramOverride: { canFire: false } },
      { type: 'caboclinho', x: 600, delayMs: 400, paramOverride: { canFire: false } }
    ]
  },
  {
    id: 'wave-2-vai-e-vem',
    delayAfterPreviousMs: 10_000,
    spawns: [
      { type: 'passistaFrevo', x: 180, delayMs: 0, paramOverride: { zigzagStartDir: 'right' } },
      { type: 'passistaFrevo', x: 620, delayMs: 600, paramOverride: { zigzagStartDir: 'left' } },
      { type: 'passistaFrevo', x: 180, delayMs: 1400, paramOverride: { zigzagStartDir: 'right' } },
      { type: 'passistaFrevo', x: 620, delayMs: 2000, paramOverride: { zigzagStartDir: 'left' } }
    ]
  },
  {
    id: 'wave-3-enfeite',
    delayAfterPreviousMs: 11_000,
    checkpointOnClear: true,
    spawns: [
      { type: 'caboclinho', x: 150, delayMs: 0 },
      { type: 'passistaFrevo', x: 550, delayMs: 300, paramOverride: { zigzagStartDir: 'left' } },
      { type: 'caboclinho', x: 550, delayMs: 1100 },
      { type: 'passistaFrevo', x: 250, delayMs: 1400, paramOverride: { zigzagStartDir: 'right' } }
    ]
  },
  {
    id: 'wave-4-enxame-manga',
    delayAfterPreviousMs: 12_000,
    spawns: [
      ...swarmMosca(),
      { type: 'caboclinho', x: 600, delayMs: 2500 }
    ]
  },
  {
    id: 'wave-5-cortejo',
    delayAfterPreviousMs: 10_000,
    spawns: [
      { type: 'passistaFrevo', x: 400, delayMs: 0 },
      { type: 'passistaFrevo', x: 320, delayMs: 200, paramOverride: { zigzagStartDir: 'right' } },
      { type: 'passistaFrevo', x: 480, delayMs: 200, paramOverride: { zigzagStartDir: 'left' } },
      { type: 'passistaFrevo', x: 240, delayMs: 400, paramOverride: { zigzagStartDir: 'right' } },
      { type: 'passistaFrevo', x: 560, delayMs: 400, paramOverride: { zigzagStartDir: 'left' } },
      { type: 'caboclinho', x: 100, delayMs: 1500, paramOverride: { diagonalInward: true } },
      { type: 'caboclinho', x: 700, delayMs: 1500, paramOverride: { diagonalInward: true } }
    ]
  }
];
