// Constantes globais do jogo.
// Cada número aqui é uma alavanca de game feel — Game Designer calibra.

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const BACKGROUND_COLOR = '#1a0f08';

// Player
export const PLAYER_SPEED = 320;
export const PLAYER_FIRE_COOLDOWN_MS = 220;
export const PLAYER_LIVES = 3;
export const PLAYER_INVULN_MS = 1200;
export const PLAYER_BLINK_HZ = 8;

// Bullets
export const BULLET_SPEED = 560;

// Enemies — valores base, cada tipo sobrescreve
export const ENEMY_BASE_SPEED = 120;

// Score
export const LOCALSTORAGE_HIGHSCORE_KEY = 'os_cabra_highscore';
export const CHAIN_THRESHOLD = 5;
export const CHAIN_MULTIPLIER = 1.5;
export const CHAIN_RESET_MS = 4000;

// Fase 1
export const FASE1 = {
  INTRO_DELAY_MS: 1500,
  INTER_WAVE_BASE_MS: 10_000,
  BREATHER_BEFORE_BOSS_MS: 3_000,
  SWARM_MOSCA_COUNT: 10,
  SPEED_MULTIPLIER: 1.0,
  CHECKPOINT_AFTER_WAVE: 3
} as const;

// Paleta (referência ART_BIBLE)
export const PALETTE = {
  BG: 0x1a0f08,
  CREAM: 0xf4e4c1,
  GOLD: 0xd4a04c,
  RED: 0xb84a2e,
  GREEN: 0x5a7a3a,
  BROWN: 0x7a6850
} as const;
