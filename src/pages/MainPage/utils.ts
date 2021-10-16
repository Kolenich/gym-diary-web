import { TODAY } from 'lib/constants';
import { Weeks } from './types';

const getWeek = (weeks: Weeks, type: 'current' | 'next' | 'previous') => {
  const current = [];
  const previous = [];
  const next = [];

  let today = TODAY;

  switch (type) {
    case 'next':
      today = weeks.current[0].clone().add(7, 'days');
      break;
    case 'previous':
      today = weeks.current[0].clone().add(-7, 'days');
      break;
    case 'current':
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

    current.push(dayOfCurrWeek);
    previous.push(dayOfPreviousWeek);
    next.push(dayOfNextWeek);
  }

  return { current, next, previous };
};

export default getWeek;
