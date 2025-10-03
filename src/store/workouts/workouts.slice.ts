import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { TODAY } from 'constants/date';
import { toIsoString } from 'utils/iso-to-datetime-local';

import { type IWorkoutsState } from './workouts.types';

const INITIAL_STATE: IWorkoutsState = {
  workoutDate: toIsoString(TODAY).split('T')[0],
};

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState: INITIAL_STATE,
  reducers: {
    setWorkoutDate(state, action: PayloadAction<IWorkoutsState['workoutDate']>) {
      state.workoutDate = action.payload;
    },
  },
});

export const { setWorkoutDate } = workoutsSlice.actions;

export default workoutsSlice;
