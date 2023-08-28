import type { ISet } from 'api/workouts';

import type { ESetsActions } from './SetsList.constants';

export interface ISetsProps {
  sets: ISet[];
  onSetChange: (set: ISet, action: ESetsActions) => void;
}
