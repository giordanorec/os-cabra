# Game Design Document — Os Cabra

> **Responsável**: Game Designer. **Lê também**: Gameplay Developer, QA.
> **Depende de**: este é o documento de referência — outros specs derivam daqui.

## 1. Pitch

*Os Cabra* é um shoot 'em up vertical onde você pilota algo pernambucano (Galo da Madrugada voador provisório) e enfrenta ondas de figuras do folclore e das manifestações culturais do Recife que foram corrompidas por uma força bio-orgânica absurda. Estrutura clássica arcade (ondas → boss → próxima fase), apresentação moderna (polish, game feel, arte fluida em xilogravura).

## 2. Pilares de design

1. **Identidade cultural explícita** — cada inimigo, boss, power-up e fase é reconhecivelmente pernambucano. Não é "jogo genérico com skin". A piada local é o coração.
2. **Arcade clássico por fora, Angry Birds/Cuphead por dentro** — mecânicas simples e legíveis, mas cada ação tem juice, animação e peso visual.
3. **Justa, não punitiva** — 3 vidas + checkpoint no meio da fase. Morrer é um "tenta de novo", não uma penalização brutal.
4. **Absurdo coerente** — humor exagerado, mas dentro de uma lógica interna. Se o Papa-Figo atira fígados, todos os fígados se comportam da mesma forma.

## 3. Loops

- **30 segundos**: chegar na tela → esquivar/atirar → destruir → ganhar pontos/power-up
- **5 minutos**: completar uma fase (ondas crescentes → boss)
- **30 minutos**: rodar 3-5 fases → fim de jogo → comparar highscore

## 4. Controle do jogador

- Teclado apenas (confirmado)
- Setas esquerda/direita: movimento horizontal na faixa inferior (~20% inferior da tela)
- Espaço: atirar (hold para disparo repetido, respeitando cooldown)
- ESC: pausa
- Enter/Espaço: confirmar em menus

**Valores iniciais** (em `src/config.ts`, calibrar com playtest):
- `PLAYER_SPEED = 320` px/s
- `PLAYER_FIRE_COOLDOWN_MS = 220`
- `PLAYER_LIVES = 3`
- `BULLET_SPEED = 560` px/s

## 5. Inimigos regulares

| # | Nome | HP | Movimento | Ataque | Pontos | Aparece na fase |
|---|---|---|---|---|---|---|
| 1 | Passista de Frevo | 1 | Zigzag horizontal descendo | Larga bombinhas que caem em arco | 100 | 1+ |
| 2 | Caboclinho | 1 | Reto pra baixo | Flecha direta | 120 | 1+ |
| 3 | Mamulengo | 2 | Entra em formação no topo e fica atacando de lá | Cabeça-projétil teleguiada fraca | 200 | 2+ |
| 4 | Caboclo de Lança | 3 | Orbital em volta de um ponto | Lança longa reta | 300 | 3+ |
| 5 | Urubu do Capibaribe | 1 | Kamikaze: desce em diagonal perseguindo o player, sai da tela | Colisão | 150 | 2+ |
| 6 | Papa-Figo | 4 | Estacionário no topo, se move lentamente lateral | Rajada de 3 fígados pulsantes | 400 | 3+ |
| 7 | Comadre Fulozinha | 2 | Curva senoide lenta | Cipós serpenteantes (projétil com curva) | 250 | 4+ |
| 8 | Besta-Fera | 5 | Perseguição lenta, tenta ficar alinhada com o player | Bola de fogo de tiro longo | 500 | 4+ |
| — | Mosca-da-Manga (enxame) | 1 | Orbital, chega em nuvem de 8-12 | Só colisão | 10 cada | 1+ |

Detalhes de animação e sprite sheets: responsabilidade do Visual Designer (ver `ART_BIBLE.md`).

## 6. Bosses

Um boss ao final de cada fase. Cada um tem 3 fases de padrão (HP quebrado em terços).

### Fase 1 — Marco Zero: Maracatu Nação
- Rei, Rainha e Calunga como um trio que ataca junto
- Fase 1: alternam tiros em leque
- Fase 2: Calunga se destaca e vira projétil teleguiado
- Fase 3: Rei e Rainha formam "corredor" que jogador precisa atravessar atirando

### Fase 2 — Ladeiras de Olinda: Homem da Meia-Noite
- Boneco gigante que ocupa metade da tela
- Braços atacam independentemente (cada braço tem HP próprio, destruir um antes facilita)
- Fase 3 (enraivecido): acelera, braços giram como moinho

### Fase 3 — Recife Antigo: Galo da Madrugada Maligno
- Versão corrompida do ícone — penas bio-orgânicas
- Atira ovos explosivos em parábola
- Em HP baixo, cospe uma mini-formação de galinhas-pintinho kamikaze

### Fase 4 (opcional) — Capibaribe: Iara do Capibaribe
- Sereia poluída, emerge do rio (sprite cresce da base pra cima)
- Ataca com correntes de lixo e garrafas PET
- Cura parte do HP se jogador ficar parado muito tempo (força movimento)

### Fase 5 (opcional, final) — O Coronel
- Figura satírica do poder local
- Ataca com "leis" (pergaminhos), "votos" (cédulas que pegam fogo), "capangas" (mini-inimigos)
- Fase 3: tira a máscara e revela forma bio-orgânica final

## 7. Power-ups

Dropam com ~15% chance ao destruir inimigos de 2+ HP. Só um ativo por vez (pegar outro substitui).

| Nome | Efeito | Duração |
|---|---|---|
| Fogo de Artifício Triplo | Tiro se abre em 3 (leque de 30°) | Até levar dano |
| Sombrinha de Frevo | Escudo giratório, absorve 1 hit | Até levar hit |
| Cachaça Boa | Smart bomb, estoca até 2 (HUD mostra) | Consumível (tecla X, ou redefinir) |
| Tapioca Dobrada | +1 vida | Instantâneo (raríssimo, 1% drop) |
| Baque-Virado | Wingman calunga atirando junto | 18 segundos |

## 8. Vidas e checkpoint

- 3 vidas no começo da partida
- Colisão com inimigo/projétil = perde 1 vida + invulnerabilidade 1.5s (piscando)
- Zerou vidas = Game Over → tela "SE LASCOU" → volta ao menu
- **Checkpoint**: ao passar metade da fase (ex: 50% das ondas antes do boss), salva check. Morrer 1 vida durante a fase recomeça daquele ponto da fase com a vida que você tinha no checkpoint. Game Over total ainda volta ao começo.

## 9. Scoring

- Cada inimigo: valores na tabela acima
- Boss derrotado: 5.000 pontos + bônus por vidas remanescentes (×1.000)
- Chain: matar 5 inimigos sem perder vida no intervalo = multiplicador ×1.5 temporário
- Highscore local (localStorage chave `os_cabra_highscore`)
- Ao fim da partida, gerar **código de 6 caracteres** (base36 do score + hash simples) que o jogador pode compartilhar; outro jogador cola no menu pra ver o score

## 10. Curva de dificuldade

Por fase, a densidade e variedade aumentam:

| Fase | Inimigos por onda | Ondas | Tipos disponíveis | Velocidade geral |
|---|---|---|---|---|
| 1 | 3-5 | 5 | 1, 2, enxame | 1.0× |
| 2 | 4-7 | 6 | 1, 2, 3, 5, enxame | 1.1× |
| 3 | 5-8 | 7 | 1-6, enxame | 1.2× |
| 4 | 6-10 | 8 | 1-7, enxame | 1.3× |
| 5 | 7-12 | 9 | 1-8, enxame | 1.4× |

Calibrar no playtest. Objetivo: primeira passagem completa do jogo em ~30 min para jogador mediano.

## 11. Game feel — requisitos

Isso é **não-negociável** — é o que diferencia o jogo de um clone ruim:

- **Screen shake** leve em toda morte de inimigo, médio em boss hit, forte em death
- **Freeze frame** de ~40ms em hit do boss (tempo "mastigar o impacto")
- **Partículas** em: tiro saindo, inimigo destruído, pickup, dano no player
- **Easing** em todo movimento de UI (nada de transição linear dura)
- **Feedback de áudio** para cada input (shoot, move, pause, menu select)
- **Tinting** quando inimigo é atingido (piscar branco 80ms)

## 12. Open questions (a calibrar)

- [ ] Valores exatos de HP, dano de cada projétil
- [ ] Drop rate ideal de power-ups em playtest
- [ ] Duração exata de invulnerabilidade pós-dano
- [ ] Como "esconder" o terceiro tiro triplo nos lados — angular fixo ou homing leve?
- [ ] Boss final deveria ser o Coronel mesmo ou trocamos por algo mais memorável?
- [ ] Música muda por fase ou é uma música que evolui?
