import { useEffect } from 'react';
import { setSoundEnabled } from './audio/audio';
import { LanguageSwitch } from './components/LanguageSwitch';
import { LegalFooter } from './components/LegalFooter';
import { SoundToggle } from './components/SoundToggle';
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
  return (
    <div className="app">
      <div className="column">
        <SoundToggle />
        <LanguageSwitch />
        <FlowRouter />
        <LegalFooter />
      </div>
    </div>
  );
}
