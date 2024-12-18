import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_PREFIX, DEFAULT_API_TIMEOUT, EApiMethods } from '../api.constants';

import { EWorkoutsApiTags, EWorkoutsEndpoints, LIST_TAG_ID } from './workouts.constants';
import { type IWorkout, type TGetWorkoutsParams } from './workouts.types';

const workoutsApiSlice = createApi({
  reducerPath: 'workoutsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_PREFIX}/${EWorkoutsEndpoints.WorkoutsApi}`,
    timeout: DEFAULT_API_TIMEOUT,
  }),
  tagTypes: [EWorkoutsApiTags.Workouts, EWorkoutsApiTags.Exercises, EWorkoutsApiTags.Sets],
  endpoints: builder => ({
    getWorkouts: builder.query<IWorkout[], TGetWorkoutsParams<'date', 'gte' | 'lte'>>({
      query: params => ({
        url: 'workouts',
        params,
      }),
      providesTags: result =>
        result
          ? [
              { type: EWorkoutsApiTags.Workouts, id: LIST_TAG_ID },
              ...result.map(({ id }) => ({ type: EWorkoutsApiTags.Workouts, id })),
            ]
          : [],
    }),
    getWorkout: builder.query<IWorkout, IWorkout['id']>({
      query: workoutId => `workouts/${workoutId}`,
      providesTags: (_result, _error, arg) => [{ type: EWorkoutsApiTags.Workouts, id: arg }],
    }),
    createWorkout: builder.mutation<IWorkout, IWorkout>({
      query: workout => ({
        url: 'workouts',
        method: EApiMethods.Post,
        body: workout,
      }),
      invalidatesTags: [{ type: EWorkoutsApiTags.Workouts, id: LIST_TAG_ID }],
    }),
    updateWorkout: builder.mutation<IWorkout, Partial<IWorkout> & Pick<IWorkout, 'id'>>({
      query: workout => ({
        url: `workouts/${workout.id}`,
        method: EApiMethods.Put,
        body: workout,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: EWorkoutsApiTags.Workouts, id }],
    }),
    deleteWorkout: builder.mutation<void, IWorkout['id']>({
      query: workoutId => ({
        url: `workouts/${workoutId}`,
        method: EApiMethods.Delete,
      }),
      invalidatesTags: (_result, _error, arg) => [
        {
          type: EWorkoutsApiTags.Workouts,
          id: arg,
        },
      ],
    }),
  }),
});

export const {
  useGetWorkoutsQuery: useGetWorkouts,
  useGetWorkoutQuery: useGetWorkout,
  useCreateWorkoutMutation: useCreateWorkout,
  useUpdateWorkoutMutation: useUpdateWorkout,
  useDeleteWorkoutMutation: useDeleteWorkout,
} = workoutsApiSlice;

export default workoutsApiSlice;
