import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LondonScene, ShadowedM } from '../../art/LondonScene';
import { prefersReducedMotion } from '../../motion';

interface LondonOpeningProps {
  onContinue: () => void;
}

export function LondonOpening({ onContinue }: LondonOpeningProps) {
  const { t } = useTranslation('london');
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.to('[data-alarm]', { opacity: 0.25, duration: 0.5, yoyo: true, repeat: -1, ease: 'steps(1)' });
      gsap.to('[data-alarm-lights] rect', {
        opacity: 0.2,
        duration: 0.5,
        yoyo: true,
        repeat: -1,
        stagger: 0.12,
        ease: 'steps(1)',
      });
      gsap
        .timeline()
        .from('[data-building]', { y: 40, opacity: 0, duration: 0.9, ease: 'power2.out' })
        .from('[data-reveal]', { opacity: 0, y: 10, duration: 0.5, stagger: 0.3 }, '-=0.2');
    },
    { scope },
  );

  return (
    <main className="screen ldn-opening" ref={scope}>
      <div className="ldn-opening__alarm" data-alarm aria-hidden="true" />
      <p className="eyebrow">
        {t('eyebrow')} · <span className="ldn-opening__alert">{t('alert')}</span>
      </p>
      <h1 className="display ldn-opening__title">
        {t('titleStart')}
        <em>{t('titleEm')}</em>
      </h1>
      <p className="ldn-opening__theme">{t('theme')}</p>
      <LondonScene label={t('sceneLabel')} />

      <div className="ldn-call" data-reveal role="status">
        <div className="ldn-call__screen">
          <ShadowedM />
        </div>
        <div className="ldn-call__body">
          <span className="ldn-call__caller">{t('caller')}</span>
          <p className="ldn-call__text">{`"${t('order')}"`}</p>
        </div>
      </div>

      <button type="button" className="btn ldn-opening__go" data-reveal onClick={onContinue}>
        {t('toLab')}
      </button>
    </main>
  );
}
