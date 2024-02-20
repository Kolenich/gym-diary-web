import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';

import { workoutsApiSlice } from 'api/workouts';

import { weekSlice } from './week';

const store = configureStore({
  reducer: {
    [workoutsApiSlice.reducerPath]: workoutsApiSlice.reducer,
    [weekSlice.name]: weekSlice.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(workoutsApiSlice.middleware),
});

setupListeners(store.dispatch);

export default store;
