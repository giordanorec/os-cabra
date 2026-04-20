// Detecção de plataforma/capacidade do dispositivo.
// Responde 3 perguntas: tem touch? é mobile? portrait ou landscape? e qual tier de perf?
// iPadOS 13+ mente sobre UA (diz "Macintosh") — por isso cruzamos matchMedia(pointer: coarse)
// com maxTouchPoints, não UA sniffing.

export type PerfTier = 'low' | 'high';

export function isTouch(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = navigator as Navigator & { msMaxTouchPoints?: number };
  const maxTouch = nav.maxTouchPoints ?? nav.msMaxTouchPoints ?? 0;
  return 'ontouchstart' in window || maxTouch > 0;
}

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  // Dispositivo com ponteiro "grosso" (dedo) E touch habilitado → mobile/tablet.
  // Desktop com mouse: pointer: fine, sem touch. Hybrid (Surface): pointer: fine, mas com touch —
  // tratamos como desktop (usuário provavelmente tem teclado).
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  return coarse && isTouch();
}

export function isPortrait(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(orientation: portrait)').matches;
}

export function tier(): PerfTier {
  if (typeof navigator === 'undefined') return 'high';
  const cores = navigator.hardwareConcurrency ?? 4;
  // deviceMemory é non-standard; se ausente, assumimos 4GB
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  // iPad antigo (iPad Air 2, 2014): 2 cores PF + 1 LP, mem ~2GB. iPhone SE 2016: 2 cores.
  if (cores <= 2 || mem <= 2) return 'low';
  return 'high';
}

// Força um override via ?platform=mobile na URL — útil pra testar em desktop sem DevTools.
export function isForcedMobile(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('platform') === 'mobile';
}

export function shouldUseTouchControls(): boolean {
  return isMobile() || isForcedMobile();
}
