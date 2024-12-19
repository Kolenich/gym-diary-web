import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_PREFIX, DEFAULT_API_TIMEOUT } from '../api.constants';

import { ECommonTagIds, EWorkoutsApiTags, EWorkoutsEndpoints } from './workouts.constants';
import {
  type IExercise,
  type ISet,
  type IWorkout,
  type TGetExercisesParams,
  type TGetSetsParams,
  type TGetWorkoutsParams,
} from './workouts.types';

const workoutsApiSlice = createApi({
  reducerPath: 'workoutsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_PREFIX}/${EWorkoutsEndpoints.WorkoutsApi}`,
    timeout: DEFAULT_API_TIMEOUT,
  }),
  tagTypes: Object.values(EWorkoutsApiTags),
  endpoints: builder => ({
    getWorkouts: builder.query<IWorkout[], TGetWorkoutsParams<'start' | 'end', 'gte' | 'lte'>>({
      query: workoutParams => ({
        params: workoutParams,
        url: 'workouts',
      }),
      providesTags: (result = []) => [
        { type: EWorkoutsApiTags.Workouts, id: ECommonTagIds.List },
        ...result.map(({ id: workoutId }) => ({ type: EWorkoutsApiTags.Workouts, id: workoutId })),
      ],
    }),
    getWorkout: builder.query<IWorkout, IWorkout['id']>({
      query: workoutId => `workouts/${workoutId}`,
      providesTags: (_result, _error, arg) => [{ type: EWorkoutsApiTags.Workouts, id: arg }],
    }),
    createWorkout: builder.mutation<IWorkout, Omit<IWorkout, 'id'>>({
      query: workoutBody => ({
        body: workoutBody,
        url: 'workouts',
        method: 'POST',
      }),
      invalidatesTags: [{ type: EWorkoutsApiTags.Workouts, id: ECommonTagIds.List }],
    }),
    updateWorkout: builder.mutation<IWorkout, Partial<IWorkout> & Required<Pick<IWorkout, 'id'>>>({
      query: ({ id: workoutId, ...workoutBody }) => ({
        body: workoutBody,
        url: `workouts/${workoutId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, { id: workoutId }) => [
        {
          type: EWorkoutsApiTags.Workouts,
          id: workoutId,
        },
      ],
    }),
    deleteWorkout: builder.mutation<void, IWorkout['id']>({
      query: workoutId => ({
        url: `workouts/${workoutId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, arg) => [
        {
          type: EWorkoutsApiTags.Workouts,
          id: arg,
        },
      ],
    }),
    getExercises: builder.query<IExercise[], TGetExercisesParams>({
      query: exerciseParams => ({
        params: exerciseParams,
        url: 'exercises',
      }),
      providesTags: (result = [], _error, { workout_id: workoutId }) => [
        {
          type: EWorkoutsApiTags.WorkoutExercises,
          id: workoutId,
        },
        ...result.map(({ id: exerciseId }) => ({
          type: EWorkoutsApiTags.Exercises,
          id: exerciseId,
        })),
      ],
    }),
    getExercise: builder.query<IExercise, IExercise['id']>({
      query: exerciseId => `exercises/${exerciseId}`,
      providesTags: (_result, _error, arg) => [{ type: EWorkoutsApiTags.Exercises, id: arg }],
    }),
    createExercise: builder.mutation<IExercise, Omit<IExercise, 'id'>>({
      query: exerciseBody => ({
        body: exerciseBody,
        url: 'exercises',
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { workout_id: workoutId }) => [
        { type: EWorkoutsApiTags.WorkoutExercises, id: workoutId },
      ],
    }),
    updateExercise: builder.mutation<IExercise, Partial<IExercise> & Required<Pick<IExercise, 'id'>>>({
      query: ({ id: exerciseId, ...exerciseBody }) => ({
        body: exerciseBody,
        url: `exercises/${exerciseId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, { id: exerciseId }) => [
        {
          type: EWorkoutsApiTags.Exercises,
          id: exerciseId,
        },
      ],
    }),
    deleteExercise: builder.mutation<void, IExercise['id']>({
      query: exerciseId => ({
        url: `exercises/${exerciseId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, arg) => [
        {
          type: EWorkoutsApiTags.Exercises,
          id: arg,
        },
      ],
    }),
    getSets: builder.query<ISet[], TGetSetsParams>({
      query: setParams => ({
        params: setParams,
        url: 'sets',
      }),
      providesTags: (result = [], _error, { exercise_id: exerciseId }) => [
        {
          type: EWorkoutsApiTags.ExerciseSets,
          id: exerciseId,
        },
        ...result.map(({ id: setId }) => ({ type: EWorkoutsApiTags.Sets, id: setId })),
      ],
    }),
    getSet: builder.query<ISet, ISet['id']>({
      query: setId => `sets/${setId}`,
      providesTags: (_result, _error, arg) => [{ type: EWorkoutsApiTags.Sets, id: arg }],
    }),
    createSet: builder.mutation<ISet, Omit<ISet, 'id'>>({
      query: setBody => ({
        body: setBody,
        url: 'sets',
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { exercise_id: exerciseId }) => [
        {
          type: EWorkoutsApiTags.ExerciseSets,
          id: exerciseId,
        },
      ],
    }),
    updateSet: builder.mutation<ISet, Partial<ISet> & Required<Pick<ISet, 'id'>>>({
      query: ({ id: setId, ...setBody }) => ({
        body: setBody,
        url: `sets/${setId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, { id: setId }) => [
        {
          type: EWorkoutsApiTags.Sets,
          id: setId,
        },
      ],
    }),
    deleteSet: builder.mutation<void, ISet['id']>({
      query: setId => ({
        url: `sets/${setId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, arg) => [
        {
          type: EWorkoutsApiTags.Sets,
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
  useGetExercisesQuery: useGetExercises,
  useGetExerciseQuery: useGetExercise,
  useCreateExerciseMutation: useCreateExercise,
  useUpdateExerciseMutation: useUpdateExercise,
  useDeleteExerciseMutation: useDeleteExercise,
  useGetSetsQuery: useGetSets,
  useGetSetQuery: useGetSet,
  useCreateSetMutation: useCreateSet,
  useUpdateSetMutation: useUpdateSet,
  useDeleteSetMutation: useDeleteSet,
} = workoutsApiSlice;

export default workoutsApiSlice;
