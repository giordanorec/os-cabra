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
| `public/assets/sprites/@2x/*.png` | Variantes HiDPI | Derivadas dos SVGs | Próprio | `scripts/art/generate-sprites.mjs` | Mobile/Retina futuro |
| `public/assets/sprites/boss-{rei,rainha,calunga}.png` | Trio Maracatu individualizado (256×256, alpha) | Gemini 2.5 Flash Image / 2026-04-19 | Próprio (IA) | raw em `scripts/art/gemini/out/raw/` | M3 — consistência via `--reference=boss-rei.png` |
| `public/assets/sprites/bullet-*.png` | 6 projéteis 48×48 (flecha, bombinha, player, cipó, fígado, bola-fogo) | Gemini / 2026-04-19 | Próprio (IA) | `bullets-sheet.png` raw | M3 — sheet 3×2 splitado |
| `public/assets/sprites/powerup-*.png` | 5 power-ups 64×64 (sombrinha, cachaça, tapioca, calunga, fogo-artifício) | Gemini / 2026-04-19 | Próprio (IA) | `powerups-sheet.png` raw | M3 |
| `public/assets/backgrounds/*.png` | 18 imagens de parallax (3 camadas × 6 cenas: menu + fase1-5) | Gemini / 2026-04-19 | Próprio (IA) | raw em `scripts/art/gemini/out/raw/` | M3 — mid/fore com alpha flood-filled |
| `public/assets/ui/logo-os-cabra.png` | Logo lettering com ornamentação (700×700) | Gemini / 2026-04-19 | Próprio (IA) | `logo-os-cabra.png` raw | M3 — splash screen |
| `public/assets/ui/moldura-cordel.png` | Frame decorativo com buraco central (600×450) | Gemini / 2026-04-19 | Próprio (IA) | `ui-moldura.png` raw | M3 |
| `public/assets/ui/boss-hp-bar.png` | Barra HP estilizada (512×64) | Gemini / 2026-04-19 | Próprio (IA) | `ui-boss-hp-bar.png` raw | M3 |
| `public/assets/ui/icon-{vida,bomba}.png` | Ícones HUD galinho + garrafinha (64×64) | Gemini / 2026-04-19 | Próprio (IA) | `ui-icon-*.png` raw | M3 |
| `public/assets/ui/{cursor-mao,seta-esquerda,seta-direita,selector-estrela}.png` | Cursor + navegação (64×64) | Gemini / 2026-04-19 | Próprio (IA) | `ui-cursor-setas.png` raw | M3 — sheet 2×2 splitado |
| `public/assets/vfx/vfx-*.png` | 5 partículas 128×128 (explosão, muzzle, hit, pickup, fumaça) | Gemini / 2026-04-19 | Próprio (IA) | `vfx-sheet.png` raw | M3 |

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
