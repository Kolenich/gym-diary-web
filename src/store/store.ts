import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';

import { workoutsApiSlice } from 'api/workouts';

import { weekSlice } from './week';

const store = configureStore({
  reducer: {
    [workoutsApiSlice.reducerPath]: workoutsApiSlice.reducer,
    week: weekSlice,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    workoutsApiSlice.middleware,
  ],
});

setupListeners(store.dispatch);

export default store;
