import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { TODAY_DATE_UTC_STRING } from 'constants/date';

import { type TWorkoutsState } from './workouts.types';

const INITIAL_STATE: TWorkoutsState = {
  date: TODAY_DATE_UTC_STRING,
};

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState: INITIAL_STATE,
  reducers: {
    setWorkoutDate(state, action: PayloadAction<TWorkoutsState['date']>) {
      state.date = action.payload;
    },
  },
});

export const { setWorkoutDate } = workoutsSlice.actions;

export default workoutsSlice;
