import { createSelector } from '@reduxjs/toolkit';

import { type TRootState } from '../store.types';

import { type TWorkoutsState } from './workouts.types';

const selectWorkouts = (state: TRootState): TWorkoutsState => state.workouts;

export const selectWorkoutDay = createSelector(selectWorkouts, workouts => workouts.date);
