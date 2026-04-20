# Art Bible — Os Cabra

> **Responsável**: Visual Designer. **Lê também**: UI/UX Designer, Gameplay Developer.
> **Depende de**: `GDD.md` (o que precisa ser desenhado).

## 1. Direção

**Xilogravura de cordel nordestina**, na linha de J. Borges, Gilvan Samico, Lula Côrtes. Traço preto forte e expressivo, cores sólidas, texturas de madeira entalhada. O absurdo e o folclórico convivem naturalmente nesse estilo.

**Fallback** (se gerar xilogravura consistente for inviável): cartoon hand-drawn com outline preto grosso e preenchimento em cores chapadas — tipo animação autoral brasileira (*O Menino e o Mundo*). Mantém o tom.

## 2. Referências visuais

- **J. Borges** — mestre da xilogravura de Bezerros/PE. Buscar "xilogravuras J. Borges"
- **Gilvan Samico** — xilogravura mais mítica, composições sagradas
- **Lula Côrtes** — capas de disco psicodélicas nordestinas
- **Cordéis de Bezerros** — composição narrativa, figuras rígidas mas expressivas
- **Bonecos de mamulengo** (Janduí, Solon) — tipologia de personagem cômico
- **Filme "O Auto da Compadecida"** — paleta e tipos humanos

> **Sempre coletar 5-10 imagens de referência antes de gerar qualquer sprite com IA.** Feed a IA com style references.

## 3. Paleta — Bloco de Frevo

**Xilogravura é TRAÇO, não paleta restrita.** O que define o estilo é a linha preta grossa, a textura de madeira entalhada, a silhueta forte, a composição folclórica. Os cordéis de Bezerros pós-1970 (J. Borges colorido, Derlon muralista recifense) são EXPLOSIVAMENTE coloridos — nada de sépia dominante, nada de fundo preto vazio.

Paleta base — inspirada em blocos de frevo, bandeirinhas de São João, tapetes de Maracatu, Galo da Madrugada real (a estátua):

| Cor | Hex | Uso |
|---|---|---|
| Preto entalhado | `#1a1a1a` | **Só linhas** — outlines grossos, hachura de madeira. Nunca fundo. |
| Rosa pink frevo | `#ff4d8f` | Sombrinhas, frente de blocos, carnaval, acentos quentes |
| Amarelo canário | `#ffd93d` | Sol, bandeirinhas, fitas, roupa de Calunga |
| Azul turquesa | `#3ec5e0` | Céu diurno, rio espelhado, detalhes frios |
| Verde mangue | `#3ea65a` | Vegetação, mangue, palmeiras, Comadre Fulozinha |
| Laranja abóbora | `#ff8b3d` | Pôr-do-sol, fogueira de São João, acento intermediário |
| Vermelho fogo | `#e63946` | Cabo de cordel, manto do Rei, bandeirinhas vermelhas |
| Roxo berinjela | `#7b3fa8` | Anoitecer, sombra quente, detalhes místicos |
| Creme claro | `#fff4d6` | Luz, destaque de lettering, highlight |

Regra de ouro: **saturação alta, contraste alto, traço preto forte**. Mínimo 4 cores por tela (monocromia é proibida exceto em dano/morte como freeze frame). Máximo 7 cores por tela pra manter legibilidade.

**Referências específicas**:
- J. Borges COLORIDO (pós-1970) — cordéis vermelho+azul+amarelo
- **Derlon** (muralista recifense) — paleta explosiva, Maracatu moderno
- Galo da Madrugada (estátua real, Recife) — rosa, azul, amarelo, vermelho
- Blocos de frevo — fitas multicoloridas
- Bandeirinhas de São João — confete visual
- Tapetes de Maracatu — detalhe bordado em cores cruas

## 4. Asset list (completo)

### Player
- **Galo da Madrugada** (nave do player): sprite base + 3 frames de animação de voo + animação de dano (flash)

### Inimigos (8 tipos + enxame)

Cada inimigo precisa de:
- Sprite "idle/moving" (2-4 frames)
- Frame de dano (flash branco ou estilo alternativo)
- Efeito de destruição (4-6 frames de explosão/dissolução em xilogravura)

1. **Passista de Frevo** — bailarino com sombrinha multicolorida, pose arqueada
2. **Caboclinho** — dançarino indígena com penacho e flecha
3. **Mamulengo** — boneco de madeira, expressão cômica exagerada
4. **Caboclo de Lança** — peitoral de fitas coloridas, lança gigante
5. **Urubu do Capibaribe** — urubu estilizado, gordo, asas abertas
6. **Papa-Figo** — figura sombria com capuz, segurando fígados
7. **Comadre Fulozinha** — criatura pequena cabeluda da mata
8. **Besta-Fera** — criatura híbrida bestial, chifres
9. **Mosca-da-Manga** — enxame, sprite único pequeno

### Bosses (3-5)

Cada boss precisa de:
- Sprite em 3 estados de HP (cheio, dano médio, quase morto)
- Animações de ataque específicas (2-4 por padrão de ataque)
- Efeito de derrota cinematográfico (dissolução ou quebra)

1. **Maracatu Nação** — trio Rei/Rainha/Calunga, coroa e mantos
2. **Homem da Meia-Noite** — boneco gigante de Olinda, cartola, smoking
3. **Galo da Madrugada Maligno** — versão corrompida com carne exposta bio-orgânica
4. (Opc) **Iara do Capibaribe** — sereia com cabelo de algas, poluição
5. (Opc) **O Coronel** — fazendeiro autoritário, chapéu e revólver, forma final monstruosa

### Power-ups

Ícones + animação de flutuar (bob 8px 1s loop):

- Fogo de Artifício Triplo (fogos estourando)
- Sombrinha de Frevo (sombrinha colorida)
- Cachaça Boa (garrafa)
- Tapioca Dobrada (tapioca branca enrolada)
- Baque-Virado (pequena Calunga)

### Cenários (fundos)

Cada fase é um **BIOMA FÍSICO DE RECIFE**, não um painel de pano de fundo. Parallax de 3 camadas obrigatórias (back/mid/fore), PNGs separados em `public/assets/backgrounds/fase<N>/{back,mid,fore}.png`. Nunca céu preto vazio.

**Fase 1 — Céu do Marco Zero em Carnaval** (mundo ao sol):
- `back.png`: azul turquesa vibrante, sol grande amarelo canário, nuvens em traço preto grosso
- `mid.png`: balões de festa (rosa/amarelo/roxo), bandeirinhas estendidas, pipas, fumaça de fogueira
- `fore.png`: casario colorido do Recife Antigo (fachadas rosa/amarelo/verde), Torre Malakoff, rio azul em primeiro plano

**Fase 2 — Ladeiras de Olinda subindo** (parallax vertical, mundo ensolarado):
- `back.png`: céu azul com igrejas brancas no alto (Igreja da Sé, Igreja do Carmo)
- `mid.png`: casarões amarelos/rosa/verdes/azuis em perspectiva descendo a ladeira
- `fore.png`: rua de pedra com pessoinhas pequenas dançando frevo, sombrinhas coloridas

**Fase 3 — Rua da Moeda à noite em carnaval** (não-preto, noite elétrica):
- `back.png`: céu roxo berinjela com fogos de artifício amarelos
- `mid.png`: prédios eclécticos de Recife Antigo, Igreja do Espinheiro iluminada
- `fore.png`: multidão de foliões com sombrinhas, confete caindo

**Fase 4 — Capibaribe ao Entardecer** (mundo onírico):
- `back.png`: céu pôr-do-sol laranja + rosa + roxo gradiente de cores vibrantes
- `mid.png`: palafitas em silhueta verde-escuro, garças voando, pontes
- `fore.png`: mangue verde com rio espelhado dourado, reflexos coloridos

**Fase 5 — Sertão ao meio-dia** (opcional, última fase):
- `back.png`: céu amarelo+laranja com sol rachado, vultos de serras
- `mid.png`: mandacaru e xique-xique em silhueta, caveira de boi
- `fore.png`: chão avermelhado, lagarto, pequenas plantas

**Menu** — único PNG `public/assets/backgrounds/menu.png` (não é layered, é arte de capa):
- Galo da Madrugada gigante ao amanhecer, mangue colorido, céu rosa/laranja, composição de capa de cordel

### UI
- Logo do jogo "OS CABRA"
- Loading bar com textura de cordel / fitas rasgadas
- Ícones de HUD: vida (galo pequeno), smart bomb (mini-garrafa), score (nenhum ícone)
- Fonte customizada ou escolha: buscar fonte display inspirada em cordel (ex: "Bluu Next", "Cooper Hewitt bold", ou gerar lettering na IA)

### VFX
- Partículas: pena (pra player), faísca, splat bio-orgânico (pra fígados etc), fumaça de cachaça, chamas de frevo
- Explosões: 3 variações (pequena, média, boss-sized)

## 5. Pipeline de produção

### 5.1 Buscar livres primeiro

Para cada asset, buscar em ordem:

1. **OpenGameArt.org** — filtra `xilogravura`, `woodcut`, `northeastern`, `folk`
2. **Kenney.nl** — não vai ter xilogravura, mas pode ter base pra editar
3. **itch.io > Free Game Assets** — buscar "woodcut", "brazilian folk"
4. **Freepik** (atenção à licença free) — ícones de frevo, maracatu existem
5. **Noun Project** — ícones em estilo xilogravura existem
6. **Flaticon** — idem

Pouco provável que bata o estilo exatamente — usar como inspiração ou adaptar.

### 5.2 Gerar com IA

**Primário: Google Gemini 2.5 Flash Image** (Nano Banana) via API
- Consistência de personagem superior — essencial pra ter mesmo inimigo em várias poses
- Tem API estável (Google AI Studio ou Vertex AI)
- Workflow: estabelecer personagem com 1 imagem base + descrição, depois pedir "mesma personagem em pose X"

**Fallback: Flux via Replicate/fal.ai**
- Se xilogravura sair melhor no Flux (ele tende a ser mais estilizado)
- Custo um pouco maior, qualidade estética geralmente superior

### 5.3 Prompt template para IA

```
Style: traditional Northeastern Brazilian woodcut print (xilogravura de cordel),
heavy black outlines, limited color palette of cream paper, brick red, ochre,
indigo, visible wood grain texture in solid areas, expressive rough carved lines,
sacred/folkloric composition inspired by J. Borges and Gilvan Samico.

Character: [DESCRIÇÃO]

Composition: character centered, facing camera, full body, game sprite orientation,
transparent/plain background for easy extraction, no text.
```

### 5.4 Pós-processamento

- Remover fundo (photopea.com, remove.bg, ou máscara manual)
- Cortar em tile/sprite size consistente (sugestão: 64×64 para inimigos pequenos, 128×128 médios, 256×256 grandes, 512×512+ bosses)
- Paleta: se a IA sair fora da paleta, reduzir em Photopea/GIMP/Aseprite
- Exportar PNG com alpha

## 6. Resolução e escala

- Jogo roda em **800×600**
- Regra de legibilidade: **silhueta tem que ser identificável em 60-80px na tela do jogador**. Isso implica arquivos maiores que o display size; em M3.1 (2026-04-19) corrigido o erro anterior de 32×32 (ilegível) pra:

| Entidade | Arquivo 1× | Arquivo @2× | Display típico em jogo |
|---|---|---|---|
| Player (Galo) | 128×128 | 256×256 | 80-100px (setScale ~0.7) |
| Inimigos regulares (passista, caboclinho, mamulengo) | 96×96 | 192×192 | 60-80px |
| Mosca-da-manga (enxame) | 64×64 | 128×128 | 40-50px |
| Boss Maracatu (cada figura) | 256×256 | 512×512 | 180-220px |
| Bullets player | 32×32 | 64×64 | ~24px |
| Bullets inimigos | 32×32–48×48 | 64×64–96×96 | dependendo do tipo |
| VFX partículas | 128×128 | — | 64-96px com scale |

- Arquivo @2× fica em `public/assets/sprites/@2x/` — Gameplay Dev escolhe qual carregar baseado em DPR
- **Densidade visual obrigatória**: em cada sprite dá pra ver rosto/expressão (olho, bico, boca), detalhes característicos (sombrinha, penacho, peso da Calunga) e silhueta reconhecível de longe
- `imageSmoothingEnabled: true` em canvas (arte IA é raster, não pixel art — smoothing ajuda no downscale)
- **Manter proporção consistente** entre personagens da mesma categoria — passista e caboclinho devem ter alturas parecidas (96×96 no arquivo, ~70px em tela)

## 7. Animação

- Sprite sheets com frames em linha (Phaser consome facilmente)
- Idle: 2-3 frames, ~6 FPS
- Movimento: pode usar tween Phaser (balanço suave) em vez de sprite animado — mais leve
- Morte: sequência curta (0.4s) seguida de partículas

Para boss, animação mais elaborada vale — até 12 frames por ataque.

## 8. Entregáveis do Visual Designer

1. **Mood board** — 20-30 imagens referência + 3 propostas de paleta
2. **Style guide** — 1 página definindo regras de traço, textura, cor
3. **Concept art** — Player, 3 inimigos (1 de cada fase inicial), 1 boss
4. **Assets prontos** — sprites exportados + spritesheets JSON para Phaser
5. **Parallax backgrounds** — 2 camadas por fase, PNG
6. **Icones de UI** — set completo

## 9. Open questions

- [ ] IA fica consistente o suficiente em xilogravura ou precisamos treinar LoRA?
- [ ] Fundo animado (parallax + elementos soltos) ou estático?
- [ ] Animação dos bosses em sprite-by-sprite ou rigged (partes separadas movidas por tween)? Rigged é mais leve mas menos xilográfico
