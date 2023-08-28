import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { INITIAL_STATE } from './week.constants';

const weekSlice = createSlice({
  name: 'week',
  initialState: INITIAL_STATE,
  reducers: {
    setWorkoutDay(state, action: PayloadAction<string | null>) {
      state.workoutDay = action.payload;
    },
  },
});

export const { setWorkoutDay } = weekSlice.actions;

export default weekSlice.reducer;
