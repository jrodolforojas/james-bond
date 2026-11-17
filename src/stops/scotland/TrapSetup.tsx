import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HOUSE_VIEW, ScotlandHouse, SLOT_BOXES } from '../../art/ScotlandHouse';
import { LANES, type Lane, TRAP_COUNT } from './rules';

interface TrapSetupProps {
  initial: readonly Lane[];
  onReady: (traps: Lane[]) => void;
}

function toggleTrap(traps: readonly Lane[], lane: Lane): Lane[] {
  if (traps.includes(lane)) return traps.filter((trap) => trap !== lane);
  if (traps.length < TRAP_COUNT) return [...traps, lane];
  return [...traps.slice(1), lane];
}

export function TrapSetup({ initial, onReady }: TrapSetupProps) {
  const { t } = useTranslation('scotland');
  const [traps, setTraps] = useState<Lane[]>([...initial]);

  return (
    <main className="screen sco-traps">
      <p className="eyebrow">{t('eyebrow')}</p>
      <h1 className="display sco-traps__title">{t('trapsTitle')}</h1>
      <p className="sco-traps__hint">{t('trapsHint')}</p>

      <fieldset className="sco-traps__house">
        <legend className="sr-only">{t('trapsLegend')}</legend>
        <ScotlandHouse />
        {LANES.map((lane) => {
          const box = SLOT_BOXES[lane];
          const armed = traps.includes(lane);
          return (
            <button
              key={lane}
              type="button"
              className="sco-slot"
              aria-pressed={armed}
              aria-label={t(`lanes.${lane}`)}
              style={{
                left: `${(box.x / HOUSE_VIEW.width) * 100}%`,
                top: `${(box.y / HOUSE_VIEW.height) * 100}%`,
                width: `${(box.w / HOUSE_VIEW.width) * 100}%`,
                height: `${(box.h / HOUSE_VIEW.height) * 100}%`,
              }}
              onClick={() => setTraps((current) => toggleTrap(current, lane))}
            >
              {armed ? t('trap') : ''}
            </button>
          );
        })}
      </fieldset>

      <p className="sco-traps__count" aria-live="polite">
        {t('trapsCount', { n: traps.length, total: TRAP_COUNT })}
      </p>
      <button
        type="button"
        className="btn sco-traps__go"
        disabled={traps.length < TRAP_COUNT}
        onClick={() => onReady(traps)}
      >
        {t('letThemCome')}
      </button>
    </main>
  );
}
