import { useEffect } from 'react';
import { useMission } from '../state/store';
import { startAmbient, stopAmbient } from './audio';
import type { AmbienceName } from './synth';

export function useAmbience(name: AmbienceName, active = true) {
  const soundOn = useMission((state) => state.soundOn);
  useEffect(() => {
    if (!active || !soundOn) return;
    startAmbient(name);
    return () => stopAmbient(name);
  }, [name, active, soundOn]);
}
