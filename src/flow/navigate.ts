import { flushSync } from 'react-dom';
import { playCue } from '../audio/audio';
import { prefersReducedMotion } from '../motion';
import { type Step, useMission } from '../state/store';

export function transition(apply: () => void) {
  playCue('whoosh');
  if (prefersReducedMotion() || !document.startViewTransition) return apply();
  document.startViewTransition(() => flushSync(apply));
}

export function navigate(step: Step) {
  transition(() => useMission.getState().setStep(step));
}
