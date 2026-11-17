import { ArrivalScreen } from '../screens/Arrival/ArrivalScreen';
import { FinalScreen } from '../screens/Final/FinalScreen';
import { MapScreen } from '../screens/Map/MapScreen';
import { RecruitmentScreen } from '../screens/Recruitment/RecruitmentScreen';
import { useMission } from '../state/store';
import { FortKnoxStop } from '../stops/fortknox/FortKnoxStop';

export function FlowRouter() {
  const step = useMission((state) => state.step);
  if (step.screen === 'arrival') return <ArrivalScreen />;
  if (step.screen === 'recruitment') return <RecruitmentScreen />;
  if (step.screen === 'map') return <MapScreen />;
  if (step.screen === 'final') return <FinalScreen />;
  if (step.stop === 'fortknox') return <FortKnoxStop />;
  return <MapScreen />;
}
