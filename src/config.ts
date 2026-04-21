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
export const LOCALSTORAGE_ENDLESS_HIGHSCORE_KEY = 'os_cabra_endless_highscore';
export const CHAIN_THRESHOLD = 5;
export const CHAIN_MULTIPLIER = 1.5;
export const CHAIN_RESET_MS = 4000;

// ─── Endless Mode ──────────────────────────────────────────────
// Um bioma = um segmento contínuo da paisagem (Marco Zero → Olinda → ...)
// que dura BIOME_DURATION_MS e depois faz crossfade pro próximo.
// Crossfade usa alpha-fade entre duas instâncias de Parallax (a nova nasce
// atrás, sobe alpha em ENDLESS.BIOME_CROSSFADE_MS, a velha morre).
//
// Backgrounds atualmente disponíveis em public/assets/backgrounds/:
//   fase1 (Marco Zero), fase2 (Olinda), fase4 (Capibaribe).
// fase3 (Recife Antigo) e fase5 (Sertão) ainda não têm arte → fallback
// reusa os 3 disponíveis em rotação, com nome narrativo distinto no HUD.
// TODO(Visual Designer): gerar fase3/back|mid|fore e fase5/back|mid|fore.
export const ENDLESS = {
  BIOME_DURATION_MS: 45_000,
  BIOME_CROSSFADE_MS: 4_000,
  // Spawn group cadence (interval entre levas). Escalamento progressivo:
  //   intervalMs = max(FLOOR, BASE × CADENCE_DECAY^biomeIndex)
  BASE_SPAWN_INTERVAL_MS: 3_800,
  FLOOR_SPAWN_INTERVAL_MS: 700,
  CADENCE_DECAY: 0.93,
  // Tamanho do grupo spawnado de uma vez (cresce com biome index)
  GROUP_SIZE_STEPS: [
    { afterBiome: 0, size: 1 },
    { afterBiome: 2, size: 2 },
    { afterBiome: 4, size: 3 },
    { afterBiome: 7, size: 4 }
  ],
  // Score por segundo de sobrevivência (+ além de kills)
  SURVIVAL_POINTS_PER_SEC: 10,
  // Metros percorridos = tempo × velocidade base / 100 (leitura estética)
  METERS_PER_SECOND: 18,
  // Loop de dificuldade: após LOOP_LENGTH biomas, o índice de loop incrementa
  // e multiplicadores globais aplicam. LOOP_LENGTH = 3 porque temos 3 backgrounds
  // únicos — a partir daí repete com "tonalidade noturna" (tint mais escuro).
  LOOP_LENGTH: 3,
  LOOP_SPEED_MULT: 1.08,
  LOOP_SPAWN_MULT: 0.90
} as const;

// Progressão de inimigos liberados por biome index (0 = primeiro bioma).
// Uma vez liberado, permanece no pool pra sempre.
export const ENDLESS_UNLOCK_TABLE: Array<{ afterBiome: number; type: string }> = [
  { afterBiome: 0, type: 'caboclinho' },
  { afterBiome: 1, type: 'passistaFrevo' },
  { afterBiome: 1, type: 'moscaManga' },
  { afterBiome: 2, type: 'mamulengo' },
  { afterBiome: 3, type: 'urubuCapibaribe' },
  { afterBiome: 4, type: 'papaFigo' }
];

// Definição dos biomas. Ciclo 3-long; após isso repete com tint noturno.
export const ENDLESS_BIOMES: Array<{
  sceneId: 'fase1' | 'fase2' | 'fase4';
  nameKey: string;
  subtitleKey: string;
  shortLabel: string;
}> = [
  { sceneId: 'fase1', nameKey: 'stage.1.name', subtitleKey: 'stage.1.subtitle', shortLabel: 'MARCO ZERO' },
  { sceneId: 'fase2', nameKey: 'stage.2.name', subtitleKey: 'stage.2.subtitle', shortLabel: 'OLINDA' },
  { sceneId: 'fase4', nameKey: 'stage.4.name', subtitleKey: 'stage.4.subtitle', shortLabel: 'CAPIBARIBE' }
  // Quando fase3/fase5 backgrounds forem entregues:
  //   { sceneId: 'fase3', ..., shortLabel: 'RECIFE ANTIGO' },
  //   { sceneId: 'fase5', ..., shortLabel: 'SERTÃO' }
];

// Fase 1
export const FASE1 = {
  INTRO_DELAY_MS: 1500,
  INTER_WAVE_BASE_MS: 10_000,
  BREATHER_BEFORE_BOSS_MS: 3_000,
  SWARM_MOSCA_COUNT: 10,
  SPEED_MULTIPLIER: 1.0,
  CHECKPOINT_AFTER_WAVE: 3,
  // Duração estimada da fase (waves + breather + boss) — alimenta o cálculo
  // de velocidade do parallax no modo scroll pra imagem percorrer uma vez.
  DURATION_MS: 140_000
} as const;

// Parallax mode:
// 'scroll'  — backgrounds altos (ex: 800×2400) percorrem verticalmente
// 'postal'  — backgrounds estáticos trocam com crossfade a cada POSTAL_INTERVAL_MS
export const PARALLAX_MODE: 'scroll' | 'postal' = 'scroll';
export const PARALLAX_POSTAL_INTERVAL_MS = 8_000;
export const PARALLAX_CROSSFADE_MS = 600;

// Z-ordenação de camadas — mantém render consistente entre cenas.
// Referência: briefing pós-hotfix 2026-04-19 (bug do parallax cobrindo player).
export const DEPTH = {
  PARALLAX_BACK:   -300,
  PARALLAX_MID:    -200,
  PARALLAX_FORE:   -100,
  ENEMY_BULLET:    0,
  ENEMY:           10,
  PLAYER_BULLET:   15,
  PLAYER:          20,
  VFX:             50,
  HUD:             1000,
  HUD_OVERLAY:     1100,
  PAUSE:           2000,
  FULLSCREEN_BTN:  3000
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
