import { createSelector } from '@reduxjs/toolkit';

import type { TRootState } from '../store.types';

import type { IWeekState } from './week.types';

const selectWeek = (state: TRootState): IWeekState => state.week;

export const selectWorkoutDay = createSelector(selectWeek, (week) => week.workoutDay);
