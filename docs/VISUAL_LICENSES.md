# Visual Licenses — Os Cabra

> **Responsável**: Visual Designer. **Regra**: nada entra em `public/assets/` ou `docs/refs/xilogravura/` sem linha correspondente aqui.
> **Formato**: uma linha por arquivo. Se uma imagem é reutilizada em múltiplos assets, registra uma vez na seção "Referências" e aponta dos assets derivados.

## 1. Assets finais do jogo (`public/assets/`)

Arquivos que vão para o build. Toda linha precisa de autor, licença compatível, link da fonte.

| Arquivo | Tipo | Autor / Fonte | Licença | Link | Observação |
|---|---|---|---|---|---|
| `public/favicon.svg` | Ícone (SVG) | Visual Designer / sessão Claude 2026-04-19 | Próprio (projeto *Os Cabra*) | — | Galo da Madrugada estilizado, 3 cores da paleta. Origem em `scripts/art/generate-favicon.mjs` |
| `public/favicon.ico` | Ícone (multi-size 16/32/48) | Derivado de `favicon.svg` | Próprio | — | Gerado via `npm run favicon` |
| `public/favicon-192.png` | Ícone PWA / Apple touch | Derivado de `favicon.svg` | Próprio | — | Idem |
| `public/favicon-512.png` | Ícone PWA | Derivado de `favicon.svg` | Próprio | — | Idem |
| `public/assets/sprites/player.{png,json}` | Sprite + atlas (32×32, 3 frames) | Visual Designer / 2026-04-19 | Próprio | `scripts/art/svg/player.svg` | Galo da Madrugada, animação idle de voo |
| `public/assets/sprites/enemy-passista.{png,json}` | Sprite + atlas (32×32, 2 frames) | Visual Designer / 2026-04-19 | Próprio | `scripts/art/svg/enemy-passista.svg` | Passista de Frevo com sombrinha |
| `public/assets/sprites/enemy-caboclinho.{png,json}` | Sprite + atlas (28×28, 2 frames) | Visual Designer / 2026-04-19 | Próprio | `scripts/art/svg/enemy-caboclinho.svg` | Caboclinho com penacho e arco |
| `public/assets/sprites/enemy-mosca.{png,json}` | Sprite + atlas (14×14, 2 frames) | Visual Designer / 2026-04-19 | Próprio | `scripts/art/svg/enemy-mosca.svg` | Mosca-da-Manga (enxame) |
| `public/assets/sprites/boss-maracatu.{png,json}` | Sprite + atlas (256×256, 1 frame hero) | Visual Designer / 2026-04-19 | Próprio | `scripts/art/svg/boss-maracatu.svg` | Maracatu Nação: Calunga + Rei + Rainha |
| `public/assets/sprites/@2x/*.png` | Variantes HiDPI | Derivadas dos SVGs (M2) ou Gemini (M3) | Próprio | `scripts/art/generate-sprites.mjs` ou `postprocess.py` | Mobile/Retina |
| `public/assets/sprites/player.png` | Galo chubby Angry-Birds style (32×32 + @2x) | Gemini 2.5 Flash Image / 2026-04-19 (M3 pivô) | Próprio (IA) | `scripts/art/gemini/out/raw/player-galo-hero.png` | Substitui o SVG do M2 |
| `public/assets/sprites/enemy-passista.png` | Passista paraquedista (32×32 + @2x) | Gemini / 2026-04-19 (M3) | Próprio (IA) | raw | Substitui M2 |
| `public/assets/sprites/enemy-caboclinho.png` | Caboclinho em corda de seda (28×28 + @2x) | Gemini / 2026-04-19 (M3) | Próprio (IA) | raw | Substitui M2 |
| `public/assets/sprites/enemy-mamulengo.png` | Mamulengo marionete em cordas (32×32 + @2x) | Gemini / 2026-04-19 (M3) | Próprio (IA) | raw | Inimigo novo |
| `public/assets/sprites/enemy-mosca.png` | Mosca-da-manga chunky (16×16 + @2x) | Gemini / 2026-04-19 (M3) | Próprio (IA) | raw | Substitui M2 |
| `public/assets/sprites/boss-{rei,rainha,calunga}.png` | Trio Maracatu 256×256 | Gemini / 2026-04-19 (M3) | Próprio (IA) | raw (`--reference=boss-rei.png` pra Rainha/Calunga) | Paleta frevo |
| `public/assets/sprites/bullet-player.png` | Grão de milho dourado (16×16 + @2x) | Gemini / 2026-04-19 (M3) | Próprio (IA) | raw | Tiro do player |
| `public/assets/backgrounds/menu.png` | Capa: Galo gigante em mangue radiante (800×600) | Gemini / 2026-04-19 (M3) | Próprio (IA) | raw | Splash screen |
| `public/assets/backgrounds/fase1/{back,mid,fore}.png` | Marco Zero carnaval, 3 camadas parallax | Gemini / 2026-04-19 (M3) | Próprio (IA) | raw | Paleta frevo, mid/fore com alpha |
| `public/assets/backgrounds/fase2/{back,mid,fore}.png` | Ladeiras de Olinda, 3 camadas parallax | Gemini / 2026-04-19 (M3) | Próprio (IA) | raw | Paleta frevo, mid/fore com alpha |
| `public/assets/backgrounds/fase4/{back,mid,fore}.png` | Capibaribe entardecer, 3 camadas parallax | Gemini / 2026-04-19 (M3) | Próprio (IA) | raw | Paleta frevo, mid/fore com alpha |
| `public/assets/ui/logo-os-cabra.png` | Logo colorido lettering xilografado (700×620) | Gemini / 2026-04-19 (M3) | Próprio (IA) | raw | Pra MenuScene |
| `public/assets/ui/moldura-cordel.png` | Frame decorativo colorido (600×450) | Gemini / 2026-04-19 (M3) | Próprio (IA) | raw | Center transparente |
| `public/assets/ui/icon-vida.png`, `icon-bomba.png` | HUD galinho + garrafinha (64×64) | Gemini / 2026-04-19 (M3) | Próprio (IA) | raw | |
| `public/assets/vfx/vfx-explosao.png` | Confete explosão (128×128) | Gemini / 2026-04-19 (M3) | Próprio (IA) | raw | |
| `public/assets/vfx/vfx-muzzle-penas.png` | Muzzle flash de penas (128×128) | Gemini / 2026-04-19 (M3) | Próprio (IA) | raw | |
| `public/assets/vfx/vfx-hit-flash.png` | Hit flash estrela impacto (128×128) | Gemini / 2026-04-19 (M3) | Próprio (IA) | raw | |
| `public/assets/sprites/pena-player.png` | Pena de galo rosa+amarela (32×32 + @2x) | Gemini / 2026-04-19 (M4) | Próprio (IA) | raw em `scripts/art/gemini/out/raw/` | Opção A tiro do player |
| `public/assets/sprites/milho-player.png` | Grão de milho dourado (32×32 + @2x) | Gemini / 2026-04-19 (M4) | Próprio (IA) | raw | Opção B tiro do player |
| `public/assets/sprites/enemy-capivara.png` | Capivara-querubim pacífica (96×96 + @2x) | Gemini / 2026-04-19 (M4) | Próprio (IA) | raw | Inimigo decorativo, vale pontos bônus |
| `public/assets/sprites/enemy-caranguejo-saci.png` | Caranguejo-Saci perna única (96×96 + @2x) | Gemini / 2026-04-19 (M4) | Próprio (IA) | raw | Inimigo novo zigzag |
| `public/assets/sprites/enemy-tribalistas.png` | Trio Arnaldo+Carlinhos+Marisa (128×96 + @2x) | Gemini / 2026-04-19 (M4) | Próprio (IA) | raw | Tributo cultural, evento decorativo |
| `public/assets/sprites/enemy-mestre-salu.png` | Mestre maracatu com bumbo (128×128 + @2x) | Gemini / 2026-04-19 (M4) | Próprio (IA) | raw | Mini-boss potencial |
| `public/assets/sprites/powerup-chico-science.png` | Tributo Chico Science Manguebeat (96×128 + @2x) | Gemini / 2026-04-19 (M4) | Próprio (IA) | raw | Power-up especial, efeito TBD |
| `public/assets/sprites/boneco-{mulher-dia,menino-tarde}.png` | Bonecos gigantes Olinda (128×160 + @2x) | Gemini / 2026-04-19 (M4) | Próprio (IA) | raw | Mini-bosses Fase 2 potenciais |
| `public/assets/sky/bandeirinha.png` | String longa São João (512×128) | Gemini / 2026-04-19 (M4) | Próprio (IA) | raw | Decorativo céu |
| `public/assets/sky/balao-{rosa,amarelo,turquesa,laranja}.png` | 4 balões coloridos (128×128 cada) | Gemini / 2026-04-19 (M4) | Próprio (IA) | raw | Decorativo céu |
| `public/assets/sky/pipa-{losango,arraia}.png` | 2 pipas recifenses (128×128 cada) | Gemini / 2026-04-19 (M4) | Próprio (IA) | raw | Decorativo céu |
| `public/assets/sky/fogo-{rosa,amarelo,dourado}.png` | 3 fogos de artifício (128×128 cada) | Gemini / 2026-04-19 (M4) | Próprio (IA) | raw | Decorativo céu |
| `public/assets/sky/passaro-{pequeno,grande}.png` | 2 pássaros voando (64×64 e 128×128) | Gemini / 2026-04-19 (M4) | Próprio (IA) | raw | Decorativo céu |
| `public/assets/sky/nuvem-{galo,coracao,comum}.png` | 3 nuvens woodcut (128×96 cada) | Gemini / 2026-04-19 (M4) | Próprio (IA) | raw | Decorativo céu |
| `public/assets/sky/sol-sorrindo.png` | Sol antropomórfico (128×128) | Gemini / 2026-04-19 (M4) | Próprio (IA) | raw | Decorativo céu |

### Licenças aceitas para assets finais

- **CC0 / Public Domain** — ideal, sem atribuição obrigatória
- **CC-BY 4.0** — ok, precisa atribuição em `docs/REPORT_VISUAL_DESIGNER.md` + créditos no jogo
- **CC-BY-SA 4.0** — ok, mas jogo fica SA (copyleft). Avaliar caso-a-caso.
- **Gerado por IA (Gemini/Flux) a partir de prompt próprio** — considerado próprio, registra modelo + data de geração
- **Custom (feito pelo Visual Designer)** — próprio, registra autor

### Licenças **não** aceitas para assets finais

- CC-BY-NC (não-comercial) — mesmo sendo uso pessoal hoje, futuro pode mudar
- "Free for personal use" sem texto claro
- Obras protegidas sem permissão explícita do autor

## 2. Referências (`docs/refs/`)

Imagens usadas como *style reference* ou inspiração, **não** distribuídas com o jogo.

| Arquivo | Autor / Obra | Fonte | Licença | Uso permitido |
|---|---|---|---|---|
| _vazio_ | — | — | — | — |

Uso como style-ref em IA privada é tolerado sob fair use / estudo na maioria dos casos, **mas**:
- Não commitar arquivo se a fonte exige take-down ou tem copyright ativo (ex: obra recente de galeria)
- Preferir Wikimedia Commons, Itaú Cultural (uso educacional), acervos públicos
- Em dúvida: manter só a URL em `docs/refs/REFS.md` e não baixar o arquivo

## 3. Fontes tipográficas

| Fonte | Onde é usada | Licença | Link |
|---|---|---|---|
| _a definir_ | Títulos, display (ver `UX_SPEC.md §5`) | — | — |
| _a definir_ | Corpo / HUD | — | — |

Candidatos atuais (Google Fonts, licença Open Font License — OFL — ok):
- **Rye**, **Bungee**, **Modak** — display
- **Inter**, **DM Sans** — corpo
- **JetBrains Mono**, **IBM Plex Mono** — mono

## 4. Geração por IA — registro de prompts

Toda imagem gerada por IA exige linha abaixo. Mantém rastreabilidade se precisarmos regenerar ou defender autoria.

| Arquivo | Modelo | Data | Prompt curto | Style refs usadas |
|---|---|---|---|---|
| _vazio_ | — | — | — | — |

Prompt completo vai em `public/assets/sprites/_prompts/<arquivo>.md` para não inchar esta tabela. Ver `ART_BIBLE.md §5.3` para template.

## 5. Checklist antes de commitar um asset

- [ ] Licença compatível (seção 1)
- [ ] Linha correta nesta tabela
- [ ] Arquivo em formato correto (PNG com alpha para sprites)
- [ ] Nome segue convenção (ex: `player_idle_01.png`, `enemy_passista_frevo_idle.png`)
- [ ] Tamanho dentro do previsto (`ART_BIBLE.md §6`)
- [ ] Se gerado por IA: prompt registrado em `_prompts/`
