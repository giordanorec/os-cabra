# Waves — Fase 1: Marco Zero

> **Responsável**: Game Designer. **Consome**: Gameplay Dev (transforma em TS literal em `src/systems/waves/fase1.ts`).
> **Depende de**: `docs/GDD.md` §5 (inimigos), §6.1 (boss), §8 (checkpoint), §10 (curva).

## Contexto
Fase 1 é **tutorial em disfarce**: ensina movimento, tiro, dodge, pickup. Deve ser possível completar com 3 vidas mesmo para jogador mediano em 1ª tentativa, mas com sensação de progresso (não de passeio).

- **Duração alvo** (ondas + boss): **~2:30**
- **Resolução**: 800×600 (x cresce para direita, y para baixo — origem top-left)
- **Zona de spawn**: y = -60 (off-screen topo); x varia
- **Zona de player**: y ≈ 500, move em x entre 40 e 760
- **Velocidade geral**: 1.0× (base, sem multiplicador)
- **Inimigos disponíveis**: `passistaFrevo` (P), `caboclinho` (C), `moscaManga` (M — enxame)
- **Ordem narrativa**: C → P → mix → swarm+C → mix denso → boss

## Convenções do contrato
Quando o Gameplay Dev implementar, usar formato equivalente:

```ts
type EnemyType = 'passistaFrevo' | 'caboclinho' | 'moscaManga';
interface Spawn { type: EnemyType; x: number; delayMs: number; paramOverride?: Partial<EnemyParams>; }
interface Wave { id: string; waitForClearMs?: number; delayAfterPreviousMs: number; spawns: Spawn[]; }
```

- `delayAfterPreviousMs`: espera após a onda anterior ser **limpa** (todos mortos/fora da tela)
- `waitForClearMs`: opcional — força começar mesmo se onda anterior ainda tiver inimigos (para pressão)
- `delayMs` de cada spawn: offset dentro da onda

## Tabela mestre

| # | Nome | Delay após onda anterior | Composição | Objetivo didático |
|---|---|---|---|---|
| 1 | *Abertura* | 1500ms (intro da fase) | 3× Caboclinho em linha, centro | Ensina mira e descida reta |
| 2 | *Vai-e-Vem* | 10000ms | 4× Passista Frevo (zigzag), alternando laterais | Introduz tracking horizontal |
| 3 | *Enfeite* (CHECKPOINT ao limpar) | 11000ms | 2× Caboclinho + 2× Passista intercalados | Combina os dois padrões |
| 4 | *Enxame da Manga* | 12000ms | 1× enxame de Mosca (10) em formação + 1× Caboclinho tardio | Primeira pressão de swarm; ensina bomb/power-up value |
| 5 | *Cortejo* | 10000ms | 5× Passista em V + 2× Caboclinho laterais | Clímax antes do boss — densidade alta |
| — | Breather | 3000ms (após limpar) | Silêncio total, câmera respira | Anti-clímax antes do boss |
| B | **Boss Maracatu Nação** | — | Ver GDD §6.1 | — |

---

## Detalhamento por onda

### Wave 1 — Abertura (t ≈ 1.5s)
Três Caboclinhos descem retos em linha reta, uniformemente espaçados.

| # | Tipo | x | delayMs | Notas |
|---|---|---|---|---|
| 1 | caboclinho | 200 | 0 | |
| 2 | caboclinho | 400 | 200 | centro |
| 3 | caboclinho | 600 | 400 | |

- Velocidade: padrão (speed 150 px/s para baixo)
- Nenhum atira nesta onda (override `canFire: false`) — puramente dodge/shoot

**Condição de encerramento**: todos mortos ou passaram da linha y=620. Dispara `delayAfterPreviousMs` da Wave 2.

---

### Wave 2 — Vai-e-Vem (t ≈ 13s)
Quatro Passistas em zigzag, entrando alternadamente de cada lado.

| # | Tipo | x | delayMs | paramOverride |
|---|---|---|---|---|
| 1 | passistaFrevo | 80 | 0 | `{ zigzagStartDir: 'right' }` |
| 2 | passistaFrevo | 720 | 600 | `{ zigzagStartDir: 'left' }` |
| 3 | passistaFrevo | 80 | 1400 | `{ zigzagStartDir: 'right' }` |
| 4 | passistaFrevo | 720 | 2000 | `{ zigzagStartDir: 'left' }` |

- Zigzag: amplitude 150px, período 2.2s
- Speed descida: 95 px/s (mais lento pra dar tempo de tiros saírem)
- Bombinha: 1 a cada 2.5s, trajetória parabólica para frente

**Drop garantido** desta wave: nenhum (1 HP não dropa — ver §7).

---

### Wave 3 — Enfeite (t ≈ 24s) → **CHECKPOINT ao limpar**
Primeiro mix. 4 inimigos em ordem controlada.

| # | Tipo | x | delayMs | paramOverride |
|---|---|---|---|---|
| 1 | caboclinho | 150 | 0 | |
| 2 | passistaFrevo | 650 | 300 | `{ zigzagStartDir: 'left' }` |
| 3 | caboclinho | 550 | 1100 | |
| 4 | passistaFrevo | 250 | 1400 | `{ zigzagStartDir: 'right' }` |

- Caboclinhos atiram 1 flecha cada ao cruzar y=200
- Passistas comportamento padrão

**Checkpoint**: ao último ser derrotado/sair, salvar snapshot (vidas, power-up, score, wave_index=3). Exibir HUD "ONDE EU TAVA" por 1.5s sem pausar (ver `UX_SPEC.md` §6).

---

### Wave 4 — Enxame da Manga (t ≈ 37s)
Primeira onda "assustadora". Swarm de mosca vem em formação diagonal.

| # | Tipo | x | delayMs | paramOverride |
|---|---|---|---|---|
| 1-10 | moscaManga | 100 + (i × 60) | i × 120ms | formação diagonal descendo-direita |
| 11 | caboclinho | 720 | 2500 | aparece quando enxame já está descendo |

- Moscas: speed 180 px/s, movimento orbital ao redor de um centro virtual que desce a 100 px/s (efeito "nuvem"). Amplitude orbital 40px, período 1.2s
- Nenhuma atira; só colisão (1 vida)
- Cada mosca 10 pontos → enxame de 10 = 100 pontos. Encorajar clearing
- Caboclinho tardio "empurra" o player a não ficar parado matando moscas

**Drop**: sem garantias (todos 1 HP), mas se o jogador foi eficaz e matou o caboclinho, ele ainda é 1 HP → sem drop. Decisão intencional: Fase 1 é "seca" de power-ups. Primeiro power-up natural vem de um Mamulengo/outro 2+ HP que aparece só na Fase 2.

---

### Wave 5 — Cortejo (t ≈ 49s) — clímax
Densa. Forma em V de Passistas + flancos de Caboclinho.

| # | Tipo | x | delayMs | paramOverride |
|---|---|---|---|---|
| 1 | passistaFrevo | 400 | 0 | centro (ponta do V) |
| 2 | passistaFrevo | 320 | 200 | `{ zigzagStartDir: 'right' }` |
| 3 | passistaFrevo | 480 | 200 | `{ zigzagStartDir: 'left' }` |
| 4 | passistaFrevo | 240 | 400 | `{ zigzagStartDir: 'right' }` |
| 5 | passistaFrevo | 560 | 400 | `{ zigzagStartDir: 'left' }` |
| 6 | caboclinho | 60 | 1500 | entra pela esquerda em diagonal |
| 7 | caboclinho | 740 | 1500 | entra pela direita em diagonal |

- Caboclinhos 6 e 7: `movementOverride: 'diagonal-inward'`, velocidade 150 px/s, ângulo 30° em relação ao eixo y
- Passistas mantêm bombinhas a cada 2.5s — ondas de bombinhas podem cair juntas, força o player a ler trajetórias

**Condição para boss**: todos limpos.

---

### Breather (3s de silêncio)
Nada spawna. Câmera mantém. Útil para:
1. Player respirar
2. Música começar cross-fade para tema de boss
3. Preparar a "OXE!" visual do boss

Após 3s, **spawn do Boss Maracatu Nação** (GDD §6.1). Freeze + letreiro de boss + start da luta.

---

## Contingências

- **Game Over durante wave 4-5**: player volta ao Checkpoint (fim da Wave 3), começa Wave 4 com as vidas que tinha naquele momento.
- **Player demora demais a limpar** (wave trava): após 30s sem spawn novo (por exemplo, player esconde e não avança), spawnar 2× Caboclinho extras a cada 10s ("anti-turtle"). Gameplay Dev implementa esse timeout.
- **Player sem health nenhum na Wave 5**: nada muda — jogo é difícil, não condescendente. Sem pity health. Se playtest mostrar taxa de Game Over > 50% em Fase 1 primeira-tentativa, revisitar Wave 4 (reduzir enxame para 8).

## Parâmetros que ficarão em `src/config.ts` (sugestão de naming)

```ts
export const FASE1 = {
  INTRO_DELAY_MS: 1500,
  INTER_WAVE_BASE_MS: 10_000,
  BREATHER_BEFORE_BOSS_MS: 3_000,
  SWARM_MOSCA_COUNT: 10,
  SPEED_MULTIPLIER: 1.0,
  ANTI_TURTLE_SPAWN_INTERVAL_MS: 10_000,
  ANTI_TURTLE_IDLE_TRIGGER_MS: 30_000,
};
```

Valores exatos ficam na mão do Gameplay Dev para ajuste fino via hot reload no playtest.
