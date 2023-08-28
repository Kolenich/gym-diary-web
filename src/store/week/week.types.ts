import type { EWeekTypes } from './week.constants';

export interface IWeekState {
  weeks: TWeeks;
  workoutDay: string | null;
}

export type TWeeks = Record<EWeekTypes, string[]>;

