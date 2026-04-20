// Constantes globais do jogo.
// Cada número aqui é uma alavanca de game feel — Game Designer calibra.

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

// Paleta nova (cordel colorido, pivot visual 2026-04-19).
// Sem marrom chapado — cenas usam cor vibrante da fase como fallback.
export const SCENE_BG = {
  MENU:       '#2db8d6', // turquesa
  FASE1:      '#6fc5ea', // azul céu
  FASE2:      '#f0a040', // laranja Olinda
  FASE3:      '#e84a4a', // vermelho Carnaval
  FASE4:      '#4aa8b8', // água Capibaribe
  FASE5:      '#d89045', // poeira sertão
  BOSS:       '#6fc5ea', // mesmo da fase por default
  GAMEOVER:   '#2a2540', // roxo profundo (ainda não-marrom)
  VICTORY:    '#f0c840'  // amarelo ouro festivo
} as const;

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

// Paleta suplementar (acentos UI — pivot)
export const PALETTE = {
  CREAM:  0xfff2cc,
  GOLD:   0xf0c840,
  RED:    0xe84a4a,
  GREEN:  0x8dc850,
  PINK:   0xf06aa8,
  TEAL:   0x2db8d6,
  SKY:    0x6fc5ea
} as const;
