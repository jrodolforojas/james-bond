import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GadgetIcon } from '../../art/LondonScene';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { prefersReducedMotion } from '../../motion';
import { GADGETS, type GadgetId } from '../../state/store';

interface QLabProps {
  initial: GadgetId | null;
  onSign: (gadget: GadgetId) => void;
}

export function QLab({ initial, onSign }: QLabProps) {
  const { t } = useTranslation('london');
  const scope = useRef<HTMLElement>(null);
  const [picked, setPicked] = useState<GadgetId>(initial ?? 'laser');

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from('[data-gadget]', { opacity: 0, x: -20, duration: 0.4, stagger: 0.12, ease: 'power2.out' });
    },
    { scope },
  );

  return (
    <main className="screen lab" ref={scope}>
      <p className="eyebrow lab__hud">
        {t('labEyebrow')} · {t('labCount')}
      </p>
      <h1 className="display lab__title">
        {t('labTitleStart')}
        <em>{t('labTitleEm')}</em>
      </h1>

      <fieldset className="lab__options">
        <legend className="sr-only">{t('gadgetsLabel')}</legend>
        {GADGETS.map((gadget) => {
          const checked = picked === gadget;
          return (
            <label key={gadget} className="gadget" data-gadget>
              <input
                type="radio"
                name="gadget"
                value={gadget}
                checked={checked}
                onChange={() => setPicked(gadget)}
              />
              <span className="gadget__icon">
                <GadgetIcon gadget={gadget} color={checked ? '#e0534a' : '#5b6770'} />
              </span>
              <span className="gadget__text">
                <span className="gadget__name">{t(`gadgets.${gadget}.name`)}</span>
                <span className="gadget__place">
                  {t('usefulIn', { place: t(`gadgets.${gadget}.place`) })}
                </span>
                <span className="gadget__perk">{t(`gadgets.${gadget}.perk`)}</span>
              </span>
            </label>
          );
        })}
      </fieldset>

      <MoneypennyRadio speaker={t('qSpeaker')}>{`"${t('qLine')}"`}</MoneypennyRadio>

      <button type="button" className="btn lab__sign" onClick={() => onSign(picked)}>
        {t('sign')}
      </button>
    </main>
  );
}
