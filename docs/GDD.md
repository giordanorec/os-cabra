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
- Setas 4 direções: movimento livre dentro da área de jogo (delimitada por bounds, HUD sempre visível)
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

### 5.1 Dano e velocidade dos projéteis inimigos

Regra geral: **todo projétil inimigo e toda colisão com inimigo custam 1 vida ao player**. Não há dano fracionado — shoot'em up clássico, legibilidade total. O que varia é *como difícil é evitar*.

| Projétil | Origem | Velocidade (px/s) | Hitbox | Trajetória | Observação |
|---|---|---|---|---|---|
| Bombinha | Passista de Frevo | 160 | 10×10 | Arco parabólico (g ≈ 400 px/s²) | Cai à frente do inimigo, telegrafada |
| Flecha | Caboclinho | 260 | 6×18 | Reta vertical | Rápida, mas em linha previsível |
| Cabeça-projétil | Mamulengo | 140 | 14×14 | Homing fraco (correção ±60°/s, perde o tracking após 2s) | Player consegue "virar" ela |
| Lança | Caboclo de Lança | 300 | 6×28 | Reta, dispara no eixo do player no instante do tiro | Telegrafa 300ms antes (brilho na ponta) |
| Fígado pulsante | Papa-Figo | 180 | 12×12 | 3 em rajada, 150ms entre cada, leque de 20° | Padrão, pulsa visualmente |
| Cipó | Comadre Fulozinha | 130 | 8×20 | Senoide (amplitude 60px, período 1s) | Lento, mas ocupa corredor |
| Bola de fogo | Besta-Fera | 220 | 16×16 | Reta, mira no player no instante do tiro | Alto dano visual, hitbox grande |

Colisão direta com inimigo: 1 vida perdida + inimigo **também** morre (exceto boss, que apenas empurra o player). Urubu do Capibaribe, por ser kamikaze, é o único cuja estratégia ótima é matá-lo *antes* que ele atinja a linha do player.

## 6. Bosses

Um boss ao final de cada fase. Cada um tem **3 fases de padrão** (HP quebrado em terços — ao cair abaixo de 66% e 33% transiciona, com **freeze frame de 400ms + flash branco**). Bosses não morrem por colisão — player nunca perde vida ao encostar, só é empurrado.

Pontuação ao derrotar: **5.000 base + 1.000 × vidas restantes** (ver seção 9).

Legenda: *HP total* = 100% da barra. *Tiro* descreve projétil, velocidade, cadência.

### 6.1 Fase 1 — Marco Zero: Maracatu Nação (trio Rei, Rainha, Calunga)
- **HP total**: 80
- **Entrada**: trio desliza do topo para posição ~y=120. Freeze 1.5s + letreiro "OXE!"
- **Fase A (HP 80→54, 100%→67%)** — *Cortejo*
  - Trio parado em formação, Calunga no centro
  - Tiro em leque a cada **2.5s**: 5 projéteis, spread 40° total, velocidade 200 px/s
  - Rei e Rainha balançam lateralmente ±40px em 1.5s
- **Fase B (HP 54→27, 66%→34%)** — *Calunga solta*
  - Rei e Rainha continuam com leque de 5 tiros, agora a cada **2s**
  - Calunga se destaca, desce até y≈300 e vira projétil teleguiado (hitbox 18×18, speed 160 px/s, destrutível com 3 tiros) a cada **4s**; se destruído, Calunga respawna no centro após 1.5s
- **Fase C (HP 27→0, 33%→0%)** — *Corredor*
  - Rei e Rainha vão para laterais (x=150 e x=650), mantêm leque a cada **1.8s** direcionado ao centro
  - Calunga oscila horizontalmente no centro (y≈140), atirando rajada reta de 3 projéteis rápidos (300 px/s) a cada **1.5s**
  - A cada **6s**, varrida horizontal telegrafada (linha vermelha 0.6s) que cruza a tela em 0.8s — player deve estar fora da linha

### 6.2 Fase 2 — Ladeiras de Olinda: Homem da Meia-Noite
- **HP total**: Corpo 60, Braço Esquerdo 25, Braço Direito 25 (total efetivo 110). Corpo só recebe dano quando **ao menos um braço está destruído**.
- **Entrada**: boneco cresce da base pra cima, ocupando metade vertical. Freeze 1.5s + "OXE!"
- **Fase A (braços intactos)** — *Festeiro*
  - Braço esq: solta 2 bombinhas em arco a cada **3s** (gravidade 380 px/s², spread 80px)
  - Braço dir: dispara laser telegrafado — aviso 1s (linha amarela), tiro 0.4s (linha vermelha reta, dano 1 vida); ciclo **4s**
  - Corpo invulnerável, mas já pode ser "marcado" visualmente (silhueta pulsa)
- **Fase B (1 ou 2 braços destruídos, corpo HP 60→30)** — *Desengonçado*
  - Braço(s) restante(s) agora *oscilam* como pêndulo (amplitude 120px, período 2s) enquanto atacam com cadência 30% mais rápida
  - Corpo vulnerável; emite **ring burst** de 6 tiros radiais a cada **3s** (speed 180 px/s)
- **Fase C (corpo HP 30→0)** — *Moinho*
  - Todos os braços remanescentes giram em torno do corpo (360°/4s), disparando bombinhas a cada 0.6s nos pontos cardinais
  - Corpo emite ring burst de 8 tiros a cada **2s**
  - Se ambos os braços foram destruídos, o moinho é "fantasma" — efeito visual apenas, sem dano; incentiva o player a matar os braços antes

### 6.3 Fase 3 — Recife Antigo: Galo da Madrugada Maligno
- **HP total**: 120
- **Entrada**: galo gigante descende do topo cacarejando distorcido. Freeze 1.5s + "OXE!"
- **Fase A (HP 120→80)** — *Galo Assentado*
  - Move-se lentamente em padrão ∞ no topo (amplitude x=±200, y=±40, período 5s)
  - Cospe **2 ovos** a cada **2s** em arco parabólico (gravidade 420 px/s², lançados em ângulos aleatórios 60°–120°)
  - Ovos explodem ao tocar o fundo da tela em AoE 80px (0.3s persiste — zona de negação)
- **Fase B (HP 80→40)** — *Ninhada*
  - Ovos continuam (1 a cada 2s — cadência reduzida)
  - A cada **4s**, cospe **formação de 3 galinhas-pintinho** kamikaze (HP 1 cada, speed 220 px/s, perseguem player por 3s depois saem da tela)
- **Fase C (HP 40→0)** — *Cocoricó Final*
  - Ovos rapid-fire: 1 a cada **1s**, cadência dupla
  - Pintinhos: formação de 5 a cada **3s**
  - A cada **8s**, berra — screen shake 400ms + **todos os inimigos ativos aceleram 20%** durante 3s
  - Boss emite aura de penas que restringe área segura no centro (corredores laterais viram mais viáveis)

### 6.4 Fase 4 (opcional) — Capibaribe: Iara do Capibaribe
- **HP total**: 140
- **Mecânica nova**: Iara **regenera 2 HP/s** se o player ficar parado mais de 1.5s (medido pelo input de movimento). Força flow constante.
- Fase A: correntes de lixo retas lentas (speed 150 px/s, spawn cada 1.5s, 1-2 simultâneas)
- Fase B: garrafas PET em leque de 5, rotacionam ao cair (speed 200 px/s, cadência 2s)
- Fase C: emerge totalmente do rio, abraço de correntes — cria **2 paredes móveis de lixo** que empurram o player para dentro da tela e se fecham devagar (reduz área jogável em 30%)

### 6.5 Fase 5 (final) — O Coronel
**Decisão**: mantido como boss final. A figura satírica do poder é um **anti-clímax deliberado** que só funciona porque as fases anteriores apresentaram folclore. Trocar por algo "mais memorável" perderia a graça pernambucana (é o Coronel virando monstro bio-orgânico — o absurdo é ele estar lá no fim, não outro bicho exótico). Opção de v2: adicionar "Fase Secreta" com figura alternativa em New Game+.

- **HP total**: 180
- Fase A — *Discurso*: pergaminhos "Lei" se desenrolam do topo como projéteis retos (speed 180 px/s) + capangas humanos (3 Caboclinhos reciclados) a cada 6s
- Fase B — *Campanha*: cédulas de dinheiro em chamas cruzam a tela em ziguezague (speed 240 px/s, padrão senoide amplitude 100px) + mini-formações de capangas
- Fase C — *Máscara cai*: Coronel revela forma bio-orgânica final (sprite muda). Ataques anteriores combinados + **lasers de "poder"** (telegrafados 1s, tiro 0.6s, 2 simultâneos) + ring burst a cada 4s

### 6.6 Regras gerais de boss
- Projéteis de boss causam 1 vida de dano (mesma regra dos inimigos)
- Varridas/lasers telegrafados sempre têm ≥500ms de aviso visual
- Freeze frame de **80ms** a cada hit bem-sucedido do player no boss (só 40ms em hit comum — boss é mais "gostoso" de bater)
- Boss não dropa power-up; dropa uma "Tapioca" garantida (+1 vida) a cada *segundo* boss derrotado (Fase 2, Fase 4) — recompensa milestone

## 7. Power-ups

**Drop rate base**: 15% de chance ao destruir qualquer inimigo com HP ≥ 2 (Mamulengo, Caboclo de Lança, Papa-Figo, Comadre Fulozinha, Besta-Fera). Enemigos de 1 HP (Passista, Caboclinho, Urubu, Mosca) **não dropam** — evita piñata em ondas de enxame e torna inimigos "gordos" significativos.

**Quando dropa, seleção ponderada** (soma 100):

| Peso | Nome | Efeito | Duração |
|---|---|---|---|
| 35 | Fogo de Artifício Triplo | Tiro se abre em 3: centro + ±18° (ângulo **fixo**, sem homing) | Até levar dano |
| 30 | Sombrinha de Frevo | Escudo giratório, absorve 1 hit | Até levar hit |
| 20 | Cachaça Boa | Smart bomb, estoca até 2 (HUD mostra) | Consumível (tecla X) — limpa tela de projéteis e causa 10 de dano em tudo na tela |
| 12 | Baque-Virado | Wingman calunga atira junto (50% do cooldown) | 18 segundos |
| 3 | Tapioca Dobrada | +1 vida | Instantâneo |

**Tapioca garantida**: bosses das Fases 2 e 4 sempre dropam uma Tapioca Dobrada ao morrer, fora do sistema de pesos (ver §6.6). Isso dá +2 vidas garantidas ao longo do jogo completo de 5 fases, sem precisar depender de RNG.

**Triplo fixo, não homing**: a escolha por ângulo fixo mantém o skill ceiling arcade — player precisa se posicionar. Homing tornaria o power-up dominante demais. O leque de ±18° é estreito o bastante para o player ainda mirar, amplo o suficiente para limpar ondas.

**Regras de coleta**:
- Só um power-up de "arma" ativo por vez (Fogo Triplo e Sombrinha substituem-se mutuamente ao pegar)
- Baque-Virado é independente — pode coexistir com Fogo Triplo/Sombrinha
- Cachaça Boa e Tapioca Dobrada são instantâneos/estocados, nunca substituem outro power-up ativo
- Ao levar dano, Fogo Triplo é perdido; Sombrinha só se perde ao absorver hit
- Drop fica em tela por 8s piscando nos 2s finais; some depois — não fica pra sempre
- Pickup dá 50 pontos

## 8. Vidas e checkpoint

- 3 vidas no começo da partida (base **não-negociável**)
- Colisão com inimigo/projétil = perde 1 vida + **invulnerabilidade de 1.2s**, piscando a 8 Hz (125ms on/off)
  - Decisão: reduzido de 1.5s para 1.2s. Justificativa: 1.5s em testes mentais deixa sensação "morno" em fases densas — 1.2s mantém a sensação de perigo sem ser punitivo. Se playtest acusar que é pouco, subir para 1.35s. Controlado por constante `PLAYER_INVULN_MS = 1200` em `src/config.ts`.
- Durante invulnerabilidade: player continua podendo se mover e atirar; **colisões não causam dano mas ainda matam inimigos kamikaze** (Urubu, Mosca, pintinho do Galo) — incentiva bancar a colisão quando faz sentido
- Zerou vidas = Game Over → tela "SE LASCOU" → volta ao menu
- **Checkpoint**: ao passar **50% das ondas antes do boss** (ex: final da Wave 3 de 5 na Fase 1). Salva snapshot de: vidas atuais, power-up ativo, score parcial, ondas consumidas. Morrer durante a fase (mas ainda com vidas) recomeça do checkpoint com as vidas que tinha **no checkpoint** (não as de agora). Game Over total ainda volta ao começo da fase sem checkpoint
- Checkpoints **não** acumulam entre fases — cada fase começa fresh com as vidas que você tinha ao entrar

## 9. Scoring

- Cada inimigo: valores na tabela acima
- Boss derrotado: 5.000 pontos + bônus por vidas remanescentes (×1.000)
- Chain: matar 5 inimigos sem perder vida no intervalo = multiplicador ×1.5 temporário
- Highscore local (localStorage chave `os_cabra_highscore`)
- Ao fim da partida, gerar **código de 6 caracteres** (base36 do score + hash simples) que o jogador pode compartilhar; outro jogador cola no menu pra ver o score

## 10. Curva de dificuldade

Revisada em relação ao rascunho original: adicionadas colunas de intervalo entre ondas, HP de boss e duração-alvo da fase. Pouca coisa mudou na espinha; a adição é para o Gameplay Dev saber o "feel" alvo sem precisar caçar o número.

| Fase | Inimigos/onda | Ondas | Tipos (ver §5) | Vel. geral | Intervalo entre ondas | HP boss | Duração alvo |
|---|---|---|---|---|---|---|---|
| 1 | 3-5 | 5 | 1, 2, 9 (enxame) | 1.0× | 10-12s | 80 | ~2:30 |
| 2 | 4-7 | 6 | 1, 2, 3, 5, 9 | 1.1× | 9-11s | 60+25+25 (corpo + braços) | ~3:30 |
| 3 | 5-8 | 7 | 1-6, 9 | 1.2× | 8-10s | 120 | ~4:30 |
| 4 (opc) | 6-10 | 8 | 1-7, 9 | 1.3× | 7-9s | 140 | ~5:30 |
| 5 (opc) | 7-12 | 9 | 1-8, 9 | 1.4× | 6-8s | 180 | ~6:30 |

**Duração alvo total** (MVP 3 fases): ~10:30 de gameplay puro; com telas de transição, intros e morte ocasional, ~15-20 min para jogador mediano. Jogo completo (5 fases): ~30 min.

**"Velocidade geral"** multiplica: velocidade de inimigo, velocidade de projétil inimigo, cadência de tiro inimigo. Player stats **não** escalam — a dificuldade aumenta por hostilidade, não por nerf do jogador.

**Regras de pacing**:
- Sempre alternar ondas densas com ondas esparsas (permitir respiros de 2-3s sem tiros na tela)
- Enxame de Mosca-da-Manga **nunca na primeira onda** de uma fase — é "prato principal", não aperitivo
- Inimigo novo de uma fase é **sempre introduzido sozinho** na primeira onda que aparece (ensina o padrão)
- Checkpoint sempre depois de uma onda "fácil", não antes (senão sensação de cheating)

## 11. Game feel — requisitos

Isso é **não-negociável** — é o que diferencia o jogo de um clone ruim:

- **Screen shake** leve em toda morte de inimigo, médio em boss hit, forte em death
- **Freeze frame** de ~40ms em hit do boss (tempo "mastigar o impacto")
- **Partículas** em: tiro saindo, inimigo destruído, pickup, dano no player
- **Easing** em todo movimento de UI (nada de transição linear dura)
- **Feedback de áudio** para cada input (shoot, move, pause, menu select)
- **Tinting** quando inimigo é atingido (piscar branco 80ms)

## 12. Decisões do Game Designer (closed) e questões remanescentes

### Decisões fechadas nesta iteração

| Tópico | Decisão | Onde |
|---|---|---|
| HP de inimigos regulares | Mantidos os valores da tabela §5 (nenhum ajuste). Justificativa: configuração clássica 1/2/3/4/5 já respeita a hierarquia de ameaça | §5 |
| Dano de projéteis inimigos | **1 vida por hit**, regra universal. Variação fica na trajetória/telegrafe | §5.1 |
| Drop rate de power-ups | **15% base** em inimigos 2+ HP; inimigos 1 HP não dropam; seleção ponderada 35/30/20/12/3 | §7 |
| Invulnerabilidade pós-dano | **1.2s** (reduzido de 1.5s), com pisca a 8 Hz | §8 |
| Formato do Fogo Triplo | **Ângulo fixo** ±18° + centro (sem homing) | §7 |
| Boss final | **O Coronel** mantido. Anti-clímax proposital; alternativa (figura secreta) fica para v2 NG+ | §6.5 |
| Música | **Uma música por fase**, com arranjo que remixa boss fight. Evita complexidade de trilha evolutiva e ainda dá identidade por região | §11.1 (abaixo) |

### Questões ainda em aberto (arquiteto + outros especialistas)

- [ ] **Evento de "Cachaça Boa" tem tecla X ou outra?** — Decidi X como placeholder; arquiteto/UX podem mudar se conflitar com remap futuro
- [ ] **Checkpoint respawn: animação?** — decisão de polish com Gameplay Dev (ex: player fade-in de 500ms, 1s de invulnerabilidade extra)
- [ ] **Bosses encerram a onda anterior ou sobem entre ondas?** — implementação: Gameplay Dev decide. Recomendo: boss spawn só após onda final limpa (score settle)
- [ ] **Balance pass pós-playtest**: todos os números acima são "fase de papel". Plano é rodar playtest em Milestone 2 (Fase 1 jogável) e Milestone 6 (MVP 3 fases) e revisitar
- [ ] **Chain multiplier decays como?** — §9 diz "×1.5 temporário", mas não quanto dura. Sugiro **4s sem matar = reset**; confirmar com QA em playtest

## 11.1 Música — diretriz

Decisão: **uma música por fase** + remix/layer extra durante boss.

- Fase 1 — **Marco Zero**: base frevo em andamento moderado, percussão dominante
- Fase 2 — **Olinda**: maracatu rural, caixa forte, andamento mais lento e pesado
- Fase 3 — **Recife Antigo**: mangue beat, mistura frevo + eletrônico, andamento alto
- Fase 4 (opc) — **Capibaribe**: ciranda lenta e melancólica, muitos "gotejos" sonoros
- Fase 5 (opc) — **Coronel**: forró pé-de-serra distorcido, triple de velocidade no final

**Boss fight** = mesma música da fase, **+10% BPM**, acrescentar camada de metais/distorção. Cross-fade de 2s ao aparecer o boss. Motiva cohesion (mesma fase = mesmo clima) sem custo de composição duplicada. Responsabilidade de produção: Sound Designer (ver `SOUND_SPEC.md`).
