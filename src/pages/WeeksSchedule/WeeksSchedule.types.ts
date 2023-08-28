import type { Moment } from 'moment';

export interface IWeeks {
  previous: Moment[];
  current: Moment[];
  next: Moment[];
}
