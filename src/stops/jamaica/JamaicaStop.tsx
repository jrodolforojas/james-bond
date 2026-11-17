import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { unlockedIds } from '../../dossier/cards';
import { Dossier, type DossierHandle } from '../../dossier/Dossier';
import { prefersReducedMotion } from '../../motion';
import { usePerks } from '../../perks/usePerks';
import { useMission } from '../../state/store';
import { EVIDENCE_NUMBER } from '../catalog';
import { ExitSequence } from '../ExitSequence';
import { leaveStop } from '../leaveStop';
import { StopTitleCard } from '../StopTitleCard';
import { Interrogation } from './Interrogation';
import { JamaicaOpening } from './JamaicaOpening';
import { TvOff } from './TvOff';
import './jamaica.css';

type Phase =
  | { name: 'title' }
  | { name: 'opening' }
  | { name: 'game'; attempt: number }
  | { name: 'impostor'; attempt: number }
  | { name: 'passed' }
  | { name: 'tv' };

const STOP = 'jamaica';

function ImpostorScreen({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation('jamaica');
  const scope = useRef<HTMLElement>(null);
  const dossier = useRef<DossierHandle>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from('[data-impostor]', { opacity: 0, y: 12, duration: 0.6, stagger: 0.4, ease: 'power2.out' });
    },
    { scope },
  );

  return (
    <main className="screen impostor" ref={scope}>
      <p className="eyebrow" style={{ color: 'var(--stamp-bright)' }} data-impostor>
        {t('drNo')}
      </p>
      <p className="display impostor__line" data-impostor>
        {`"${t('impostor')}"`}
      </p>
      <div className="impostor__actions" data-impostor>
        <button type="button" className="btn impostor__read" onClick={() => dossier.current?.open()}>
          {t('readDossier')}
        </button>
        <button type="button" className="btn impostor__retry" onClick={onRetry}>
          {t('retry')}
        </button>
      </div>
      <Dossier ref={dossier} showTab={false} />
    </main>
  );
}

export function JamaicaStop() {
  const { t } = useTranslation('jamaica');
  const [phase, setPhase] = useState<Phase>({ name: 'title' });
  const completeStop = useMission((state) => state.completeStop);
  const era = useMission((state) => state.era);
  const completed = useMission((state) => state.completed);
  const step = useMission((state) => state.step);
  const finishedAt = useMission((state) => state.finishedAt);
  const perks = usePerks();
  const attempt = phase.name === 'game' ? phase.attempt : 0;

  const passed = useCallback(() => {
    completeStop(STOP);
    setPhase({ name: 'passed' });
  }, [completeStop]);

  const impostor = useCallback(() => setPhase({ name: 'impostor', attempt }), [attempt]);

  if (phase.name === 'title')
    return <StopTitleCard stop={STOP} onDone={() => setPhase({ name: 'opening' })} />;
  if (phase.name === 'opening')
    return <JamaicaOpening onFace={() => setPhase({ name: 'game', attempt: 1 })} />;
  if (phase.name === 'tv') return <TvOff onDone={() => leaveStop(STOP)} />;
  if (phase.name === 'impostor') {
    return <ImpostorScreen onRetry={() => setPhase({ name: 'game', attempt: phase.attempt + 1 })} />;
  }
  if (phase.name === 'passed') {
    return (
      <ExitSequence
        hero={
          <div className="jam-clean">
            <MoneypennyRadio>{`"${t('clean')}"`}</MoneypennyRadio>
          </div>
        }
        evidenceNumber={EVIDENCE_NUMBER[STOP] ?? 0}
        cardId="birthplace"
        cardTitle={t('card')}
        continueLabel={t('openFile')}
        accent="var(--final-white)"
        onContinue={() => setPhase({ name: 'tv' })}
      />
    );
  }
  return (
    <Interrogation
      key={phase.attempt}
      unlocked={unlockedIds({ era, completed, step, finishedAt })}
      maxWrong={perks.triviaMaxWrong}
      hints={phase.attempt === 1 ? perks.triviaHints : 0}
      onEject={passed}
      onPassed={passed}
      onImpostor={impostor}
    />
  );
}
