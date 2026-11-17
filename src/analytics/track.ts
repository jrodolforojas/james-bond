import { track } from '@vercel/analytics';
import { DEMO } from '../config';

type Props = Record<string, string | number | boolean>;

// Vercel Pro keeps at most 2 properties per custom event; extra ones are dropped.
export function trackEvent(name: string, props?: Props) {
  if (DEMO) return;
  track(name, props);
}
