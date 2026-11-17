import { useEffect } from 'react';
import { useMission } from '../state/store';
import { startAmbient, startMusic, stopAmbient, stopMusic } from './audio';
import type { AmbienceName } from './synth';

export function useAmbience(name: AmbienceName, active = true) {
  const soundOn = useMission((state) => state.soundOn);
  useEffect(() => {
    if (!active || !soundOn) return;
    startAmbient(name);
    return () => stopAmbient(name);
  }, [name, active, soundOn]);
}

export function useMusic(active = true) {
  const soundOn = useMission((state) => state.soundOn);
  useEffect(() => {
    if (!active || !soundOn) return;
    startMusic();
    return () => stopMusic();
  }, [active, soundOn]);
}
