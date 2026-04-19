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

## 3. Paleta

Base (xilogravura tradicional tem paleta restrita):

| Cor | Hex | Uso |
|---|---|---|
| Preto pergaminho | `#1a0f08` | Background base, outlines |
| Papel antigo | `#f4e4c1` | Base de "canvas" |
| Vermelho tijolo | `#b84a2e` | Sangue, fogo, acentos quentes |
| Ocre | `#d4a04c` | Madeira, pele, dourado |
| Índigo | `#2a4a6e` | Noite, água do Capibaribe |
| Verde folha | `#5a7a3a` | Vegetação, Comadre Fulozinha |
| Rosa fosco | `#d66b7a` | Frevo, carnaval |

Paletas auxiliares por fase — o Visual Designer define. Manter sempre 5-7 cores no máximo por tela.

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

Fundo em parallax de 2-3 camadas por fase:

1. **Marco Zero** — Recife Antigo com a Torre Malakoff à distância, cais, embarcações
2. **Ladeiras de Olinda** — casas coloridas em perspectiva, ladeiras descendo
3. **Recife Antigo / Carnaval** — Rua da Moeda, Igreja do Espinheiro, confete caindo
4. **Capibaribe** — rio com pontes (Pte Maurício de Nassau), mangue
5. **Fazenda / Sertão** — opcional, última fase

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

- Jogo roda em 800×600
- Sprites projetados em 2× (renderiza mais nítido em telas HiDPI): ex. inimigo pequeno em 128×128 no arquivo, exibido 64×64
- `imageSmoothingEnabled: false` em canvas (já via CSS `image-rendering: pixelated`)
- Importante: **manter proporção consistente** — passista e caboclinho não podem ter alturas muito diferentes entre si sem propósito

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
