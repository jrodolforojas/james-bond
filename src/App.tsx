import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useEffect } from 'react';
import { setSoundEnabled } from './audio/audio';
import { useUiSounds } from './audio/useUiSounds';
import { LanguageSwitch } from './components/LanguageSwitch';
import { LegalFooter } from './components/LegalFooter';
import { SoundToggle } from './components/SoundToggle';
import { DEMO } from './config';
import { DemoPanel } from './demo/DemoPanel';
import { FlowRouter } from './flow/FlowRouter';
import { useMission } from './state/store';

function useUnlockSavedSound() {
  useEffect(() => {
    const unlock = () => {
      if (useMission.getState().soundOn) setSoundEnabled(true);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);
}

export function App() {
  useUnlockSavedSound();
  useUiSounds();
  return (
    <div className="app">
      <div className="column">
        <SoundToggle />
        <LanguageSwitch />
        <FlowRouter />
        <LegalFooter />
        <DemoPanel />
      </div>
      {!DEMO && <Analytics />}
      {!DEMO && <SpeedInsights />}
    </div>
  );
}
