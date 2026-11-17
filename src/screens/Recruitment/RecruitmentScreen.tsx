import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VehicleSilhouette } from '../../art/VehicleSilhouette';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { Stamp } from '../../components/Stamp';
import { navigate } from '../../flow/navigate';
import { prefersReducedMotion } from '../../motion';
import { ERAS, type EraId, useMission } from '../../state/store';
import { ERA_COLORS } from './eras';
import './recruitment.css';
import { playCue } from '../../audio/audio';

const LOCKED_INDEX = ERAS.length;
const LOCKED_COLOR = '#3a3a3d';

function eraColor(index: number): string {
  const era = ERAS[index];
  if (!era) return LOCKED_COLOR;
  return ERA_COLORS[era];
}

export function RecruitmentScreen() {
  const { t } = useTranslation('recruitment');
  const chooseEra = useMission((state) => state.chooseEra);
  const scope = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (!visible) return;
        setActive(Number((visible.target as HTMLElement).dataset.index));
      },
      { root: track, threshold: 0.7 },
    );
    track.querySelectorAll('[data-index]').forEach((card) => {
      observer.observe(card);
    });
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const card = scope.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
      if (!card || active === LOCKED_INDEX) return;
      const body = card.querySelector('[data-body]');
      if (prefersReducedMotion()) {
        gsap.set(body, { fill: '#f4eee1' });
        return;
      }
      playCue('whoosh');
      gsap
        .timeline()
        .set(body, { fill: '#1c1c1e' })
        .fromTo(
          card.querySelector('[data-sweep]'),
          { xPercent: -200 },
          { xPercent: 330, duration: 1.1, ease: 'power1.inOut' },
        )
        .to(body, { fill: '#f4eee1', duration: 0.7, ease: 'power1.in' }, 0.25);
    },
    { scope, dependencies: [active] },
  );

  const { contextSafe } = useGSAP({ scope });

  const assign = contextSafe(() => {
    const era: EraId | undefined = ERAS[active];
    if (!era || assigning) return;
    setAssigning(true);
    playCue('stamp');
    const stamp = scope.current?.querySelector(`[data-index="${active}"] [data-stamp]`);
    const finish = () => {
      chooseEra(era);
      navigate({ screen: 'map' });
    };
    if (prefersReducedMotion()) {
      gsap.to(stamp ?? {}, {
        opacity: 1,
        duration: 0.2,
        onComplete: () => void gsap.delayedCall(0.4, finish),
      });
      return;
    }
    gsap
      .timeline({ onComplete: finish })
      .fromTo(
        stamp ?? {},
        { opacity: 0, scale: 1.6 },
        { opacity: 1, scale: 1, duration: 0.18, ease: 'power4.in' },
      )
      .to(scope.current, { x: 4, duration: 0.04, yoyo: true, repeat: 3 })
      .to({}, { duration: 0.6 });
  });

  const activeStyle = { '--era': eraColor(active) } as CSSProperties;

  return (
    <main className="screen recruitment" ref={scope} style={activeStyle}>
      <header className="recruitment__head">
        <p className="eyebrow">{t('eyebrow')}</p>
        <h1 className="display recruitment__title">
          {t('titleStart')}
          <em>{t('titleEm')}</em>
        </h1>
      </header>

      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: the scroll container must be keyboard-scrollable */}
      <ul className="carousel" ref={trackRef} aria-label={t('carousel')} tabIndex={0}>
        {ERAS.map((era, index) => (
          <li
            key={era}
            data-index={index}
            className={`era-card ${index === active ? 'is-active' : ''}`}
            style={{ '--era': ERA_COLORS[era] } as CSSProperties}
          >
            <div className="era-card__stage">
              <div className="era-card__sweep" data-sweep />
              <VehicleSilhouette era={era} rim={ERA_COLORS[era]} />
              <span className="era-card__years">
                {t('era', { n: String(index + 1).padStart(2, '0') })} · {t(`eras.${era}.years`)}
              </span>
            </div>
            <div className="era-card__body">
              <span className="era-card__meta">
                {t(`eras.${era}.actor`)} · <em>{t(`eras.${era}.film`)}</em>
              </span>
              <h2 className="display era-card__vehicle">{t(`eras.${era}.vehicle`)}</h2>
              <p className="era-card__line">{t(`eras.${era}.line`)}</p>
              <div className="era-card__perk">
                <span className="era-card__perk-label">{t('perk')}</span>
                <span>{t(`eras.${era}.perk`)}</span>
              </div>
            </div>
            <div className="era-card__stamp" data-stamp aria-hidden="true">
              <Stamp color={ERA_COLORS[era]}>{t('assigned')}</Stamp>
            </div>
          </li>
        ))}
        <li
          data-index={LOCKED_INDEX}
          className={`era-card era-card--locked ${active === LOCKED_INDEX ? 'is-active' : ''}`}
          style={{ '--era': LOCKED_COLOR } as CSSProperties}
        >
          <div className="era-card__stage" />
          <div className="era-card__body">
            <h2 className="display era-card__vehicle">{t('lockedName')}</h2>
            <span aria-hidden="true">
              <span className="redacted">██████████</span>
            </span>
            <p className="era-card__line">{t('lockedLine')}</p>
          </div>
        </li>
      </ul>

      <div className="dots" aria-hidden="true">
        {[...ERAS, 'locked'].map((key, index) => (
          <span key={key} className={index === active ? 'is-active' : ''} />
        ))}
      </div>

      <div className="recruitment__radio">
        <MoneypennyRadio>{`"${t('moneypenny')}"`}</MoneypennyRadio>
      </div>

      <button
        type="button"
        className="btn recruitment__assign"
        onClick={assign}
        disabled={active === LOCKED_INDEX || assigning}
      >
        {t('assign')}
      </button>
    </main>
  );
}
