export function prefersReducedMotion(): boolean {
  if (new URLSearchParams(window.location.search).has('rm')) return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
