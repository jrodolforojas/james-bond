import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase } from '../../art/MontenegroScene';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { navigate } from '../../flow/navigate';
import { useMission } from '../../state/store';
import { EVIDENCE_NUMBER, nextStop } from '../catalog';
import { ExitSequence } from '../ExitSequence';
import { leaveStop } from '../leaveStop';
import { StopTitleCard } from '../StopTitleCard';
import { ChipToCoin } from './ChipToCoin';
import { MontenegroOpening } from './MontenegroOpening';
import { PokerTable } from './PokerTable';
import './montenegro.css';

type Phase = 'title' | 'opening' | 'game' | 'found' | 'transition';

const STOP = 'montenegro';

function FoundHero() {
  const { t } = useTranslation('montenegro');
  return (
    <div className="mtn-found">
      <Briefcase open />
      <MoneypennyRadio>{`"${t('found')}"`}</MoneypennyRadio>
    </div>
  );
}

function goOnFromMontenegro() {
  const upcoming = nextStop(useMission.getState().completed);
  if (upcoming === 'fortknox') return navigate({ screen: 'stop', stop: 'fortknox' });
  leaveStop(STOP);
}

export function MontenegroStop() {
  const { t } = useTranslation(['montenegro', 'common']);
  const [phase, setPhase] = useState<Phase>('title');
  const completeStop = useMission((state) => state.completeStop);
  const found = () => {
    completeStop(STOP);
    setPhase('found');
  };

  if (phase === 'title') return <StopTitleCard stop={STOP} onDone={() => setPhase('opening')} />;
  if (phase === 'opening') return <MontenegroOpening onSit={() => setPhase('game')} />;
  if (phase === 'transition') return <ChipToCoin onDone={goOnFromMontenegro} />;
  if (phase === 'found') {
    return (
      <ExitSequence
        hero={<FoundHero />}
        evidenceNumber={EVIDENCE_NUMBER[STOP] ?? 0}
        cardId="firstBook"
        cardTitle={t('card')}
        continueLabel={t('common:nextDestination')}
        accent="var(--montenegro-red)"
        onContinue={() => setPhase('transition')}
      />
    );
  }
  return <PokerTable onFound={found} onEject={found} />;
}
