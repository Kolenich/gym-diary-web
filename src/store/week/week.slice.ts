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
    goToWeek(state, action: PayloadAction<EWeekTypes>) {
      state.currentWeek = getCurrentWeek(state.currentWeek, action.payload);
    },
  },
});

export const { setWorkoutDay, goToWeek } = weekSlice.actions;

export default weekSlice;
