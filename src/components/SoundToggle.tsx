import { useTranslation } from 'react-i18next';
import { setSoundEnabled } from '../audio/audio';
import { useMission } from '../state/store';

export function SoundToggle() {
  const { t } = useTranslation();
  const soundOn = useMission((state) => state.soundOn);
  const setSoundOn = useMission((state) => state.setSoundOn);

  const toggle = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  return (
    <button
      type="button"
      className="sound-toggle"
      aria-pressed={soundOn}
      aria-label={soundOn ? t('soundOn') : t('soundOff')}
      onClick={toggle}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill="currentColor" />
        {soundOn && (
          <path d="M16 9 Q19 12 16 15 M18 6 Q23 12 18 18" fill="none" stroke="currentColor" strokeWidth="2" />
        )}
        {!soundOn && <path d="M16 9 L22 15 M22 9 L16 15" stroke="currentColor" strokeWidth="2" />}
      </svg>
    </button>
  );
}
