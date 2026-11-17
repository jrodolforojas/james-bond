import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../../analytics/track';
import { ScotlandHouse } from '../../art/ScotlandHouse';
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
import { EmberToSun } from './EmberToSun';
import type { Lane } from './rules';
import { ScotlandOpening } from './ScotlandOpening';
import { Shootout } from './Shootout';
import { TrapSetup } from './TrapSetup';
import './scotland.css';
import { useAmbience } from '../../audio/useAmbience';

type Phase =
  | { name: 'title' }
  | { name: 'opening' }
  | { name: 'traps' }
  | { name: 'game'; attempt: number }
  | { name: 'lost'; attempt: number }
  | { name: 'won' }
  | { name: 'transition' };

const STOP = 'scotland';

function BurningHouse() {
  const { t } = useTranslation('scotland');
  const scope = useRef<HTMLDivElement>(null);
  useAmbience('fire');

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.to('[data-flames] path', {
        scaleY: 1.12,
        transformOrigin: '50% 100%',
        duration: 0.35,
        yoyo: true,
        repeat: -1,
        stagger: 0.1,
        ease: 'sine.inOut',
      });
    },
    { scope },
  );

  return (
    <div className="sco-close" ref={scope}>
      <p className="eyebrow">{t('silence')}</p>
      <ScotlandHouse burning label={t('burningLabel')} />
    </div>
  );
}

function LostScreen({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation('scotland');
  return (
    <main className="screen sco-lost">
      <Stamp color="#8e897f">{t('failStamp')}</Stamp>
      <MoneypennyRadio>{`"${t('fail')}"`}</MoneypennyRadio>
      <button type="button" className="btn sco-lost__retry" onClick={onRetry}>
        {t('retry')}
      </button>
    </main>
  );
}

function goOnFromScotland() {
  const upcoming = nextStop(useMission.getState().completed);
  if (upcoming === 'jamaica') return navigate({ screen: 'stop', stop: 'jamaica' });
  leaveStop(STOP);
}

export function ScotlandStop() {
  const { t } = useTranslation(['scotland', 'common']);
  const [phase, setPhase] = useState<Phase>({ name: 'title' });
  const [traps, setTraps] = useState<Lane[]>([]);
  const completeStop = useMission((state) => state.completeStop);
  const perks = usePerks();
  const attempt = phase.name === 'game' ? phase.attempt : 0;

  const won = useCallback(() => {
    completeStop(STOP);
    setPhase({ name: 'won' });
  }, [completeStop]);

  const lost = useCallback(() => {
    trackEvent('minigame_failed', { stop: 'scotland' });
    setPhase({ name: 'lost', attempt });
  }, [attempt]);

  if (phase.name === 'title') {
    return <StopTitleCard stop={STOP} onDone={() => setPhase({ name: 'opening' })} />;
  }
  if (phase.name === 'opening') return <ScotlandOpening onPrepare={() => setPhase({ name: 'traps' })} />;
  if (phase.name === 'traps') {
    return (
      <TrapSetup
        initial={traps}
        onReady={(chosen) => {
          setTraps(chosen);
          setPhase({ name: 'game', attempt: 1 });
        }}
      />
    );
  }
  if (phase.name === 'lost') {
    return <LostScreen onRetry={() => setPhase({ name: 'game', attempt: phase.attempt + 1 })} />;
  }
  if (phase.name === 'transition') {
    return <EmberToSun label={t('transitionLabel')} onDone={goOnFromScotland} />;
  }
  if (phase.name === 'won') {
    return (
      <ExitSequence
        hero={<BurningHouse />}
        evidenceNumber={EVIDENCE_NUMBER[STOP] ?? 0}
        cardId="origin"
        cardTitle={t('card')}
        continueLabel={t('common:continue')}
        accent="var(--scotland-fire)"
        onContinue={() => setPhase({ name: 'transition' })}
      />
    );
  }
  return (
    <Shootout
      key={phase.attempt}
      traps={traps}
      lives={perks.shootoutLives}
      hitRadius={perks.shootoutHitRadius}
      db5Support={perks.db5Support}
      onEject={won}
      onWon={won}
      onLost={lost}
    />
  );
}
