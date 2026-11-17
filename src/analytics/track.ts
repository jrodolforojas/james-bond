import { track } from '@vercel/analytics';
import { DEMO } from '../config';

type Props = Record<string, string | number | boolean>;

export function trackEvent(name: string, props?: Props) {
  if (DEMO) return;
  track(name, props);
}
