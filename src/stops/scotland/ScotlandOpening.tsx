import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ScotlandHouse } from '../../art/ScotlandHouse';
import { useAmbience } from '../../audio/useAmbience';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { prefersReducedMotion } from '../../motion';

interface ScotlandOpeningProps {
  onPrepare: () => void;
}

export function ScotlandOpening({ onPrepare }: ScotlandOpeningProps) {
  const { t } = useTranslation('scotland');
  const scope = useRef<HTMLElement>(null);
  useAmbience('wind');

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.to('[data-mist] path', {
        x: 24,
        duration: 6,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        stagger: 1.5,
      });
      gsap.from('[data-reveal]', {
        opacity: 0,
        y: 10,
        duration: 1,
        stagger: 0.8,
        delay: 0.8,
        ease: 'sine.out',
      });
    },
    { scope },
  );

  return (
    <main className="screen sco-opening" ref={scope}>
      <p className="eyebrow">{t('eyebrow')}</p>
      <h1 className="display sco-opening__title">
        {t('titleStart')}
        <em>{t('titleEm')}</em>
      </h1>
      <ScotlandHouse label={t('houseLabel')} />
      <div data-reveal>
        <MoneypennyRadio>{`"${t('opening')}"`}</MoneypennyRadio>
      </div>
      <p className="sco-opening__silva" data-reveal>
        {t('silva')}
      </p>
      <button type="button" className="btn sco-opening__go" data-reveal onClick={onPrepare}>
        {t('prepare')}
      </button>
    </main>
  );
}
