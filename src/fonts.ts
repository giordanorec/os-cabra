// Importa as fontes locais via @fontsource — conforme docs/UI_STYLE_GUIDE.md §5.
// Garante que os pesos usados em textos do Phaser estejam disponíveis antes de renderizar.

import '@fontsource/rye/400.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';

export const FONTS = {
  DISPLAY: 'Rye, serif',
  BODY: 'Inter, sans-serif',
  MONO: 'JetBrains Mono, monospace'
} as const;

// Aguarda o carregamento das fontes críticas antes de iniciar cenas com texto display.
export async function waitForFonts(): Promise<void> {
  if (!('fonts' in document)) return;
  try {
    await Promise.all([
      document.fonts.load('400 48px Rye'),
      document.fonts.load('400 18px Inter'),
      document.fonts.load('700 18px Inter'),
      document.fonts.load('400 18px "JetBrains Mono"')
    ]);
  } catch {
    // silencioso — fonte não carregou, fallback system garante legibilidade
  }
}
