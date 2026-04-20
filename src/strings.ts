// Strings PT-BR pernambucanas do jogo.
// Fonte canônica: docs/GLOSSARY_PT_BR.md — manter sincronizado.

const STRINGS: Record<string, string> = {
  // 1. Boot / Splash
  'boot.title': 'OS CABRA',
  'boot.tagline': 'um traçado pernambucano',
  'boot.skip': '[ESPAÇO] pula',

  // 2. Menu Principal
  'menu.play': 'ARROCHA AÍ',
  'menu.codes': 'CÓDIGOS DOS CABRA',
  'menu.credits': 'QUEM FEZ ESSE TRAÇADO',
  'menu.quit': 'VAZAR',
  'menu.highscore': 'RECORDE: %n',
  'menu.hint': '[ENTER] pra começar',

  // 3. Dialog genéricos
  'dialog.yes': 'VISSE',
  'dialog.no': 'DEIXA PRA LÁ',
  'dialog.back': 'VOLTAR',
  'dialog.ok': 'BORA',
  'dialog.quit_confirm': 'VAZAR MESMO? PERDE TUDO.',
  'dialog.restart_confirm': 'RECOMEÇA A FASE INTEIRA?',

  // 5. Preload tips
  'tip.hold_on': 'SEGURA O CABRA, QUE JÁ VAI.',
  'tip.dodge': 'SE TOMAR TIRO, TU VÊ ESTRELA.',
  'tip.swarm': 'QUANDO VIER MUITO, CORRE PRO CANTO.',
  'tip.umbrella': 'SOMBRINHA DE FREVO BLOQUEIA UM HIT SÓ.',
  'tip.bomb': 'TÁ APERTADO? [X] E PRONTO.',
  'tip.checkpoint': 'MORREU NO MEIO DA FASE? VOLTA DO CHECKPOINT.',
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
  'feedback.chain10': 'TÁ ARRASANDO',
  'feedback.chain20': 'É BRABO MESMO',
  'feedback.milestone_10k': 'ÉGUA! 10 MIL',
  'feedback.milestone_50k': 'MEIO CENTO, CABRA!',
  'feedback.milestone_100k': 'CEM MIL ARRETADO',
  'feedback.damage': 'AÍ, VIU?',
  'feedback.last_life': 'É A ÚLTIMA!',
  'feedback.life_up': 'TÁ COM TUDO',
  'feedback.perfect_wave': 'LIMPOU TUDO',
  'feedback.wave_complete': 'ONDA %n VAI',

  // Pickup variations
  'pickup.arretado': 'ARRETADO!',
  'pickup.visse': 'VISSE?!',
  'pickup.egua': 'ÉGUA!',
  'pickup.massa': 'TÁ MASSA',
  'pickup.paidegua': "PAI D'ÉGUA",
  'pickup.oxente': 'OXENTE!',

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
  'pause.quit': 'VAZAR PRO MENU',
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
  'stage_end.continue': 'BORA PRA PRÓXIMA',
  'stage_end.quit': 'VAZAR',

  // 14. Game Over
  'gameover.title': 'SE LASCOU',
  'gameover.1': 'SE LASCOU',
  'gameover.2': 'RAPAZ...',
  'gameover.3': 'NÃO DEU NÃO',
  'gameover.4': 'VOLTA ESSA FITA',
  'gameover.5': 'FOI BRABO MESMO',
  'gameover.6': 'PAGOU O PREÇO',
  'gameover.7': 'FICA PRA OUTRO DIA',
  'gameover.score_label': 'FEZ',
  'gameover.new_record': 'NOVO RECORDE!',
  'gameover.retry': 'TENTA DE NOVO',
  'gameover.menu': 'MENU',
  'gameover.hint': '[ENTER] volta pro menu',
  'gameover.shortcuts': 'ENTER menu · R recomeça · C copia código',

  // Fase completa
  'stage.complete': 'FASE COMPLETA',
  'stage.complete.hint': '[ENTER] volta pro menu',

  // Controles
  'controls.hint': '[SETAS] move  [ESPAÇO] atira  [ESC] pausa  [F] tela cheia',
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
  const variants = ['pickup.arretado', 'pickup.visse', 'pickup.egua', 'pickup.massa', 'pickup.paidegua', 'pickup.oxente'];
  const pick = variants[Math.floor(Math.random() * variants.length)];
  return getString(pick);
}
