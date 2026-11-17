import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMusic } from '../../audio/useAmbience';
import { MakerCredit } from '../../components/MakerCredit';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { transition } from '../../flow/navigate';
import { prefersReducedMotion } from '../../motion';
import { useMission } from '../../state/store';
import './arrival.css';
import { playCue } from '../../audio/audio';

const TYPE_SECONDS_PER_CHAR = 0.035;

function typeInto(timeline: gsap.core.Timeline, element: HTMLElement, text: string) {
  const counter = { chars: 0 };
  timeline.to(counter, {
    chars: text.length,
    duration: text.length * TYPE_SECONDS_PER_CHAR,
    ease: 'none',
    onUpdate: () => {
      const shown = Math.round(counter.chars);
      if (shown !== element.textContent?.length && shown % 2 === 0) playCue('key');
      element.textContent = text.slice(0, shown);
    },
  });
}

export function ArrivalScreen() {
  const { t, i18n } = useTranslation('arrival');
  const acceptMission = useMission((state) => state.acceptMission);
  const scope = useRef<HTMLElement>(null);
  useMusic();
  const lines = t('lines', { returnObjects: true });
  const transcript = [...lines, `${t('statusLabel')} ${t('statusValue')}`].join('. ');

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const lineEls = gsap.utils.toArray<HTMLElement>('[data-line]', root);
      const label = root.querySelector<HTMLElement>('[data-status-label]');
      const value = root.querySelector<HTMLElement>('[data-status-value]');
      if (!label || !value) return;
      const reveal = gsap.utils.toArray<HTMLElement>('[data-reveal]', root);

      if (prefersReducedMotion()) {
        lineEls.forEach((el, i) => {
          el.textContent = lines[i] ?? '';
        });
        label.textContent = t('statusLabel');
        value.textContent = t('statusValue');
        gsap.from(reveal, { opacity: 0, duration: 0.3 });
        return;
      }

      lineEls.forEach((el) => {
        el.textContent = '';
      });
      label.textContent = '';
      value.textContent = '';
      gsap.set(reveal, { opacity: 0, y: 8 });

      const timeline = gsap.timeline({ delay: 0.6 });
      lineEls.forEach((el, i) => {
        typeInto(timeline, el, lines[i] ?? '');
        timeline.to({}, { duration: 0.18 });
      });
      typeInto(timeline, label, t('statusLabel'));
      timeline
        .add(() => {
          value.textContent = t('statusValue');
          value.classList.remove('is-glitching');
          void value.offsetWidth;
          value.classList.add('is-glitching');
          playCue('static');
        })
        .to(reveal, { opacity: 1, y: 0, duration: 0.5, stagger: 0.25, ease: 'power2.out' }, '+=0.9');
    },
    { scope, dependencies: [i18n.language] },
  );

  const { contextSafe } = useGSAP({ scope });

  const accept = contextSafe(() => {
    const folder = scope.current?.querySelector<HTMLElement>('[data-folder]');
    if (!folder || prefersReducedMotion()) return transition(acceptMission);
    gsap
      .timeline({ onComplete: () => transition(acceptMission) })
      .set(folder, { display: 'block' })
      .from(folder, { yPercent: 100, duration: 0.45, ease: 'power3.out' })
      .to('[data-folder-lid]', { rotationX: 105, duration: 0.8, ease: 'power2.inOut' }, '+=0.1')
      .to('[data-folder-sheet]', { yPercent: -8, duration: 0.4, ease: 'power2.out' }, '-=0.2');
  });

  return (
    <main className="screen arrival" ref={scope}>
      <div className="arrival__scanlines" aria-hidden="true" />
      <div className="arrival__channel" aria-hidden="true">
        <span>{t('channel')}</span>
        <span className="arrival__rec">● REC</span>
      </div>

      <p className="sr-only">{transcript}</p>
      <div className="arrival__terminal" aria-hidden="true">
        {lines.map((line) => (
          <span key={line} className="arrival__line" data-line />
        ))}
        <span className="arrival__status">
          <span data-status-label />
          <span className="arrival__value" data-status-value />
          <span className="arrival__cursor" />
        </span>
      </div>

      <div className="arrival__radio" data-reveal>
        <MoneypennyRadio>{`"${t('message')}"`}</MoneypennyRadio>
      </div>
      <button type="button" className="btn btn--outline arrival__accept" data-reveal onClick={accept}>
        {t('accept')}
      </button>
      <div className="arrival__maker" data-reveal>
        <MakerCredit />
      </div>

      <div className="folder" data-folder aria-hidden="true">
        <div className="folder__back" />
        <div className="folder__sheet" data-folder-sheet />
        <div className="folder__lid" data-folder-lid>
          {t('folder')}
        </div>
      </div>
    </main>
  );
}
