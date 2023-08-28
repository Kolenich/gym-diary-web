import { createSelector } from '@reduxjs/toolkit';

import moment from 'moment';

import type { TGetWorkoutsParams } from 'api/workouts';
import { DJANGO_DATE_FORMAT } from 'constants/datetime';

import type { TRootState } from '../store.types';

import type { IWeekState } from './week.types';

const selectWeek = (state: TRootState): IWeekState => state.week;

export const selectWorkoutDay = createSelector(selectWeek, week => {
  const { workoutDay } = week;

  const isNull = workoutDay === null;

  if (isNull) {
    return workoutDay;
  }

  return moment(workoutDay);
});

export const selectCurrentWeek = createSelector(selectWeek, week =>
  week.currentWeek.map(dayString => moment(dayString)),
);

export const selectWeekWorkoutsParams = createSelector(
  selectCurrentWeek,
  currentWeek =>
    ({
      date__gte: currentWeek[0].format(DJANGO_DATE_FORMAT),
      date__lte: [...currentWeek].reverse()[0].format(DJANGO_DATE_FORMAT),
    }) as TGetWorkoutsParams,
);
