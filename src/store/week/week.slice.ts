import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { EWeekTypes } from './week.constants';
import type { IWeekState } from './week.types';
import { getCurrentWeek } from './week.utils';

const INITIAL_STATE: IWeekState = {
  currentWeek: getCurrentWeek([], EWeekTypes.Current),
  workoutDay: null,
};

const weekSlice = createSlice({
  name: 'week',
  initialState: INITIAL_STATE,
  reducers: {
    setWorkoutDay(state, action: PayloadAction<string | null>) {
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

export default weekSlice.reducer;
