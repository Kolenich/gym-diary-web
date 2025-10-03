import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';

import { workoutsApiSlice } from 'api/workouts';

import { workoutsSlice } from './workouts';

const store = configureStore({
  reducer: {
    [workoutsSlice.name]: workoutsSlice.reducer,
    [workoutsApiSlice.reducerPath]: workoutsApiSlice.reducer,
  },
  middleware: gDM => gDM().concat(workoutsApiSlice.middleware),
});

setupListeners(store.dispatch);

export default store;
