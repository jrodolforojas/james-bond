import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GadgetIcon } from '../../art/LondonScene';
import { type GadgetId, useMission } from '../../state/store';
import { ExitSequence } from '../ExitSequence';
import { leaveStop } from '../leaveStop';
import { StopTitleCard } from '../StopTitleCard';
import { LondonOpening } from './LondonOpening';
import { QLab } from './QLab';
import { WindowDeparture } from './WindowDeparture';
import './london.css';

type Phase = 'title' | 'opening' | 'lab' | 'closing' | 'departure';

const STOP = 'london';

function AssignedGadget({ gadget }: { gadget: GadgetId }) {
  const { t } = useTranslation('london');
  return (
    <div className="ldn-assigned">
      <p className="eyebrow">{t('assigned')}</p>
      <div className="ldn-assigned__box">
        <GadgetIcon gadget={gadget} color="#e0534a" />
        <div>
          <div className="ldn-assigned__name">{t(`gadgets.${gadget}.name`)}</div>
          <div className="ldn-assigned__perk">
            {t('usefulIn', { place: t(`gadgets.${gadget}.place`) })} · {t(`gadgets.${gadget}.perk`)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LondonStop() {
  const { t } = useTranslation(['london', 'common']);
  const [phase, setPhase] = useState<Phase>('title');
  const gadget = useMission((state) => state.gadget);
  const chooseGadget = useMission((state) => state.chooseGadget);
  const completeStop = useMission((state) => state.completeStop);

  if (phase === 'title') return <StopTitleCard stop={STOP} onDone={() => setPhase('opening')} />;
  if (phase === 'opening') return <LondonOpening onContinue={() => setPhase('lab')} />;
  if (phase === 'departure') return <WindowDeparture onDone={() => leaveStop(STOP)} />;
  if (phase === 'closing' && gadget) {
    return (
      <ExitSequence
        hero={<AssignedGadget gadget={gadget} />}
        cardId="who"
        cardTitle={t('card')}
        continueLabel={t('common:nextDestination')}
        accent="#c9d3de"
        onContinue={() => setPhase('departure')}
      />
    );
  }
  return (
    <QLab
      initial={gadget}
      onSign={(picked) => {
        chooseGadget(picked);
        completeStop(STOP);
        setPhase('closing');
      }}
    />
  );
}
