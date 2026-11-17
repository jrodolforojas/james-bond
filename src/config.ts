export const NEW_007_NAME = (import.meta.env.VITE_NEW_007_NAME ?? '').trim();

function readDemoFlag(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('demo') === '1';
}

export const DEMO = readDemoFlag();
