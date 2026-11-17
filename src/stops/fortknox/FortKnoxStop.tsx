import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../../analytics/track';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { Stamp } from '../../components/Stamp';
import { navigate } from '../../flow/navigate';
import { prefersReducedMotion } from '../../motion';
import { usePerks } from '../../perks/usePerks';
import { useMission } from '../../state/store';
import { EVIDENCE_NUMBER, nextStop } from '../catalog';
import { ExitSequence } from '../ExitSequence';
import { leaveStop } from '../leaveStop';
import { StopTitleCard } from '../StopTitleCard';
import { GoldToNight } from '../scotland/GoldToNight';
import { BombGame } from './BombGame';
import { FortKnoxOpening } from './FortKnoxOpening';
import { FREEZE_AT_MS, formatClock, isLateDefuse, shuffleWires, type Wire } from './rules';
import './fortknox.css';

type Phase =
  | { name: 'title' }
  | { name: 'opening' }
  | { name: 'game'; attempt: number; cut: Wire[] }
  | { name: 'won'; frozenMs: number }
  | { name: 'lost'; attempt: number; cut: Wire[] }
  | { name: 'toNight' };

const STOP = 'fortknox';

function FailScreen({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation('fortknox');
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set('[data-flash]', { opacity: 0 });
        return;
      }
      gsap
        .timeline()
        .to('[data-flash]', { opacity: 0, duration: 0.6, delay: 0.12, ease: 'power2.out' })
        .from('[data-fail-reveal]', { opacity: 0, y: 10, duration: 0.4, stagger: 0.25 });
    },
    { scope },
  );

  return (
    <main className="screen fk-lost" ref={scope}>
      <div className="fk-lost__flash" data-flash aria-hidden="true" />
      <div data-fail-reveal>
        <Stamp color="#8e897f">{t('failStamp')}</Stamp>
      </div>
      <div data-fail-reveal style={{ width: '100%' }}>
        <MoneypennyRadio>{`"${t('fail')}"`}</MoneypennyRadio>
      </div>
      <button type="button" className="btn fk-lost__retry" data-fail-reveal onClick={onRetry}>
        {t('retry')}
      </button>
    </main>
  );
}

function WonHero({ frozenMs }: { frozenMs: number }) {
  const { t } = useTranslation('fortknox');
  const late = isLateDefuse(frozenMs);
  return (
    <div className="fk-won">
      <p className="eyebrow">{t('stopped')}</p>
      <span className="fk-won__digits">{formatClock(frozenMs)}</span>
      <MoneypennyRadio>{`"${late ? t('successLate') : t('success')}"`}</MoneypennyRadio>
    </div>
  );
}

export function FortKnoxStop() {
  const { t } = useTranslation('fortknox');
  const [phase, setPhase] = useState<Phase>({ name: 'title' });
  const [wireOrder] = useState(shuffleWires);
  const perks = usePerks();
  const completeStop = useMission((state) => state.completeStop);
  const leave = () => {
    completeStop(STOP);
    if (nextStop(useMission.getState().completed) === 'scotland') return setPhase({ name: 'toNight' });
    leaveStop(STOP);
  };

  if (phase.name === 'toNight') {
    return (
      <GoldToNight label={t('nightLabel')} onDone={() => navigate({ screen: 'stop', stop: 'scotland' })} />
    );
  }
  if (phase.name === 'title')
    return <StopTitleCard stop={STOP} onDone={() => setPhase({ name: 'opening' })} />;
  if (phase.name === 'opening')
    return <FortKnoxOpening onEnter={() => setPhase({ name: 'game', attempt: 1, cut: [] })} />;
  if (phase.name === 'lost')
    return (
      <FailScreen onRetry={() => setPhase({ name: 'game', attempt: phase.attempt + 1, cut: phase.cut })} />
    );
  if (phase.name === 'won') {
    return (
      <ExitSequence
        hero={<WonHero frozenMs={phase.frozenMs} />}
        evidenceNumber={EVIDENCE_NUMBER[STOP] ?? 0}
        cardId="villains"
        cardTitle={t('card')}
        continueLabel={t('next')}
        accent="var(--fortknox-gold)"
        onContinue={leave}
      />
    );
  }
  return (
    <BombGame
      key={phase.attempt}
      order={wireOrder}
      bonusMs={perks.bombBonusMs}
      laserCuts={phase.attempt === 1 ? perks.laserCuts : 0}
      onEject={() => {
        completeStop(STOP);
        setPhase({ name: 'won', frozenMs: FREEZE_AT_MS });
      }}
      previouslyCut={phase.cut}
      onDefused={(frozenMs) => {
        completeStop(STOP);
        setPhase({ name: 'won', frozenMs });
      }}
      onExploded={(cut) => {
        trackEvent('minigame_failed', { stop: 'fortknox' });
        setPhase({ name: 'lost', attempt: phase.attempt, cut });
      }}
    />
  );
}
