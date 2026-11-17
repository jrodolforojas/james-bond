import { useEffect } from 'react';
import { playCue } from './audio';

const CLICKABLE = 'button, a[href], [role="button"]';
const SELECTABLE = '[aria-pressed], [role="radio"]';

function onClick(event: MouseEvent) {
  const target = event.target instanceof Element ? event.target.closest<HTMLElement>(CLICKABLE) : null;
  if (!target || target.matches(':disabled') || target.dataset.sfx === 'none') return;
  playCue(target.matches(SELECTABLE) ? 'select' : 'click');
}

function onChange(event: Event) {
  if (!(event.target instanceof HTMLInputElement) || event.target.type !== 'radio') return;
  playCue('select');
}

export function useUiSounds() {
  useEffect(() => {
    document.addEventListener('click', onClick, true);
    document.addEventListener('change', onChange, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('change', onChange, true);
    };
  }, []);
}
