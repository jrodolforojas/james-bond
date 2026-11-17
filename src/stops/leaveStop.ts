import { navigate } from '../flow/navigate';
import { useMission } from '../state/store';
import { nextStop, type StopId } from './catalog';

export function leaveStop(stop: StopId) {
  const { completed, completeStop } = useMission.getState();
  completeStop(stop);
  if (nextStop([...completed, stop])) return navigate({ screen: 'map' });
  navigate({ screen: 'final' });
}
