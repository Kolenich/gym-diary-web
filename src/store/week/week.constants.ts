import type { IWeekState } from './week.types';
import { getCurrentWeek } from './week.utils';

export enum EWeekTypes {
  Previous = 'previous',
  Current = 'current',
  Next = 'next',
}

export const INITIAL_STATE: IWeekState = {
  currentWeek: getCurrentWeek([], EWeekTypes.Current),
  workoutDay: null,
};
