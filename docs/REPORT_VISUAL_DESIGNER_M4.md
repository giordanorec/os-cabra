# Report — Visual Designer M4 (Bestiário + Céu + Projétil)

## Objetivo

Três direções paralelas pedidas pelo Arquiteto:
- **A)** Projéteis do player alternativos (pena / grão de milho) — desbloquear bug do tiro
- **B)** Expandir bestiário recifense com inimigos decorativos, mini-bosses e tributos culturais (Capivara querubim, Caranguejo-Saci, Chico Science, Tribalistas, Mestre Salu, bonecos gigantes Olinda)
- **C)** Resolver "céu vazio" permanente com elementos decorativos para sobrepor os backgrounds de parallax (bandeirinhas, balões, pipas, fogos, pássaros, nuvens)

Budget alvo ~$1.20 (30 imagens).

## O que foi feito

**26 gerações Gemini 2.5 Flash Image** (25 iniciais + 1 retry por contaminação de style-ref), **$1.01** final. Uso forte de `--reference` nos assets M3 (menu-bg.png, boss-rei.png, vfx-explosao.png) para manter a paleta frevo.

### A) Projéteis player (2 sprites)
- `public/assets/sprites/pena-player.png` (32×32 + @2x 64×64) — pena de galo rosa+amarela
- `public/assets/sprites/milho-player.png` (32×32 + @2x 64×64) — grão de milho canário/laranja

Ambos disponíveis. Gameplay Dev escolhe qual vira default em `src/config.ts` (troca o `key` no `this.load.image`).

### B) Bestiário expandido (9 sprites)
- `enemy-capivara.png` (96×96 + @2x) — capivara com asinhas de querubim, pacífica
- `enemy-caranguejo-saci.png` (96×96 + @2x) — caranguejo com pé único + gorro Saci vermelho
- `enemy-tribalistas.png` (128×96 + @2x) — trio Arnaldo + Carlinhos + Marisa cantando junto
- `enemy-mestre-salu.png` (128×128 + @2x) — mestre de maracatu com bumbo gigante (mini-boss)
- `powerup-chico-science.png` (96×128 + @2x) — Chico Science com penacho maracatu + óculos escuros + jaqueta rocker
- `boneco-mulher-dia.png` (128×160 + @2x) — boneco gigante Olinda em vestido amarelo + chapéu floral
- `boneco-menino-tarde.png` (128×160 + @2x) — boneco gigante Olinda em roupinha marinheiro rosa/canário

Todos com `--reference=boss-rei.png` para consistência estética com o trio Maracatu do M3.

### C) Céu decorativo (16 sprites em `public/assets/sky/`)

Bandeirinha wide (512×128):
- `bandeirinha.png` — string longa de triângulos coloridos atravessando a tela

Balões (4 × 128×128):
- `balao-rosa.png`, `balao-amarelo.png`, `balao-turquesa.png`, `balao-laranja.png`

Pipas (2 × 128×128):
- `pipa-losango.png` (diamante tradicional), `pipa-arraia.png` (arraia com rabiola)

Fogos (3 × 128×128):
- `fogo-rosa.png`, `fogo-amarelo.png`, `fogo-dourado.png`

Pássaros (2):
- `passaro-pequeno.png` (64×64), `passaro-grande.png` (128×128)

Nuvens (3 × 128×96):
- `nuvem-galo.png` (formato de galo), `nuvem-coracao.png`, `nuvem-comum.png`

Extra:
- `sol-sorrindo.png` (128×128) — sol antropomórfico com raios alternados canário/laranja

## Arquivos alterados/criados

**Novos** (56 arquivos)
- `docs/REPORT_VISUAL_DESIGNER_M4.md` (este arquivo)
- `docs/milestone-reports/visual-m4/evidence-*.png` (7 screenshots)
- `public/assets/sprites/pena-player.png`, `milho-player.png` (+ @2x)
- `public/assets/sprites/enemy-{capivara,caranguejo-saci,tribalistas,mestre-salu}.png` (+ @2x)
- `public/assets/sprites/powerup-chico-science.png` (+ @2x)
- `public/assets/sprites/boneco-{mulher-dia,menino-tarde}.png` (+ @2x)
- `public/assets/sky/*` (16 arquivos decorativos)
- `scripts/art/gemini/postprocess_m4.py` (reutiliza helpers do `postprocess.py` M3)

**Modificados**
- `docs/VISUAL_LICENSES.md` — +27 entradas (9 sprites + 16 sky + 2 projéteis)

## Decisões técnicas

1. **Postprocess separado `postprocess_m4.py`** em vez de editar o script M3 — M3 ainda não mergeou, evita conflito de merge, e o script importa os helpers do M3 via `sys.path`. Quando o Arquiteto mergear M3 + M4, dá pra consolidar num único script.
2. **Pasta `public/assets/sky/`** (nova) em vez de misturar com `sprites/` — semântica clara para Gameplay Dev: esses assets são decorativos, não interativos. Preloader pode agrupar via glob.
3. **Nomes sem prefixo `sky-` dentro da pasta** (`bandeirinha.png`, `balao-rosa.png`) — pasta já dá o namespace. `this.load.image('sky-bandeirinha', 'assets/sky/bandeirinha.png')` fica legível na key.
4. **Bonecos Olinda portrait (128×160)** vs. inimigos quadrados (96×96) — ratio reflete altura natural dos bonecos gigantes (~4m reais). Importante manter essa diferença visual em tela.
5. **Tribalistas em sprite único** (128×96) em vez de 3 separados — o "trio que aparece junto" pede composição única; separar cada membro gastaria 3 gens e descaracterizaria a piada visual de "eles sempre aparecem juntos".
6. **Retry de `balao-rosa.png`** — primeira versão tinha sido gerada com `--reference=menu-bg.png` e o modelo herdou a composição do menu (galo + mangue + pequeno balão no canto). Regerei sem reference, só com style preamble, e ficou isolado limpo. **Lição**: balão é forma simples demais pra precisar de ref — preamble já cobre paleta.
7. **Chico Science como `powerup-` e não `enemy-`** — enunciado diz "surge como power-up especial Manguebeat". Fica em `sprites/` com prefixo certo; Game Designer decide o efeito.
8. **Mestre Salu em 128×128** (maior que inimigos regulares) — cobre o papel de mini-boss mencionado ("batera gigante que dispara batidas rítmicas"). Se virar mini-boss real em futuro milestone, já está no tamanho certo.
9. **Fogos como 3 variações com colors diferentes** — Gameplay Dev pode randomizar qual spawna, evita monotonia.
10. **Nuvens em 128×96** (wider than tall) — cumulus naturais são mais largos que altos.

## Blockers / dúvidas pro Arquiteto

- **Efeito do power-up Chico Science** "Manguebeat" — descrição diz "efeito TBD com Game Designer". Sprite entregue, mas o behavior precisa ser definido por quem decide game feel. Sugestão: modo "tropical" que muda música temporariamente + wingman Tribalistas? Ou burst de dano em raio com estética de onda sonora?
- **Capivara atingida vale pontos bônus** — user disse "atravessa a tela sem atacar, vale pontos bônus se atingida". Mas bater em pacífico é tema ético? Posso sugerir ao Game Designer que seja "tocada de leve, ela pisca e voa pra longe dando +pontos", em vez de "morre". Fora do meu escopo — só sinalizo.
- **Bonecos Olinda são boss, mini-boss ou inimigos decorativos?** Entreguei com scale de boneco grande (128×160). Game Designer decide onde aparecem na curva de dificuldade.
- **Tribalistas como inimigo ou evento decorativo?** User disse "trio cômico que aparece junto, canta e distrai" — pode ser um "evento" que spawn uma vez e atrapalha a mira do player. Game Designer implementa.
- **Moldura de céu combinando com moldura cordel do M3?** Se o Arquiteto quiser um moldura específica pra enquadrar os elementos de céu, é +1 gen em M4.1.

## Budget

26 × $0.039 = **$1.01** (target $1.20, 16% abaixo). Inclui 1 retry (balao-rosa). Sobra pra ~5 gens de ajuste se o QA humano achar algum sprite ruim em contexto.

## Evidências visuais

Em `docs/milestone-reports/visual-m4/`:
- `evidence-01-pena.png` — pena de galo (opção A do tiro)
- `evidence-02-milho.png` — grão de milho (opção B do tiro)
- `evidence-03-bandeirinha.png` — string de bandeirinhas (resolve céu vazio)
- `evidence-04-capivara.png` — capivara-querubim (inimigo decorativo novo)
- `evidence-05-chico-science.png` — tributo Chico Science (power-up especial)
- `evidence-06-tribalistas.png` — trio Arnaldo+Carlinhos+Marisa
- `evidence-07-mestre-salu.png` — mini-boss batera de maracatu

## Próximo passo

- **Arquiteto integra** em `PreloadScene` com 2 novos grupos:
  - `sprites/` → `pena-player`, `milho-player`, todos os novos inimigos/bonecos/Chico
  - `sky/` → 16 decorativos; Gameplay Dev usa grupo de particles ou sprites randomizados que spawna no topo da tela e desce com velocidades variáveis (diferente do parallax back — estes são "atrás do player, frente do céu")
- **Game Designer define** comportamentos dos novos inimigos/power-up (ver blockers)
- **QA valida** em contexto: bandeirinha atravessa legal a tela sem bugar vertex; balões coloridos dão variedade; Chico Science não se confunde visualmente com passista de frevo
- **Se aprovado, M4.1** pode adicionar: mais variações de inimigos existentes (Galo maligno corrompido, Caboclo de Lança, Papa-Figo, Comadre Fulozinha, Besta-Fera) já listados no GDD mas ainda não gerados na paleta frevo
