import { flushSync } from 'react-dom';
import { prefersReducedMotion } from '../motion';
import { type Step, useMission } from '../state/store';

export function transition(apply: () => void) {
  if (prefersReducedMotion() || !document.startViewTransition) return apply();
  document.startViewTransition(() => flushSync(apply));
}

export function navigate(step: Step) {
  transition(() => useMission.getState().setStep(step));
}
