import moment from 'moment';

import { TODAY_DATE } from 'constants/datetime';

import { EWeekTypes } from './week.constants';

export const getCurrentWeek = (currentWeek: string[], type: EWeekTypes): string[] => {
  const current = [];

  let today = TODAY_DATE;

  switch (type) {
    case EWeekTypes.Next:
      today = moment(currentWeek[0]).clone().add(7, 'days');
      break;
    case EWeekTypes.Previous:
      today = moment(currentWeek[0]).clone().add(-7, 'days');
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

    current.push(dayOfCurrWeek.toISOString());
  }

  return current;
};
