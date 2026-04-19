// Subset do glossário PT-BR pernambucano.
// Fonte: docs/GLOSSARY_PT_BR.md. Expandir conforme features entram.

const STRINGS: Record<string, string> = {
  'boot.title': 'OS CABRA',
  'boot.tagline': 'um traçado pernambucano',

  'menu.play': 'ARROCHA AÍ',
  'menu.highscore': 'RECORDE: %n',
  'menu.hint': '[ENTER] pra começar',

  'stage.1.name': 'MARCO ZERO',
  'stage.1.subtitle': 'ONDE TUDO COMEÇA',
  'stage.header': 'FASE %n',

  'hud.score_label': 'SCORE',

  'checkpoint.title': 'ONDE EU TAVA',

  'stage.complete': 'FASE COMPLETA',
  'stage.complete.hint': '[ENTER] volta pro menu',

  'gameover.title': 'SE LASCOU',
  'gameover.score_label': 'FEZ',
  'gameover.hint': '[ENTER] volta pro menu',

  'controls.hint': '[SETAS] move  [ESPAÇO] atira  [ESC] pausa',

  'pause.title': 'PAREI',
  'pause.resume': 'BORA',
  'pause.quit': 'VAZAR PRO MENU',
  'pause.hint': 'ESC retoma',

  'boss.appear': 'OXE!',
  'boss.1.name': 'MARACATU NAÇÃO',
  'boss.1.epithet': 'REI · RAINHA · CALUNGA',
  'boss.phase2': 'EITA, MUDOU',
  'boss.phase3': 'DANOU-SE AGORA',
  'boss.defeated': 'SE FOI',
  'boss.bonus_label': 'BONUS DE BOSS',
  'boss.lives_label': 'VIDAS RESTANTES',
  'boss.total_label': 'TOTAL'
};

export function getString(key: string, ...args: Array<string | number>): string {
  const template = STRINGS[key] ?? key;
  let i = 0;
  return template.replace(/%n|%s/g, () => String(args[i++] ?? ''));
}
