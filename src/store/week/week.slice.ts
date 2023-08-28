import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';


import { DEFAULT_WEEKS, EWeekTypes } from './week.constants';
import type { IWeekState } from './week.types';
import { getWeek } from './week.utils';

const INITIAL_STATE: IWeekState = {
  weeks: getWeek(DEFAULT_WEEKS, EWeekTypes.Current),
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
      state.weeks = getWeek(state.weeks, EWeekTypes.Previous);
    },
    goToCurrentWeek(state) {
      state.weeks = getWeek(state.weeks, EWeekTypes.Current);
    },
    goToNextWeek(state) {
      state.weeks = getWeek(state.weeks, EWeekTypes.Next);
    },
  },
});

export const { setWorkoutDay, goToPreviousWeek, goToCurrentWeek, goToNextWeek } = weekSlice.actions;

export default weekSlice.reducer;
