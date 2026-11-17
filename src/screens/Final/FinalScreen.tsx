import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { NEW_007_NAME } from '../../config';
import { Dossier } from '../../dossier/Dossier';
import { transition } from '../../flow/navigate';
import { prefersReducedMotion } from '../../motion';
import { useMission } from '../../state/store';
import './final.css';

const SMOKE_RIBBONS = [
  { d: 'M-20 300 C 60 240, 120 360, 200 290 S 340 220, 410 280', width: 22 },
  { d: 'M-20 360 C 80 320, 140 410, 230 350 S 360 300, 410 340', width: 14 },
  { d: 'M20 200 C 90 160, 150 240, 220 190 S 330 140, 400 180', width: 8 },
];

export function FinalScreen() {
  const { t } = useTranslation('final');
  const finishMission = useMission((state) => state.finishMission);
  const reset = useMission((state) => state.reset);
  const scope = useRef<HTMLElement>(null);

  useEffect(() => {
    finishMission();
  }, [finishMission]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap
        .timeline()
        .from('[data-page]', { opacity: 0, scale: 0.92, duration: 0.8, ease: 'power2.out' })
        .from(
          '[data-smoke]',
          { opacity: 0, x: (i) => (i % 2 ? 60 : -60), duration: 1.4, stagger: 0.2, ease: 'sine.out' },
          '+=0.2',
        )
        .from('[data-figure]', { opacity: 0, duration: 1.6, ease: 'sine.inOut' }, '-=0.8')
        .from('[data-final-reveal]', { opacity: 0, y: 10, duration: 0.6, stagger: 0.4 }, '+=0.2');
      gsap.to('[data-smoke]', {
        x: (i) => (i % 2 ? -18 : 18),
        duration: 5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 2,
      });
      gsap.to('[data-figure]', {
        scale: 1.01,
        transformOrigin: '50% 100%',
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 3,
      });
    },
    { scope },
  );

  return (
    <main className="screen final" ref={scope}>
      <svg className="final__silhouette" viewBox="0 0 390 420" role="img" aria-label={t('silhouetteLabel')}>
        <g fill="none" stroke="#f5f5f5" strokeLinecap="round" opacity="0.18">
          {SMOKE_RIBBONS.map((ribbon) => (
            <path key={ribbon.d} d={ribbon.d} strokeWidth={ribbon.width} data-smoke />
          ))}
        </g>
        <g transform="translate(115 30)" data-figure>
          <ellipse cx="80" cy="52" rx="27" ry="33" fill="#f5f5f5" />
          <path
            d="M52 92 Q80 102 108 92 L140 110 Q156 118 158 140 L162 380 L-2 380 L2 140 Q4 118 20 110 Z"
            fill="#f5f5f5"
          />
          <path d="M68 96 L80 132 L92 96 Z" fill="#000" />
        </g>
      </svg>

      <article className="final__page" data-page>
        <h1 className="display final__agent">{t('agent')}</h1>
        <p style={{ margin: 0 }}>
          {t('identity')}{' '}
          {NEW_007_NAME ? (
            <strong>{NEW_007_NAME}</strong>
          ) : (
            <span className="redacted" role="img" aria-label={t('hiddenIdentity')}>
              ██████████████
            </span>
          )}
        </p>
        <p style={{ margin: 0 }}>{t('status')}</p>
        <p style={{ margin: 0 }}>{t('clearance')}</p>
      </article>

      <div className="final__radio" data-final-reveal>
        <MoneypennyRadio>{`"${t('moneypenny')}"`}</MoneypennyRadio>
      </div>

      <button
        type="button"
        className="btn final__restart"
        data-final-reveal
        onClick={() => transition(reset)}
      >
        {t('restart')}
      </button>

      <Dossier />
    </main>
  );
}
