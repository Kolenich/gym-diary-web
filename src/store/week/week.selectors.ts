import { createSelector } from '@reduxjs/toolkit';

import moment from 'moment';

import type { TRootState } from '../store.types';

import type { IWeekState } from './week.types';

const selectWeek = (state: TRootState): IWeekState => state.week;

export const selectWorkoutDay = createSelector(selectWeek, (week) => {
  const { workoutDay } = week;

  const isNull = workoutDay === null;

  if (isNull) {
    return workoutDay;
  }

  return moment(workoutDay);
});
