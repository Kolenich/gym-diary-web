import moment from 'moment';

import { TODAY_DATE } from 'constants/datetime';

import { EWeekTypes } from './week.constants';
import type { TWeeks } from './week.types';


export const getWeek = (weeks: TWeeks, type: EWeekTypes): TWeeks => {
  const current = [];
  const previous = [];
  const next = [];

  let today = TODAY_DATE;

  switch (type) {
    case EWeekTypes.Next:
      today = moment(weeks.current[0]).clone().add(7, 'days');
      break;
    case EWeekTypes.Previous:
      today = moment(weeks.current[0]).clone().add(-7, 'days');
      break;
    case EWeekTypes.Current:
      // Fix bug for JS thinking, that Sunday is the first day of week
      if (today.day() === 0) {
        today = today.clone().subtract(1, 'week');
      }
      break;
    default:
      break;
  }

  for (let i = 1; i <= 7; i += 1) {
    const dayOfCurrWeek = today.clone().set('day', i);
    const dayOfPreviousWeek = today.clone().subtract(7, 'days').set('day', i);
    const dayOfNextWeek = today.clone().add(7, 'days').set('day', i);

    current.push(dayOfCurrWeek.toISOString());
    previous.push(dayOfPreviousWeek.toISOString());
    next.push(dayOfNextWeek.toISOString());
  }

  return { current, next, previous };
};
