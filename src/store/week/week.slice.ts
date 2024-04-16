import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { EWeekTypes } from './week.constants';
import { type IWeekState } from './week.types';
import { getCurrentWeek } from './week.utils';

const weekSlice = createSlice({
  name: 'week',
  initialState: {
    currentWeek: getCurrentWeek([], EWeekTypes.Current),
    workoutDay: null,
  } as IWeekState,
  reducers: {
    setWorkoutDay(state, action: PayloadAction<IWeekState['workoutDay']>) {
      state.workoutDay = action.payload;
    },
    goToPreviousWeek(state) {
      state.currentWeek = getCurrentWeek(state.currentWeek, EWeekTypes.Previous);
    },
    goToCurrentWeek(state) {
      state.currentWeek = getCurrentWeek(state.currentWeek, EWeekTypes.Current);
    },
    goToNextWeek(state) {
      state.currentWeek = getCurrentWeek(state.currentWeek, EWeekTypes.Next);
    },
  },
});

export const { setWorkoutDay, goToPreviousWeek, goToCurrentWeek, goToNextWeek } = weekSlice.actions;

export default weekSlice;
