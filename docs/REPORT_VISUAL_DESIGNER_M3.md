# Report — Visual Designer M3 (Pivô "Xilogravura Colorida")

## Objetivo

Corrigir o feedback crítico do Arquiteto sobre v1 em produção — visual "Galaga cordelizado", marrom, com fundo preto vazio e logo sans-serif. Refazer toda a direção sob a regra nova do projeto: **xilogravura é TRAÇO, não paleta restrita**. Paleta passa a ser "Bloco de Frevo" (vibrante: rosa pink, amarelo canário, azul turquesa, verde mangue, laranja, vermelho fogo, roxo berinjela). Player vira personagem Angry Birds, não nave. Inimigos caem como personagens físicos (paraquedista, corda de seda, marionete). Backgrounds são biomas de Recife em 3 camadas parallax.

## O que foi feito

- **26 gerações Gemini 2.5 Flash Image** com style preamble reescrito pra paleta frevo e `--reference` forte para consistência do trio Maracatu (Rainha e Calunga referenciam Rei)
- **Pipeline**: SVG do M2 aposentado; Gemini é fonte primária agora
- **Post-processamento**: flood-fill de fundo branco → alpha nos sprites/overlays; cover-crop 800×600 nos backgrounds back; variantes @2× dos sprites pra HiDPI
- **Doc ART_BIBLE.md**: §3 (paleta) reescrita pra Bloco de Frevo; §4 (cenários) reescrita com descrição dos 3 biomas entregues + 2 preparados

### Entregáveis por pasta

**`public/assets/sprites/`** (9 PNGs + 6 variantes @2×)
- `player.png` (32×32) — Galo chubby Angry Birds style, paleta frevo, expressivo
- `enemy-passista.png` (32×32) — paraquedista com sombrinha aberta acima da cabeça
- `enemy-caboclinho.png` (28×28) — pendurado em corda de seda com arco
- `enemy-mamulengo.png` (32×32) — **novo**, marionete pendurada em cordas visíveis
- `enemy-mosca.png` (16×16) — chunky fly-character, não ponto preto
- `boss-rei.png`, `boss-rainha.png`, `boss-calunga.png` (256×256) — trio Maracatu completo
- `bullet-player.png` (16×16) — grão de milho dourado (não laser)

**`public/assets/backgrounds/`** (10 PNGs, 800×600)
- `menu.png` — Galo gigante num mangue ao amanhecer, céu rosa/laranja/amarelo radiante
- `fase1/{back,mid,fore}.png` — Marco Zero em carnaval: céu turquesa+sol, balões+bandeirinhas, casario colorido+Torre Malakoff
- `fase2/{back,mid,fore}.png` — Ladeiras de Olinda: céu com igrejas brancas, casarões coloridos, rua com foliões
- `fase4/{back,mid,fore}.png` — Capibaribe ao entardecer: céu pôr-do-sol, palafitas+garças, mangue verde com rio espelhado dourado
- Camadas `mid` e `fore` com alpha flood-filled — prontas pra parallax overlay

**`public/assets/ui/`** (4 PNGs)
- `logo-os-cabra.png` (700×620) — lettering "OS CABRA" colorido com ornamentação cordel (bodes, ribbons, figuras)
- `moldura-cordel.png` (600×450) — frame decorativo colorido com center transparente
- `icon-vida.png` (64×64) — galinho chibi fofo
- `icon-bomba.png` (64×64) — garrafinha de cachaça colorida

**`public/assets/vfx/`** (3 PNGs 128×128)
- `vfx-explosao.png` — burst de confete em cores frevo
- `vfx-muzzle-penas.png` — spray radial de penas coloridas
- `vfx-hit-flash.png` — estrela de impacto amarelo+vermelho

## Arquivos alterados/criados

**Novos** (48 total, sem contar raws gitignored)
- `docs/REPORT_VISUAL_DESIGNER_M3.md` (este arquivo)
- `docs/milestone-reports/visual-m3/evidence-*.png` (6 screenshots)
- `public/assets/backgrounds/fase1/{back,mid,fore}.png`
- `public/assets/backgrounds/fase2/{back,mid,fore}.png`
- `public/assets/backgrounds/fase4/{back,mid,fore}.png`
- `public/assets/backgrounds/menu.png`
- `public/assets/sprites/player.png` (substitui o SVG-derivado do M2)
- `public/assets/sprites/enemy-{passista,caboclinho,mamulengo,mosca}.png` (4)
- `public/assets/sprites/boss-{rei,rainha,calunga}.png` (3)
- `public/assets/sprites/bullet-player.png`
- `public/assets/sprites/@2x/*.png` (6 variantes)
- `public/assets/ui/{logo-os-cabra,moldura-cordel,icon-vida,icon-bomba}.png`
- `public/assets/vfx/vfx-{explosao,muzzle-penas,hit-flash}.png`
- `scripts/art/gemini/postprocess.py` (novo)

**Modificados**
- `docs/ART_BIBLE.md` — §3 Paleta (Bloco de Frevo); §4 Cenários (3 biomas descritos)
- `scripts/art/gemini/generate.py` — `STYLE_PREAMBLE` e `COMPOSITION_SUFFIX` reescritos pra paleta frevo, fundo branco sólido, proibido sépia/fundo preto

**Removidos/substituídos** — os sprites do M2 (`player`, `enemy-passista`, `enemy-caboclinho`, `enemy-mosca`, `boss-maracatu`) continuam no repo como legado, mas a `PreloadScene` deve preferir os novos PNGs (chave é o mesmo nome nas minhas entregas, sem `.json` atlas por enquanto; Gameplay Dev pode manter `player.json` para animações se reinstruir atlas no futuro — por ora, cada PNG é uma imagem única single-frame para simplicidade).

## Decisões técnicas

1. **Single-frame PNGs, não atlas JSON** — M3 é pivô de direção; atlas multi-frame viria só depois do Arquiteto aprovar a direção. Gameplay Dev carrega via `load.image(key, path)`, anima via tween. Quando o estilo estiver chancelado, M4 volta com spritesheets.
2. **Backgrounds em sub-diretórios `fase1/`, `fase2/`, `fase4/`** em vez do formato plano `fase1-bg-back.png` do M3 anterior — alinha com a estrutura pedida no prompt ("public/assets/backgrounds/fase1/back.png") e deixa implícito o trio back/mid/fore por fase.
3. **Fase 3 e Fase 5 não foram geradas neste M3** — user listou explicitamente fase 1, 2 e 4. Se o Arquiteto quiser 3 e 5 no mesmo milestone, peço +6 gerações (~$0.24) num M3.1.
4. **Tiro do player como grão de milho** — alternativa à pena foi escolhida porque silhueta de grão lê melhor em 16×16 (mais compacto, mais arcade-readable) do que uma pena alongada.
5. **Mamulengo como novo inimigo** — não estava nos sprites do M2, entra agora caracterizado como marionete pendurada em cordas visíveis (fiel à tradição pernambucana de Janduí/Solon).
6. **VFX em 128×128** — é tamanho intermediário; Gameplay Dev pode escalar com `setScale()` conforme precise em partículas ou em explosões grandes.
7. **Raw outputs gitignorados** (via `.gitignore` já presente) — PNGs finais processados são os únicos tracked.

## Budget

26 × $0.039 ≈ **$1.02** (target ~$1.60, 35% abaixo). Sobra pra ~14 gens de retry/variações se o Arquiteto pedir ajustes. Não usei `--count`, cada chamada tirou 1 imagem.

## Blockers / dúvidas pro Arquiteto

- **Fase 3 e Fase 5**: preciso das 3 camadas de cada (6 gens, ~$0.24) pra cobrir o jogo completo. Sugiro incluir num M3.1 caso a direção seja aprovada.
- **Atlas JSON para animações**: como decidi single-frame aqui, pra animar idle/flap do Galo (e dos inimigos) a Gameplay Dev vai precisar de frames adicionais em M4. Em vez disso, tween de Phaser (bob/scale) pode dar vida sem spritesheet — mais leve.
- **Sprite dos projéteis inimigos** (flecha, bombinha, cipó, fígado, bola-de-fogo) — ficaram do M3 anterior. Precisam ser regenerados com a paleta frevo? Ou o tween/tint dá conta? Sugestão: regenerar só o que aparecer em fase 1 (flecha, bombinha) em M3.1.
- **Power-ups** (5 ícones) — também do M3 anterior. Mesma pergunta.

## Evidências visuais

Imagens finais copiadas em `docs/milestone-reports/visual-m3/`:
- `evidence-01-menu.png` — menu splash com Galo gigante (dá uma ideia da vibe de todo o jogo)
- `evidence-02-fase1-back.png` — céu turquesa com sol canário (prova que não é mais preto)
- `evidence-03-player.png` — Galo chubby 64×64 (paleta frevo bate)
- `evidence-04-mamulengo.png` — marionete com cordas visíveis
- `evidence-05-boss-rei.png` — Rei Maracatu 256×256 com manto pink
- `evidence-06-logo.png` — logo OS CABRA colorido

## Próximo passo

- **Arquiteto integra** via `PreloadScene` (carregar menu.png, backgrounds/fase1/*, ícones, VFX) e `MenuScene` (trocar texto pelo `logo-os-cabra.png`), `GameScene` (adicionar 3 camadas de parallax da Fase 1 e velocidades diferentes pra cada).
- **QA valida** a vibe em contexto do jogo (paleta contrasta com sprite do player? Parallax funciona? Backgrounds não competem com gameplay?)
- **Se aprovado**, eu volto em **M3.1** pra: fase 3 + fase 5 parallax, regeneração dos projéteis inimigos e power-ups na paleta frevo, frames de ataque do boss Maracatu.
