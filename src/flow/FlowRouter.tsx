import { ArrivalScreen } from '../screens/Arrival/ArrivalScreen';
import { FinalScreen } from '../screens/Final/FinalScreen';
import { MapScreen } from '../screens/Map/MapScreen';
import { RecruitmentScreen } from '../screens/Recruitment/RecruitmentScreen';
import { useMission } from '../state/store';
import { FortKnoxStop } from '../stops/fortknox/FortKnoxStop';
import { JamaicaStop } from '../stops/jamaica/JamaicaStop';
import { LondonStop } from '../stops/london/LondonStop';
import { MontenegroStop } from '../stops/montenegro/MontenegroStop';
import { ScotlandStop } from '../stops/scotland/ScotlandStop';

export function FlowRouter() {
  const step = useMission((state) => state.step);
  if (step.screen === 'arrival') return <ArrivalScreen />;
  if (step.screen === 'recruitment') return <RecruitmentScreen />;
  if (step.screen === 'map') return <MapScreen />;
  if (step.screen === 'final') return <FinalScreen />;
  if (step.stop === 'london') return <LondonStop />;
  if (step.stop === 'montenegro') return <MontenegroStop />;
  if (step.stop === 'fortknox') return <FortKnoxStop />;
  if (step.stop === 'scotland') return <ScotlandStop />;
  if (step.stop === 'jamaica') return <JamaicaStop />;
  return <MapScreen />;
}
