import { Moment } from 'moment';

export interface ClosestWeeks {
  previous: Moment[];
  current: Moment[];
  next: Moment[];
}
