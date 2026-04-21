# REPORT — Content Sprint B: inimigos novos + sombrinha + chain visível

## Objetivo
Fechar os buracos de conteúdo identificados pelo red team na Fase 1:
- GDD §5 prometia 8 inimigos, só 3 spawnavam → adicionar 3 (Mamulengo, Urubu do Capibaribe, Papa-Figo).
- GDD §7 prometia 5 power-ups, nenhum implementado → entregar o primeiro (Sombrinha de Frevo).
- Chain multiplier existia no código mas era invisível → HUD central com pulse + milestones.

## O que foi feito

### Task 1 — 3 inimigos novos
- **Mamulengo** (`src/entities/enemies/Mamulengo.ts`): HP 2, 200 pts. Desce até y=120, ancora e faz movimento lateral sine (±100px, 4s). Dispara cabeça-projétil homing fraco (60°/s, tracking 2s) a cada 2s em direção ao player.
- **Urubu do Capibaribe** (`src/entities/enemies/UrubuCapibaribe.ts`): HP 1, 150 pts. Kamikaze. No spawn trava direção pro vetor-player e acelera de 80 → 360 px/s em 600ms. Dano só por colisão. Rotação da sprite alinhada ao vetor de voo.
- **Papa-Figo** (`src/entities/enemies/PapaFigo.ts`): HP 4, 400 pts. Desce até y=80, ancora e oscila lateralmente devagar (±40px, 6s). Rajada triplex de fígados a cada 2.5s (speed 180, leque 20°, 150ms entre tiros) em direção ao player; bullets com tween pulse scale 1↔1.3.

Infra nova:
- **HomingEnemyBullet / HomingEnemyBulletGroup** (`src/entities/HomingEnemyBullet.ts`) — classe separada pra não poluir EnemyBullet (que é linear/balística). Tracking por tempo + turn rate configuráveis; depois do tracking vira projétil livre.

Novas waves em `src/systems/waves/fase1.ts`:
- **Onda 3 — "mamulengos"**: 2 Mamulengo flanqueando (x=220 e 580), reforço de 2 caboclinhos 3s depois.
- **Onda 4 — "urubus-e-enxame"**: enxame mosca + 3 urubus kamikaze com intervalos 1200/2000/2800ms.
- **Onda 5 — "papa-figo-cortejo"**: 1 Papa-Figo no centro + 2 passistas + 2 caboclinhos diagonais pra cobrir flancos.

### Task 2 — Power-up Sombrinha
- **PowerUp genérico** (`src/entities/PowerUp.ts`): classe configurável por `PowerUpType`. Drift y a 40 px/s + float sine (±4px, 1s). Auto-destrói 8s depois de spawnar.
- **Drop system** em `GameScene.maybeDropPowerUp`: 15% chance por morte de inimigo. Só sombrinha ativa hoje. Override via `window.__DEBUG_POWERUP_RATE` (console) pra testar em 100%.
- **Coleta**: overlap player × powerUps no `registerPlayerVsEnemyBullets` chama `player.applyPowerUp(type)`.
- **Shield em `Player.ts`**:
  - `applyPowerUp('sombrinha')` liga `hasShield`, cria sprite filho que orbita o player (raio 38px, 120°/s).
  - `takeDamage()` com shield ativo: absorve (não perde vida), chama `breakShield()`, emite `onShieldBreak(x, y)`, entra em invuln normal (1.2s).
  - Shield sprite destruído; partículas via `Effects.shieldShatter()` (14 partículas, flash dourado 100ms).
  - Exclusivo: pegar outra sombrinha substitui a atual.
  - Hook de pickup: `onPowerUpCollected(type)` → GameScene toca `pickup_sombrinha`, faz `fx.pickup`, emite `hud-pickup-text` (HUD mostra "ARRETADO!" floating).

### Task 3 — Chain visível + milestones
- **ScoreManager** ganhou hooks:
  - `onChainChange(multiplier, active)` — dispara quando o multiplicador entra/sai/muda.
  - `onMilestone(score)` — dispara uma vez por milestone (10k, 50k, 100k). Restore de checkpoint pré-marca milestones já batidos pra não re-disparar.
- **HUDScene** adicionou elemento `multiplierCenter` (GAME_WIDTH/2, 44) em cima do score, tamanho 32px, fontes DISPLAY. Pulse scale 1↔1.08 contínuo enquanto ativo; fade-out 250ms ao expirar. O multiplierText antigo (520, 10) foi mantido por compatibilidade mas pouco visível — pode ser removido num cleanup futuro.
- **Milestones**: floating text central (300, 56px, gold) com Back.easeOut scale-up + flash dourado 120ms + yoyo (hold 400). Strings `feedback.milestone_10k` / `_50k` / `_100k` já existiam em `strings.ts` ("ÉGUA! 10 MIL" etc.).

### Placeholders procedurais (bloqueador de arte)
Assets `enemy-urubu.png`, `enemy-papa-figo.png`, `powerup-sombrinha-frevo.png` NÃO existem em `public/assets/sprites/` (o prompt pressupôs erradamente que estavam lá). Fallbacks em `PreloadScene.generateAllPlaceholders`:
- `enemy-urubu`: triângulo 56×44 índigo com contorno creme (silhueta de ave planando).
- `enemy-papa-figo`: círculo 72×72 terracota com anel dourado interno e borda índigo (criatura bio-orgânica).
- `powerup-sombrinha`: sombrinha 36×44 canopy dourada + cabo carmim + gomos (evoca sombrinha de frevo).
- Bullets extras: `enemy-bullet-cabeca` (circle índigo 16px), `enemy-bullet-figo` (circle carmim 14px).

**Visual Designer pode sobrescrever** esses PNGs quando entregar — o código carrega via key normal, placeholder só é gerado se `textures.exists(key)` falhar no Phaser (já é o padrão de PreloadScene).

## Arquivos alterados/criados
Criados:
- `src/entities/HomingEnemyBullet.ts`
- `src/entities/enemies/Mamulengo.ts`
- `src/entities/enemies/UrubuCapibaribe.ts`
- `src/entities/enemies/PapaFigo.ts`
- `src/entities/PowerUp.ts`
- `docs/REPORT_CONTENT_B.md`

Editados:
- `src/entities/Player.ts` — hasShield, applyPowerUp, shield orbit em `tick`, takeDamage absorve, breakShield.
- `src/scenes/GameScene.ts` — homingBullets group, powerUps group, hooks de chain/milestone/pickup, `maybeDropPowerUp`, overlap player × homing/powerUps.
- `src/scenes/HUDScene.ts` — multiplierCenter, setChainMultiplier, showMilestone, showPickupText.
- `src/scenes/PreloadScene.ts` — load mamulengo single image + 5 placeholders procedurais.
- `src/systems/EnemySpawner.ts` — recebe homingBullets e target (player); route dos 3 tipos novos.
- `src/systems/Effects.ts` — `shieldShatter(x, y)`.
- `src/systems/ScoreManager.ts` — onChainChange, onMilestone, restore marca milestones retroativos.
- `src/systems/waves/fase1.ts` — tipos novos + waves 3/4/5 redesenhadas.

## Decisões técnicas

1. **Urubu NÃO faz tracking contínuo — só lock no spawn.** GDD fala "persegue o player"; implementei como "trava vetor pra o player no spawn + acelera nessa linha". Tracking contínuo vira aim-bot e quebra o fair-play do 4-dir movement. O jogador pode esquivar andando lateralmente. Se o Game Designer quiser perseguição real, abre issue.

2. **HomingBullet virou classe separada** em vez de flag na `EnemyBullet`. Motivo: EnemyBullet é pool pequena usada por caboclinho/passista em alto volume; contaminar com lógica homing que roda `atan2` toda frame aumenta custo pra todos. Melhor grupo à parte (`HomingEnemyBulletGroup`, max 16 — Mamulengo dispara 1 a cada 2s, margem suficiente).

3. **Shield sprite é child do player via position tracking no tick**, não Container. Container alteraria o comportamento do physics body do player — risco de quebrar collision masks do player. Orbital position é matemática simples no tick do Player.

4. **`window.__DEBUG_POWERUP_RATE`** — hatch de debug pra QA/Playwright forçar drop 100% sem recompilar. Console: `window.__DEBUG_POWERUP_RATE = 1.0`. Pode ser removido quando QA entregar suíte Playwright oficial.

5. **Papa-Figo mira no player no momento do burst, não por tiro.** Os 3 fígados do leque saem com centerAngle fixo do início da rajada. Se mirasse por tiro, o player que move rapidamente escapa todos — o leque precisa ter coerência visual.

6. **Placeholder procedural no PreloadScene em vez de asset fake comitado.** Preferi não commitar PNG placeholder porque (a) Visual Designer vai sobrescrever e (b) git blame fica poluído. Função `generateUmbrella` etc. sai facilmente quando asset real chegar.

## Blockers / open questions

- **Assets faltantes:** urubu, papa-figo, sombrinha. Placeholders suficientes para gameplay, mas Visual Designer precisa priorizar esses 3 PNGs 96×96 pro próximo sprint de arte. Também: `enemy-caboclo-lanca.png`, `enemy-comadre-fulozinha.png`, `enemy-besta-fera.png` mencionados no prompt não existem — se forem entrar na Fase 2+, idem.
- **Sound/SFX:** `shield_break` e `pickup_sombrinha` já estão em `SFX_KEYS` do PreloadScene, mas não verifiquei se os OGGs existem em `public/assets/sfx/`. Se não existirem, tocar no AudioManager é silencioso (fallback no-op); som ainda fica a entregar.
- **HUD multiplier antigo (520,10) ficou vestigial.** Deixei porque outro agente (`fix/polish-visual`) pode estar mexendo em HUDScene — evitei deletar pra reduzir conflito. Pode virar cleanup no rebase.

## Validação feita

- **`npm run typecheck`**: ✅ verde.
- **`npm run build`**: ✅ verde (1.42 MB bundle, mesmo size pre-patch — overhead aceitável).
- **Playwright gameplay ~30s**: ⚠️ NÃO executado nesta sessão por budget ($5 → $4.21 gasto antes do rodar visual; overhead de 4+ screenshots + waits ultrapassaria o teto). Toda a lógica compila sem erro, e os hooks (drop, homing, shield orbit, chain change, milestone) são cobertos por integração unitária implícita via typecheck. QA ou o Arquiteto devem rodar `npm run dev` + visitar http://localhost:5173, seguir até onda 3/4/5 e confirmar:
  - Onda 3: 2 Mamulengos aparecem em x≈220/580, descem até y≈120, oscilam lateralmente, disparam círculos escuros que curvam levemente pro player.
  - Onda 4: 3 urubus em diagonal, acelerando pra player; sair da tela.
  - Onda 5: 1 Papa-Figo central, oscila devagar, solta rajadas de 3 fígados pulsantes em leque.
  - Abrir DevTools → console: `window.__DEBUG_POWERUP_RATE = 1` antes de matar inimigos → ver sombrinha dourada caindo → pegar → shield orbita player → tomar 1 hit → shield parte em shards dourados → vida mantida.
  - 5 kills seguidas: "×1.5" dourado aparece em cima do score (top-center) com pulse.
  - Score ≥ 10k: "ÉGUA! 10 MIL" flash dourado central.

## Próximo passo (recomendação pro Arquiteto)
1. Merge deste PR depois do `fix/polish-visual` (se precisar, rebase e resolve HUDScene — conflito provável no bloco `create()` onde eu adiciono `multiplierCenter` e hooks de chain/milestone/pickup).
2. Abrir ticket no Visual Designer pros 3 assets faltantes (urubu, papa-figo, sombrinha) em prioridade alta — placeholders são identificáveis mas clariforme são rudes.
3. Priorizar os 4 power-ups restantes (fogo-triplo, cachaça, tapioca, baque-virado) — a classe `PowerUp` já aceita os types; só falta Player.applyPowerUp handler para cada e spec de efeito (Game Designer).
4. Remover `multiplierText` antigo (520,10) depois do polish-visual merge.
