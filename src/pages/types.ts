import { Moment } from 'moment';

export interface Weeks {
  previous: Moment[];
  current: Moment[];
  next: Moment[];
}
