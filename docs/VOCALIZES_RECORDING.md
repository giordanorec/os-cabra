# Guia de gravação — Vocalizes Pernambucanos

> **Status v1**: usuário optou por **NÃO gravar**; v1 usa TTS via eSpeak NG pt-br + ffmpeg. Os 9 vocalizes estão instalados em `public/assets/sfx/voc_*.ogg`. Pipeline reproduzível em `/tmp/audio_acquisition/build_voc.sh` (recriar o script se rodar de novo).
>
> **Este documento permanece** como guia caso você (ou alguém) decida gravar versões humanas no futuro — qualidade vai ser **drasticamente** superior à TTS, então fica como upgrade altamente recomendado pós-v1.

> **Para quem (se gravar)**: você (e qualquer amigo cabra disposto a gritar pra microfone).
> **Tempo estimado**: 30-60 minutos para gravar todos os 9 vocalizes da lista (`SOUND_LIST.md §8`).

## 1. Por que vale a pena

Os vocalizes são a **assinatura sonora** do jogo. "OXE!" gritado por gente real soa **incomparavelmente** mais arretado que TTS. É o tipo de detalhe que faz playtester rir na primeira vez.

## 2. Lista de vocalizes a gravar

Cada um, gravar **3-5 takes** com entonações diferentes. A gente escolhe o melhor depois.

| Linha | Quando toca | Tom desejado |
|---|---|---|
| **OXE!** | Boss aparece, susto | Surpreso, médio-alto, curto |
| **ÉGUA!** | Power-up, milestone score | Alegre, expressivo |
| **ARRETADO!** | Power-up forte (sombrinha, cachaça) | Empolgado, com peso |
| **VISSE?!** | Chain multiplier ×1.5 | Provocativo, com risadinha opcional |
| **AÍ, VIU?!** | Player perde vida | Lamentado, meio cômico |
| **SE LASCOU!** | Game Over | Resignado, melancólico-cômico |
| **PAI D'ÉGUA!** | Vitória / "Ready" | Festivo, solto |
| **BORA!** | Continuar pausa, retomada | Decidido, curto |
| **TÁ COM TUDO!** | 1-up (Tapioca Dobrada) | Comemorativo |

**Variações úteis** (gravar separado se topar):
- Voz feminina + voz masculina dos mesmos vocalizes (alternar em runtime dá variedade enorme)
- Voz de criança gritando "OXE!" (bonus comédia)

## 3. Setup mínimo (celular basta)

Você não precisa de microfone profissional. **Celular + ambiente silencioso** dá conta.

### Antes de gravar
- **Local**: quarto com cortinas/roupas (abafa eco). Banheiro ou closet também serve, ainda melhor.
- **Distância**: 15-20cm da boca ao mic do celular. Não muito perto (estoura), não muito longe (entra ruído).
- **Modo avião**: evita notificação no meio do take.
- **Aplicativo**: gravador padrão do celular já serve. Em iPhone, **Voice Memos**. Em Android, **Easy Voice Recorder** (free) tem WAV se quiser pular MP3.
- **Formato preferido**: WAV ou M4A de alta qualidade. MP3 só em último caso.

### Durante a gravação
- Silêncio antes e depois de cada take (~1s) — facilita o trim.
- Faça **3-5 takes seguidos** de cada palavra antes de mudar.
- Não pense demais — o primeiro grito "do fundo do peito" geralmente é o melhor.
- Se errar (riso, tosse), só recomeçar — não apagar.

## 4. Processamento em Audacity (gratuito, Linux)

Para cada arquivo aceito:

1. **Importar** o WAV/M4A bruto.
2. **Trim** (cortar silêncios): `Edit > Remove Special > Trim Audio` após selecionar só a palavra.
3. **Normalize**: `Effect > Normalize... > -1.0 dB peak`. Garante volume consistente.
4. **Compressão leve** (opcional, mas recomendado): `Effect > Compressor`
   - Threshold: -18 dB
   - Ratio: 3:1
   - Attack: 0.2s
   - Release: 1.0s
   - Make-up gain: ligado
5. **Reverb sutil** (opcional, dá "presença"): `Effect > Reverb`
   - Room size: 30
   - Reverberance: 25
   - Damping: 50
   - Tone Low: 50
   - Tone High: 80
   - Wet gain: -8 dB
   - Dry gain: -1 dB
6. **High-pass filter** (remove ruído grave de mic de celular): `Effect > High-Pass Filter > 80 Hz, 12 dB`.
7. **Loudness Normalization**: `Effect > Loudness Normalization > -12 LUFS integrated` (ver `MIX_LEVELS.md §6`).
8. **Export** como OGG: `File > Export > Export as OGG > Quality 6` (~128 kbps).
9. **Salvar** em `public/assets/sfx/voc_<palavra>.ogg`.
10. **Registrar** em `docs/AUDIO_LICENSES.md §4` com fonte = "Gravação original (`<seu nome>`)" e licença = "Original / cedida ao projeto".

## 5. Atalhos Audacity úteis (Linux)

| Atalho | Ação |
|---|---|
| `Ctrl+A` | Selecionar tudo |
| `Ctrl+T` | Trim para seleção |
| `Ctrl+I` | Split |
| `Ctrl+L` | Silence audio |
| `Espaço` | Play/Stop |
| `Ctrl+Shift+E` | Export selection (cada take vira um arquivo) |

## 6. Pipeline rápido pra muitos takes

Se gravar 5 takes de cada vocalize numa única faixa longa:

1. Abrir o WAV no Audacity.
2. `View > Show Clipping` para ver visualmente onde tem som.
3. Selecionar cada take e usar **Labels** (`Ctrl+B`) para nomear (`voc_oxe_take1`, `voc_oxe_take2`, ...).
4. `File > Export > Export Multiple > Split based on labels > OGG Quality 6`.
5. Escolher **o melhor take** de cada palavra, descartar o resto.
6. Aplicar pós-processamento (§4 passos 3-7) só nos escolhidos.

## 7. Troubleshooting

| Problema | Solução |
|---|---|
| "Ficou estridente, distorcido" | Gravou perto demais. Refazer a 20cm. Ou aplicar `Effect > De-clicker` + `Limiter -1dB`. |
| "Ficou abafado, sem brilho" | Mic ruim ou muito longe. Subir agudos: `Effect > Filter Curve EQ` boost em 3-6 kHz. |
| "Tem ruído de fundo (chiado)" | `Effect > Noise Reduction` — primeiro selecionar só ruído (entre takes) e clicar **Get Noise Profile**, depois selecionar a faixa toda e aplicar. Não exagerar (4-6 dB de redução). |
| "Soou robótico depois de tudo" | Você processou demais. Refazer com menos compressão e sem reverb. |
| "Ficou diferente dos SFX baixados" | Loudness alvo é -12 LUFS pra vocalize. Conferir com `Analyze > Contrast`. |

## 8. Plano B — sem gravação caseira

Se você não topar gravar, a alternativa é **TTS** com sotaque PT-BR e processamento pra desfazer a "vibe robô":

1. Usar serviço TTS (gTTS, ElevenLabs free tier, ou MaryTTS local).
2. Gerar o vocalize.
3. Em Audacity: `Effect > Pitch Shift` ±2 semitons aleatórios.
4. `Effect > Distortion > Hard Clipping` 3-5%.
5. Reverb (passo §4-5) + EQ (boost agudos).

Resultado: aceitável como placeholder; **deve ser substituído** quando aparecer voluntário pra gravar.

## 9. Direitos

Gravações próprias = você cede informalmente para o projeto (uso pessoal, não-comercial por enquanto). Se um dia o jogo virar público, perguntamos formalmente.

Em `docs/AUDIO_LICENSES.md §4`, registrar como:
- Fonte: `Gravação original`
- Autor: `<seu nome>` (ou apelido)
- Licença: `Original — cedida ao projeto Os Cabra (uso interno)`
- Link: —
- Notas: data da gravação + qual take

---

## 10. Pipeline TTS atual (v1)

Caso queira regenerar/ajustar os vocalizes TTS sem gravar:

```bash
# Pré-requisitos: espeak (ou espeak-ng) com voz pt-br + ffmpeg
# Rodar: bash /tmp/audio_acquisition/build_voc.sh (script é descartável; ver conteúdo abaixo)

# Por vocalize, o pipeline faz:
# 1) espeak -v pt-br -s <speed> -p <pitch> -a <amp> "texto" -w out.wav
# 2) ffmpeg -i out.wav -af "highpass=f=80, asetrate=22050*<pshift>, aresample=44100,
#                          compand=...:gain=<dist>,
#                          aecho=0.8:<rev>:60|130|220:0.4|0.3|0.2,
#                          afade=t=in:st=0:d=0.02,
#                          loudnorm=I=<lufs>:TP=-1.5:LRA=11" \
#         -ac 2 -ar 44100 -c:a vorbis -strict -2 -q:a 3 voc_<nome>.ogg
```

Parâmetros usados por vocalize (ajustar se quiser variar):

| Vocalize | Texto eSpeak | Speed | Pitch | Amp | Pshift | Reverb | Distort | LUFS |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| voc_oxe | `oxêêh!` | 115 | 70 | 220 | 1.05 | 0.45 | 1.5 | -10 |
| voc_egua | `êêgua!` | 120 | 75 | 220 | 1.10 | 0.40 | 1.4 | -10 |
| voc_arretado | `arretadôô!` | 130 | 65 | 220 | 1.02 | 0.50 | 1.6 | -10 |
| voc_visse | `vissêê?!` | 135 | 70 | 210 | 1.08 | 0.40 | 1.3 | -11 |
| voc_ai_viu | `ai, viu?!` | 110 | 55 | 210 | 0.95 | 0.50 | 1.4 | -11 |
| voc_se_lascou | `se lascôô!` | 100 | 45 | 220 | 0.90 | 0.55 | 1.5 | -10 |
| voc_pai_degua | `pai d'éguah!` | 125 | 65 | 220 | 1.05 | 0.45 | 1.4 | -10 |
| voc_bora | `bôraa!` | 130 | 60 | 210 | 1.00 | 0.40 | 1.3 | -11 |
| voc_ta_com_tudo | `tá com tudooo!` | 125 | 65 | 220 | 1.02 | 0.45 | 1.4 | -11 |

**Limitações conhecidas do TTS**:
- Soa "sintético", inevitável. eSpeak é dos motores mais robóticos disponíveis em CC0 / GPL.
- Sotaque pt-br do eSpeak é genérico (não pernambucano). O charme regional vem da escolha de palavras + processamento (pitch + reverb), não da pronúncia.
- Para upgrade real: **piper-tts** com modelo brasileiro neural, **Coqui TTS**, ou (melhor) gravação humana (este doc).

**Direitos da saída TTS**: a saída de TTS não é considerada obra autoral protegida em quase nenhuma jurisdição — é resultado mecânico de algoritmo. eSpeak NG é GPLv3, mas isso aplica ao binário, não à saída. Para o jogo: trate como CC0 efetivamente. Documentado em `AUDIO_LICENSES.md §4`.
