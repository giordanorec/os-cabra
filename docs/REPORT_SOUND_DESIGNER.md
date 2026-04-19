# Relatório — Sound Designer (v1)

> **Branch**: `feat/audio-v1`. **Data**: 2026-04-19. **Escopo**: Fases A (inventário), B (curadoria de fontes), parte de E (template de licenças); Fases C (processamento) e D (organização de arquivos binários) ficam em mãos humanas — ver §4.

## 1. O que foi entregue

### Documentação (5 arquivos novos)
1. **`docs/SOUND_LIST.md`** — inventário completo de **75 itens** (9 músicas, 54 SFX, 9 vocalizes, 3 ambiências), com prioridade P0/P1/P2, duração-alvo, descrição e mapeamento eventos → SFX para o Gameplay Dev.
2. **`docs/AUDIO_LICENSES.md`** — política de licenças aceitas (CC0/CC-BY/Pixabay-only), candidatos pré-curados por arquivo com URLs concretas, pacotes-base recomendados (Kenney + OpenGameArt), tabela final §4 vazia para preenchimento conforme arquivos forem instalados, e bloco de créditos pronto pra UI.
3. **`docs/MIX_LEVELS.md`** — volumes por categoria, overrides por evento, tabela de ducking, crossfade entre cenas, alvos LUFS por tipo, e exemplo de consumo no `AudioManager`.
4. **`docs/VOCALIZES_RECORDING.md`** — guia passo-a-passo de gravação caseira (celular + Audacity), pipeline de processamento, plano B (TTS) e troubleshooting.
5. **`docs/REPORT_SOUND_DESIGNER.md`** — este arquivo.

### Configuração runtime (1 arquivo)
6. **`public/assets/audio_config.json`** — JSON consumido pelo `AudioManager` em runtime, com:
   - 5 categorias (master/music/sfx/vocalize/ambience)
   - 12 overrides por evento crítico
   - Regras de roteamento por prefixo (`voc_*` → vocalize, `amb_*` → ambience, default → sfx)
   - 4 regras de ducking automático (boss appear, vocalize, smart bomb, pause)
   - Tempos de crossfade entre transições de cena

### Estrutura de diretórios (3 pastas)
7. **`public/assets/sfx/.gitkeep`**, **`public/assets/music/.gitkeep`**, **`public/assets/ambience/.gitkeep`** — prontas pra receber os OGG.

### Métricas
- **Inventário**: 75 itens
- **Mínimo viável (P0 only)**: 30 itens
- **Build polido (P0+P1)**: 63 itens
- **Pacotes-base CC0 identificados**: 7 (cobrem ~70% dos SFX)
- **URLs de fonte validadas**: 16 links concretos

---

## 2. O que **não** foi entregue (e por quê)

### Arquivos de áudio em si
**Nada de OGG foi commitado.** O processo automatizado pra baixar binários de Pixabay/Freesound/OpenGameArt + abrir Audacity + processar + nomear + commitar não cabe num agente texto-only sem rodar GUI ou autenticação. Esta entrega é a **base instrumentada** — quando o usuário (ou um próximo agente com permissão de download) baixar os arquivos, basta seguir o procedimento descrito em `AUDIO_LICENSES.md §5` e a infra já está pronta:
- Lista clara do que baixar (`SOUND_LIST.md`)
- Onde baixar (`AUDIO_LICENSES.md §1-§3`)
- Como processar (`MIX_LEVELS.md §6` + `VOCALIZES_RECORDING.md §4`)
- Onde colocar (estrutura `public/assets/{sfx,music,ambience}/` pronta)
- Como registrar (template `AUDIO_LICENSES.md §4`)
- Como o jogo consome (`audio_config.json` + exemplo em `MIX_LEVELS.md §7`)

### Vocalizes gravados
Mesma razão + depende do usuário decidir se topa (ver §5 questão aberta).

---

## 3. Decisões de design tomadas

| Decisão | Por quê |
|---|---|
| **Apenas 1 música de boss em v1** (`boss_generic.ogg`) | Reduz P0 de 13 pra 9 músicas. Em v2, fazer remix por boss. |
| **3 variantes de explosão** (small/medium/large) ao invés de uma por inimigo | 3 variantes cobrem 8+ inimigos com leitura clara de "tamanho". Economia massiva. |
| **Vocalizes como categoria própria** (vocalize) com bump volumétrico | Vocalize é assinatura — não pode sumir no caos sonoro. |
| **Ducking automático em vocalize** | Quando "OXE!" toca, o resto abaixa 30% por 100ms — vocaliza fica nítido sem precisar virar tudo no mix. |
| **Pacotes-base Kenney + OpenGameArt** | CC0 bulletproof, qualidade conhecida, cobrem UI/impact/sci-fi/explosões. Resta gap de regional. |
| **Pixabay como fonte aceita** | Pixabay Content License é equivalente prático a CC0 e tem o melhor catálogo brasileiro instrumental ("MARACATU (Brazilian traditional rhythm)" já localizado). |
| **Loudness target conservador** (-18 LUFS música, -14 SFX) | Espaço de cabeça pra eventos loud (boss defeat, smart bomb) sem clipping. |

---

## 4. Gaps conhecidos

### Gap 1 — Frevo instrumental CC é raro
**Impacto**: Alto (M01, M02 são P0 e definem o tom do jogo).
**Status**: Pixabay tem `https://pixabay.com/music/search/frevo/` mas o catálogo é magro (geralmente 0-5 resultados de qualidade duvidosa). FMA tem alguma coisa em `https://freemusicarchive.org/genre/Brazilian/` — não verificado individualmente.
**Substituição proposta**:
1. **Plano A**: usar a faixa "MARACATU (Brazilian traditional rhythm)" do Pixabay (`https://pixabay.com/sound-effects/maracatu-brazilian-traditional-rhythm-318907/`) também como base de menu, com pitch/tempo ajustado pra ficar mais frevo-like.
2. **Plano B**: marcar `menu_frevo.ogg` e `phase1_marco_zero.ogg` como **placeholder** com track genérico "brazilian percussive" e abrir issue `feat/audio-v2-real-frevo` pra resolver depois.
3. **Plano C** (de ouro): contatar diretamente uma escola de frevo no Recife (ex: Escola Municipal de Frevo Maestro Fernando Borges) pedindo se cedem 30s de gravação CC-BY pro projeto. Esforço alto, retorno lendário se vier.

### Gap 2 — Coco de roda e baião instrumentais CC
**Impacto**: Médio (M04, M06, são P1).
**Status**: idem ao frevo. Coco gravado por DJ Dolores existe mas licenças são proprietárias.
**Substituição**: usar percussivo brasileiro genérico do Pixabay/FMA, marcar como placeholder.

### Gap 3 — Vocalizes pernambucanos
**Impacto**: Alto (V01-V05 são P0 e são identidade pura do jogo).
**Status**: Não existe banco CC de "OXE!" em sotaque pernambucano. Único caminho viável é gravação caseira (ver `VOCALIZES_RECORDING.md`) ou TTS com pós-processamento pesado (qualidade aceitável mas perde charme).
**Recomendação**: insistir com o usuário gravar — 30 minutos de esforço, retorno enorme.

### Gap 4 — SFX específicos exóticos
**Impacto**: Baixo (são P1/P2).
**Status**: "crocito de urubu", "cipó serpenteando", "fígado pulsante" não têm match direto.
**Substituição**: composição em Audacity de 2-3 SFX livres (ex: urubu = corvo + low pass; cipó = chicote + reverb).

### Gap 5 — Pixabay Content License vs CC0 puro
**Impacto**: Baixo (mas precisa documentar).
**Status**: Pixabay Content License permite uso comercial sem atribuição, mas tem **cláusula que proíbe revender o áudio cru ou usar pessoa identificável sem autorização**. Pra jogo embarcado, sem problema. Pra eventual repo público de assets, atenção.
**Mitigação**: já documentado em `AUDIO_LICENSES.md §1`.

---

## 5. Questões abertas (precisam de decisão do usuário)

1. **Você topa gravar os 9 vocalizes?** (decisão dele) — sem isso, o jogo soa 80% mais genérico. 30 min com celular resolve. Ver `VOCALIZES_RECORDING.md`.
2. **Aceita música "world brazilian percussive" como placeholder de frevo na Fase 1, ou prefere atrasar Fase 1 até achar/gravar frevo de verdade?** Recomendação: aceitar placeholder, jogar mesmo, trocar depois.
3. **Sliders de áudio em Opções**: 2 sliders (music + sfx) ou 4 (master + music + sfx + vocalize)? Recomendação: 3 (master + music + sfx); vocalize herda do sfx com bump fixo.
4. **Quem baixa os arquivos de áudio?** Opções: (a) você manualmente seguindo a curadoria, (b) próxima sessão com permissão de WebFetch + ferramentas binárias, (c) parcial: você baixa pacotes Kenney/OGA inteiros e a sessão escolhe e renomeia.
5. **Boss "Coronel" e "Iara do Capibaribe" precisam de SFX específicos** (V07-V08 não cobrem) — fica como P2 pós-MVP ou já contemplar?

---

## 6. Próximos passos sugeridos (em ordem)

1. **Você decide** as questões 1-5 do §5.
2. **Baixar pacotes-base CC0** (Kenney Interface + Impact + Sci-fi + OGA 100 SFX + 25 firework) — ~50 MB, 10 min total.
3. **Selecionar e renomear** ~30 SFX P0 desses pacotes seguindo `SOUND_LIST.md`.
4. **Buscar 5-9 músicas P0** no Pixabay/FMA (frevo/maracatu/percussivo brasileiro).
5. **Gravar vocalizes P0** (4 itens: OXE, ÉGUA, ARRETADO, AÍ VIU) — se topar.
6. **Processar tudo** em Audacity (trim/normalize/LUFS/OGG) — ~2-3h pra 30 itens.
7. **Preencher `AUDIO_LICENSES.md §4`** linha por linha.
8. **Commit** "audio: install P0 batch" e abrir PR.
9. **Gameplay Dev** implementa `AudioManager` consumindo `audio_config.json`.
10. **QA** verifica que cada `playSfx`/`playMusic` chamado tem arquivo + entrada de licença.

---

## 7. Como o Gameplay Dev usa isso (quick start)

```ts
// src/systems/AudioManager.ts
import audioConfig from '/assets/audio_config.json';

class AudioManager {
  // ... carregar audioConfig.categories e .overrides
  playSfx(key: string) {
    const cat = this.categoryOf(key);          // sfx | vocalize | ambience
    const override = audioConfig.overrides[key] ?? 1.0;
    const vol = audioConfig.categories.master
              * audioConfig.categories[cat]
              * override;
    this.scene.sound.play(key, { volume: vol });
    this.applyDuckingFor(key);                  // ver MIX_LEVELS §4
  }
}
```

Lista de chaves a registrar no `Phaser.Loader`: ver `SOUND_LIST.md` (cada coluna "Arquivo" é a chave, sem extensão).

---

## 8. Referência cruzada

| Documento | Quem usa |
|---|---|
| `SOUND_LIST.md` | Sound Designer (gera), Gameplay Dev (carrega), QA (valida cobertura) |
| `AUDIO_LICENSES.md` | Sound Designer (mantém), DevOps (verifica em CI), UI (gera créditos) |
| `MIX_LEVELS.md` | Sound Designer (define), Gameplay Dev (implementa AudioManager) |
| `VOCALIZES_RECORDING.md` | Usuário (executa), Sound Designer (revisa) |
| `audio_config.json` | Gameplay Dev (lê em runtime), UI Settings (escreve via slider) |
