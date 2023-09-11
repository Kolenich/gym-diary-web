import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { EWeekTypes, INITIAL_STATE } from './week.constants';
import type { IWeekState } from './week.types';
import { getCurrentWeek } from './week.utils';

const weekSlice = createSlice({
  name: 'week',
  initialState: INITIAL_STATE,
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
