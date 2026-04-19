# Style Guide — Os Cabra

> **Responsável**: Visual Designer. **1 página.** Objetivo: manter consistência visual entre sprites gerados por IA, assets curados e placeholders.

## Espírito

Xilogravura de cordel nordestina. Traço grosso, cores chapadas, textura de madeira entalhada visível. Composição frontal, figuras rígidas mas expressivas. Absurdo folclórico tratado com naturalidade.

## 1. Traço

- **Outline sempre presente**, cor `#1a0f08` (preto pergaminho)
- **Espessura constante por categoria**:
  - Player, inimigos pequenos: 3px em sprite 128×128
  - Inimigos médios: 4px em 192×192
  - Bosses: 5-6px em 512×512+
- Traço **irregular, não liso** — simula entalhe manual. Se a IA gerar traço "vetorial" perfeito, rejeitar e repetir
- Nunca outline colorido. Nunca outline duplo
- Contornos internos (dobras de roupa, detalhes) com a mesma cor, espessura 1-2px menor que o outline externo

## 2. Preenchimento

- **Cores chapadas**, sem gradiente, sem anti-aliasing nas transições internas
- **Sem sombra projetada** no sprite. A sensação de volume vem de *hatching* (grupos paralelos de linhas finas em preto pergaminho) em áreas específicas, não em todas
- Máximo **3-4 cores sólidas por personagem** (não contando o outline)
- Respeitar a paleta em `docs/palette.md` — se IA sair fora, reduzir em pós-processamento

## 3. Textura

- **Grain de madeira discreto** nos preenchimentos médios/grandes (bosses, fundos). Nas figuras pequenas, usar com moderação ou só em 1 área de destaque
- Imperfeições de "impressão" (áreas levemente mal impressas, bordas desgastadas) são bem-vindas — *não* são defeito
- Nunca ruído digital genérico. Textura tem que parecer papel + tinta, não pixel art

## 4. Silhueta e proporção

- **Silhueta legível em 32×32 pixels** — jogador identifica o inimigo só pela forma, sem cor nem detalhe
- Personagens da mesma categoria têm **alturas proporcionais**:
  - Inimigos pequenos regulares: ~60-80% da altura do player
  - Inimigos médios (Mamulengo, Papa-Figo): ~100-120% do player
  - Bosses: 3× a 6× o player
- **Pose canônica** para sprite base: figura frontal, levemente arqueada se for "dinâmica" (passista), centrada, simétrica se possível
- Elementos distintivos do personagem (sombrinha do passista, penacho do caboclinho, fígado do Papa-Figo) devem estar **fora da silhueta central** para serem visíveis em movimento

## 5. Composição de cena (fundos)

- **Parallax em 2-3 camadas**:
  - Fundo distante: paleta muito restrita (2-3 cores), textura forte
  - Meio: elementos arquitetônicos/naturais reconhecíveis (Torre Malakoff, ladeiras, mangue)
  - Frente: elementos soltos ocasionais (ex: pena, confete, folha)
- Horizonte baixo (jogo é vertical, player fica embaixo) — 60% de "céu" ou paisagem aérea
- Movimento parallax sutil (deslocamento em ratios 0.3× / 0.6× / 1×)

## 6. Animação

- **Sprite-by-sprite** só em frames-chave (idle 2-3 frames, morte 4-6 frames)
- **Movimento por tween** (Phaser) para balanços, bobs, deslocamentos — mais leve e preserva estilo
- **Nunca squash & stretch extremo** — xilogravura é rígida. Squash sutil (5-8%) em hit/morte, sim
- Frame rate baixo: 6-8 FPS para idle, 10-12 FPS para morte/ataque. Alto FPS quebra o estilo

## 7. Feedback visual (responsabilidade compartilhada com Gameplay Dev)

- **Hit flash**: tint branco 80ms (override do sprite, sem alterar outline)
- **Morte**: 4-6 frames de "dissolução" (fragmentos em xilogravura se soltando) + partículas
- **Pickup**: flash da cor do power-up + partículas de penas/faíscas
- **Screen shake**: implementação em `EffectsManager` (TECH_SPEC); estilo não muda

## 8. Checklist antes de aprovar sprite

- [ ] Paleta bate com `docs/palette.md`
- [ ] Outline correto (cor, espessura)
- [ ] Silhueta legível em 32px
- [ ] Proporção consistente com outros da mesma categoria
- [ ] Sem gradiente, sem anti-alias interno, sem sombra projetada
- [ ] Textura de madeira adequada ao tamanho do sprite
- [ ] Background removido (PNG com alpha limpo)
- [ ] Licença registrada em `docs/VISUAL_LICENSES.md`

## 9. Fallback

Se xilogravura não render consistente via IA após 3 tentativas por personagem, usar **cartoon hand-drawn** (outline preto grosso, cores chapadas, tipo *O Menino e o Mundo*). Documentar a mudança em `docs/REPORT_VISUAL_DESIGNER.md` e manter o fallback para **todo** o jogo (não misturar estilos).
