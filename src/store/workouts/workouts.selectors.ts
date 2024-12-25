import { createSelector } from '@reduxjs/toolkit';

import { type TRootState } from '../store.types';

import { type IWorkoutsState } from './workouts.types';

const selectWorkouts = (state: TRootState): IWorkoutsState => state.workouts;

export const selectWorkoutDay = createSelector(selectWorkouts, workouts => workouts.workoutDate);
