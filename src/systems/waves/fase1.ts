import { ZigzagStartDir } from '../../entities/enemies/PassistaFrevo';

export type EnemyType =
  | 'passistaFrevo'
  | 'caboclinho'
  | 'moscaManga'
  | 'mamulengo'
  | 'urubuCapibaribe'
  | 'papaFigo';

export interface CaboclinhoOverride {
  canFire?: boolean;
  diagonalInward?: boolean;
}

export interface PassistaOverride {
  zigzagStartDir?: ZigzagStartDir;
}

export type MamulengoOverride = Record<string, never>;
export type UrubuOverride = Record<string, never>;
export type PapaFigoOverride = Record<string, never>;

export interface Spawn {
  type: EnemyType;
  x: number;
  delayMs: number;
  paramOverride?:
    | CaboclinhoOverride
    | PassistaOverride
    | MamulengoOverride
    | UrubuOverride
    | PapaFigoOverride;
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
    id: 'wave-3-mamulengos',
    delayAfterPreviousMs: 11_000,
    checkpointOnClear: true,
    spawns: [
      { type: 'mamulengo', x: 220, delayMs: 0 },
      { type: 'mamulengo', x: 580, delayMs: 400 },
      { type: 'caboclinho', x: 150, delayMs: 3000 },
      { type: 'caboclinho', x: 650, delayMs: 3200 }
    ]
  },
  {
    id: 'wave-4-urubus-e-enxame',
    delayAfterPreviousMs: 12_000,
    spawns: [
      ...swarmMosca(),
      { type: 'urubuCapibaribe', x: 200, delayMs: 1200 },
      { type: 'urubuCapibaribe', x: 500, delayMs: 2000 },
      { type: 'urubuCapibaribe', x: 350, delayMs: 2800 }
    ]
  },
  {
    id: 'wave-5-papa-figo-cortejo',
    delayAfterPreviousMs: 10_000,
    spawns: [
      { type: 'papaFigo', x: 400, delayMs: 0 },
      { type: 'passistaFrevo', x: 200, delayMs: 1800, paramOverride: { zigzagStartDir: 'right' } },
      { type: 'passistaFrevo', x: 600, delayMs: 2200, paramOverride: { zigzagStartDir: 'left' } },
      { type: 'caboclinho', x: 100, delayMs: 3500, paramOverride: { diagonalInward: true } },
      { type: 'caboclinho', x: 700, delayMs: 3500, paramOverride: { diagonalInward: true } }
    ]
  }
];
