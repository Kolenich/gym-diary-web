import moment from 'moment';
import { Weeks } from './types';

const getWeek = (weeks: Weeks, type: 'current' | 'next' | 'previous') => {
  const current = [];
  const previous = [];
  const next = [];

  let today = moment();

  switch (type) {
    case 'current':
      break;
    case 'next':
      today = weeks.current[0].clone().add(7, 'days');
      break;
    case 'previous':
      today = weeks.current[0].clone().add(-7, 'days');
      break;
    default:
      break;
  }

  for (let i = 1; i <= 5; i += 1) {
    const dayOfCurrWeek = today.clone().set('day', i);
    const dayOfPreviousWeek = today.clone().add(-7, 'days').set('day', i);
    const dayOfNextWeek = today.clone().add(7, 'days').set('day', i);

    current.push(dayOfCurrWeek);
    previous.push(dayOfPreviousWeek);
    next.push(dayOfNextWeek);
  }

  return { current, next, previous };
};

export default getWeek;
