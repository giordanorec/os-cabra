// Strings PT-BR do jogo.
// Fonte canônica: docs/GLOSSARY_PT_BR.md (última revisão 2026-04-19, purga de gírias não-PE).
// Ao editar: sincronize aqui E no glossário. Nenhuma string hardcoded em src/ — sempre via getString.

const STRINGS: Record<string, string> = {
  // 1. Boot / Splash
  'boot.title': 'OS CABRA',
  'boot.tagline': 'um traçado pernambucano',
  'boot.skip': '[ESPAÇO] pula',

  // 2. Menu Principal
  'menu.play': 'BORA, CABRA',
  'menu.codes': 'CÓDIGOS DOS CABRA',
  'menu.credits': 'QUEM FEZ ESSE TRAÇADO',
  'menu.quit': 'SAIR',
  'menu.highscore': 'RECORDE: %n',
  'menu.version': 'v%s · %n',
  'menu.hint': '[ENTER] pra começar',

  // 3. Dialog genéricos
  'dialog.yes': 'VISSE',
  'dialog.no': 'DEIXA PRA LÁ',
  'dialog.back': 'VOLTAR',
  'dialog.ok': 'BORA',
  'dialog.quit_confirm': 'SAIR MESMO? PERDE TUDO.',
  'dialog.restart_confirm': 'RECOMEÇA A FASE INTEIRA?',

  // 4. Códigos (ainda não implementado em cena — reservado)
  'codes.title': 'CÓDIGOS DOS CABRA',
  'codes.subtitle': 'cola o código do cabra pra ver o score',
  'codes.confirm': '[ENTER] confere',
  'codes.your_code_label': 'SEU ÚLTIMO CÓDIGO',
  'codes.share_hint': 'copia e manda pros cabra',
  'codes.copy': '[C] copia',
  'codes.new_game': '[N] jogo novo',
  'codes.invalid': 'ESSE CÓDIGO NÃO COLA',
  'codes.copied': 'COPIEI AÍ',
  'codes.empty': 'AINDA NÃO TEM',

  // 5. Preload tips
  'tip.hold_on': 'SEGURA O CABRA, QUE JÁ VAI.',
  'tip.dodge': 'SE TOMAR TIRO, TU VÊ ESTRELA.',
  'tip.swarm': 'QUANDO VIER MUITO, CORRE PRO CANTO.',
  'tip.umbrella': 'SOMBRINHA DE FREVO BLOQUEIA UM HIT SÓ.',
  'tip.papafigo': 'PAPA-FIGO MIRA ONDE TU TÁ. ANDA.',
  'tip.bomb': 'TÁ APERTADO? [X] E PRONTO.',
  'tip.checkpoint': 'MORREU NO MEIO DA FASE? VOLTA DO CHECKPOINT.',
  'tip.kamikaze': 'URUBU VEM PRA CIMA. DERRUBA ANTES.',
  'tip.boss_telegraph': 'SE UMA LUZ AVISA, É TIRO GRANDE. FOGE.',
  'tip.tapioca': 'TAPIOCA DOBRADA DÁ VIDA EXTRA. ACHE.',
  'tip.chain': '5 INIMIGOS SEM LEVAR TIRO = MULTIPLICADOR.',
  'tip.code': 'TEU CÓDIGO FINAL É PRA MOSTRAR PROS CABRA.',

  // 6. Intros de Fase
  'stage.1.name': 'MARCO ZERO',
  'stage.1.subtitle': 'ONDE TUDO COMEÇA',
  'stage.2.name': 'LADEIRAS DE OLINDA',
  'stage.2.subtitle': 'DESCE QUEM PODE',
  'stage.3.name': 'RECIFE ANTIGO',
  'stage.3.subtitle': 'DENTRO DA FESTA',
  'stage.4.name': 'CAPIBARIBE',
  'stage.4.subtitle': 'A MARÉ VIROU',
  'stage.5.name': 'SERTÃO',
  'stage.5.subtitle': 'A HORA É AGORA',
  'stage.header': 'FASE %n',

  // 7. HUD
  'hud.score_label': 'SCORE',
  'hud.multiplier': '×%s',
  'hud.powerup_timer': '%ns',
  'hud.powerup_expiring': 'JÁ VAI!',

  // 8. Feedback de gameplay
  'feedback.ready': "PAI D'ÉGUA",
  'feedback.go': 'VAI, MENINO',
  'feedback.first_blood': 'PRIMEIRO DO DIA',
  'feedback.chain5': 'ENGATADO',
  'feedback.chain10': 'TÁ DOIDO!',
  'feedback.chain20': 'É BRABO MESMO',
  'feedback.milestone_10k': 'ÉGUA! 10 MIL',
  'feedback.milestone_50k': 'MEIO CENTO, CABRA!',
  'feedback.milestone_100k': 'CEM MIL ARRETADO',
  'feedback.damage': 'EITA!',
  'feedback.last_life': 'É A ÚLTIMA!',
  'feedback.life_up': 'NOVA VIDA',
  'feedback.near_miss': 'QUASE',
  'feedback.perfect_wave': 'LIMPOU TUDO',
  'feedback.wave_complete': 'ONDA %n VAI',

  // Pickup variations (7 entradas PE confirmadas; sem "TÁ MASSA")
  'pickup.arretado': 'ARRETADO!',
  'pickup.visse': 'VISSE?!',
  'pickup.egua': 'ÉGUA!',
  'pickup.paidegua': "PAI D'ÉGUA",
  'pickup.oxente': 'OXENTE!',
  'pickup.danou': 'DANOU-SE!',
  'pickup.bicho': 'BICHO!',

  // 9. Power-ups
  'powerup.triple': 'FOGO DE ARTIFÍCIO TRIPLO',
  'powerup.umbrella': 'SOMBRINHA DE FREVO',
  'powerup.cachaca': 'CACHAÇA BOA',
  'powerup.tapioca': 'TAPIOCA DOBRADA',
  'powerup.baque': 'BAQUE-VIRADO',

  // 10. Pausa
  'pause.title': 'PAREI',
  'pause.resume': 'BORA',
  'pause.restart_stage': 'RECOMEÇA A FASE',
  'pause.quit': 'VOLTAR PRO MENU',
  'pause.controls_hint': 'ESC retoma · ↑↓ escolhe · ENTER confirma',

  // 11. Checkpoint
  'checkpoint.title': 'ONDE EU TAVA',
  'checkpoint.subtitle': 'salvou na metade da fase',

  // 12. Bosses
  'boss.appear': 'OXE!',
  'boss.1.name': 'MARACATU NAÇÃO',
  'boss.1.epithet': 'REI · RAINHA · CALUNGA',
  'boss.2.name': 'HOMEM DA MEIA-NOITE',
  'boss.2.epithet': 'O GIGANTE DE OLINDA',
  'boss.3.name': 'GALO DA MADRUGADA MALIGNO',
  'boss.3.epithet': 'O BICHO NO CARNAVAL',
  'boss.4.name': 'IARA DO CAPIBARIBE',
  'boss.4.epithet': 'A ÁGUA MÓRBIDA',
  'boss.5.name': 'O CORONEL',
  'boss.5.epithet': 'DONO DE TUDO',
  'boss.phase2': 'EITA, MUDOU',
  'boss.phase3': 'DANOU-SE AGORA',
  'boss.defeated': 'SE FOI',
  'boss.bonus_label': 'BONUS DE BOSS',
  'boss.lives_label': 'VIDAS RESTANTES',
  'boss.total_label': 'TOTAL',

  // 13. Fim de fase
  'stage_end.1.title': 'FASE 1 — SE DANOU',
  'stage_end.2.title': 'FASE 2 — EITA',
  'stage_end.3.title': 'FASE 3 — MEU PAI DO CÉU',
  'stage_end.4.title': 'FASE 4 — QUASE',
  'stage_end.stat_score': 'SCORE DA FASE',
  'stage_end.stat_kills': 'INIMIGOS NO CHÃO',
  'stage_end.stat_deaths': 'VEZES QUE MORREU',
  'stage_end.stat_lives': 'VIDAS RESTANTES',
  'stage_end.total': 'SCORE TOTAL',
  'stage_end.continue': 'BORA PRA PRÓXIMA',
  'stage_end.quit': 'SAIR',

  // 14. Game Over
  'gameover.1': 'SE LASCOU',
  'gameover.2': 'RAPAZ...',
  'gameover.3': 'NÃO DEU NÃO',
  'gameover.4': 'DANOU-SE',
  'gameover.5': 'FOI BRABO MESMO',
  'gameover.6': 'PAGOU O PREÇO',
  'gameover.7': 'FICA PRA OUTRO DIA',
  'gameover.title': 'SE LASCOU', // fallback — preferir getGameOverTitle()
  'gameover.score': 'SCORE',
  'gameover.record': 'RECORDE',
  'gameover.new_record': 'NOVO RECORDE!',
  'gameover.code_label': 'SEU CÓDIGO',
  'gameover.share_hint': 'manda pros cabra · [C] copia',
  'gameover.retry': 'TENTA DE NOVO',
  'gameover.menu': 'MENU',
  'gameover.hint': '[ENTER] volta pro menu',
  'gameover.shortcuts': 'ENTER menu · R recomeça · C copia código',
  'gameover.score_label': 'FEZ', // label curto usado em cena atual

  // 15. Vitória
  'victory.title': 'OS CABRA VENCERAM',
  'victory.subtitle': '(ou não)',
  'victory.poem_1': 'tudo volta ao normal,',
  'victory.poem_2': 'mas o mangue guarda segredo.',
  'victory.continue_hint': '(ENTER continua)',
  'victory.stats_title': 'ACABOU TUDO BEM',
  'victory.score_final': 'SCORE FINAL',
  'victory.record': 'RECORDE',
  'victory.code_label': 'SEU CÓDIGO',
  'victory.credits_shortcut': '[ENTER] menu · [C] copia código',

  // Fase completa — tela de transição antes de gameover vencedor
  'stage.complete': 'FASE COMPLETA',
  'stage.complete.hint': '[ENTER] volta pro menu',

  // 17. Enemy taunts (uso futuro)
  'enemy.frevo': 'PASSISTA DE FREVO',
  'enemy.caboclinho': 'CABOCLINHO',
  'enemy.mamulengo': 'MAMULENGO',
  'enemy.lanca': 'CABOCLO DE LANÇA',
  'enemy.urubu': 'URUBU DO CAPIBARIBE',
  'enemy.papafigo': 'PAPA-FIGO',
  'enemy.fulozinha': 'COMADRE FULOZINHA',
  'enemy.bestafera': 'BESTA-FERA',
  'enemy.mosca': 'MOSCA DA MANGA',

  // 18. Erros
  'error.no_storage': 'SEM SALVAMENTO — NAVEGADOR BLOQUEOU',
  'error.asset_fail': 'FALTOU UM PEDAÇO. APERTA F5.',
  'error.webgl': 'TEU NAVEGADOR TÁ FRACO',
  'error.generic': 'DEU RUIM, CABRA.',

  // Controles
  'controls.hint': '[SETAS] move (4 direções)  [ESPAÇO] atira  [ESC] pausa  [F] tela cheia',
  'controls.fullscreen_hint': '[F] TELA CHEIA'
};

export function getString(key: string, ...args: Array<string | number>): string {
  const template = STRINGS[key] ?? key;
  let i = 0;
  return template.replace(/%n|%s/g, () => String(args[i++] ?? ''));
}

export function getGameOverTitle(): string {
  const variants = ['gameover.1', 'gameover.2', 'gameover.3', 'gameover.4', 'gameover.5', 'gameover.6', 'gameover.7'];
  const pick = variants[Math.floor(Math.random() * variants.length)];
  return getString(pick);
}

export function getPickupTaunt(): string {
  const variants = ['pickup.arretado', 'pickup.visse', 'pickup.egua', 'pickup.paidegua', 'pickup.oxente', 'pickup.danou', 'pickup.bicho'];
  const pick = variants[Math.floor(Math.random() * variants.length)];
  return getString(pick);
}
