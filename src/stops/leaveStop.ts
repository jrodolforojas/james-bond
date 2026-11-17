import { navigate } from '../flow/navigate';
import { useMission } from '../state/store';
import { nextStop, type StopId } from './catalog';

export function leaveStop(stop: StopId) {
  const { completeStop } = useMission.getState();
  completeStop(stop);
  if (nextStop(useMission.getState().completed)) return navigate({ screen: 'map' });
  navigate({ screen: 'final' });
}
