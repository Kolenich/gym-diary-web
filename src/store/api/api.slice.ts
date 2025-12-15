import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { groupBy } from 'utils/group-by';

import { DEFAULT_API_TIMEOUT } from './api.constants';
import {
  type IExercise,
  type ISet,
  type IWorkout,
  type TGetExercisesParams,
  type TGetSetsParams,
  type TGetWorkoutsParams,
} from './api.types';

const workoutsApiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_PREFIX,
    timeout: DEFAULT_API_TIMEOUT,
  }),
  endpoints: builder => ({
    getWorkouts: builder.query<Record<IWorkout['id'], IWorkout>, TGetWorkoutsParams>({
      query: workoutParams => ({
        params: workoutParams,
        url: 'workouts',
      }),
      transformResponse: (workouts: IWorkout[]): Record<IWorkout['id'], IWorkout> => groupBy(workouts, 'id'),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data: workouts } = await queryFulfilled;

        dispatch(
          upsertQueryEntries(
            Object.values(workouts).map(workout => ({
              endpointName: 'getWorkout',
              arg: workout.id,
              value: workout,
            })),
          ),
        );
      },
    }),
    getWorkout: builder.query<IWorkout, IWorkout['id']>({
      query: workoutId => `workouts/${workoutId}`,
    }),
    createWorkout: builder.mutation<IWorkout, Omit<IWorkout, 'id'>>({
      query: workoutBody => ({
        body: workoutBody,
        url: 'workouts',
        method: 'POST',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data: newWorkout } = await queryFulfilled;

        const { id, date } = newWorkout;

        dispatch(
          updateQueryData('getWorkouts', { date }, draftWorkouts => {
            draftWorkouts[id] = newWorkout;
          }),
        );

        dispatch(upsertQueryData('getWorkout', id, newWorkout));
      },
    }),
    updateWorkout: builder.mutation<IWorkout, IWorkout>({
      query: ({ id: workoutId, ...workoutBody }) => ({
        body: workoutBody,
        url: `workouts/${workoutId}`,
        method: 'PUT',
      }),
      onQueryStarted: async (updatedWorkout, { dispatch, queryFulfilled }) => {
        const { id, date } = updatedWorkout;

        const workoutUpdate = dispatch(
          updateQueryData('getWorkout', id, draftWorkout => ({
            ...draftWorkout,
            ...updatedWorkout,
          })),
        );

        const workoutListUpdate = dispatch(
          updateQueryData('getWorkouts', { date }, draftWorkouts => {
            draftWorkouts[id] = updatedWorkout;
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          workoutUpdate.undo();
          workoutListUpdate.undo();
        }
      },
    }),
    deleteWorkout: builder.mutation<void, Pick<IWorkout, 'id' | 'date'>>({
      query: ({ id: workoutId }) => ({
        url: `workouts/${workoutId}`,
        method: 'DELETE',
      }),
      onQueryStarted: async (deletedWorkout, { dispatch, queryFulfilled }) => {
        const { id, date } = deletedWorkout;

        const workoutListUpdate = dispatch(
          updateQueryData('getWorkouts', { date }, draftWorkouts => {
            delete draftWorkouts[id];
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          workoutListUpdate.undo();
        }
      },
    }),
    getExercises: builder.query<Record<IExercise['id'], IExercise>, TGetExercisesParams>({
      query: exerciseParams => ({
        params: exerciseParams,
        url: 'exercises',
      }),
      transformResponse: (exercises: IExercise[]): Record<IExercise['id'], IExercise> => groupBy(exercises, 'id'),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data: exercises } = await queryFulfilled;

        dispatch(
          upsertQueryEntries(
            Object.values(exercises).map(exercise => ({
              endpointName: 'getExercise',
              arg: exercise.id,
              value: exercise,
            })),
          ),
        );
      },
    }),
    getExercise: builder.query<IExercise, IExercise['id']>({
      query: exerciseId => `exercises/${exerciseId}`,
    }),
    createExercise: builder.mutation<IExercise, Omit<IExercise, 'id'>>({
      query: exerciseBody => ({
        body: exerciseBody,
        url: 'exercises',
        method: 'POST',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data: newExercise } = await queryFulfilled;

        const { id, workout_id: workoutId } = newExercise;

        dispatch(
          updateQueryData('getExercises', { workout_id: workoutId }, draftExercises => {
            draftExercises[id] = newExercise;
          }),
        );

        dispatch(upsertQueryData('getExercise', id, newExercise));
      },
    }),
    updateExercise: builder.mutation<IExercise, IExercise>({
      query: ({ id: exerciseId, ...exerciseBody }) => ({
        body: exerciseBody,
        url: `exercises/${exerciseId}`,
        method: 'PUT',
      }),
      onQueryStarted: async (updatedExercise, { dispatch, queryFulfilled }) => {
        const { id, workout_id: workoutId } = updatedExercise;

        const exerciseUpdate = dispatch(
          updateQueryData('getExercise', id, draftExercise => ({
            ...draftExercise,
            ...updatedExercise,
          })),
        );

        const exerciseListUpdate = dispatch(
          updateQueryData('getExercises', { workout_id: workoutId }, draftExercises => {
            draftExercises[id] = updatedExercise;
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          exerciseUpdate.undo();
          exerciseListUpdate.undo();
        }
      },
    }),
    deleteExercise: builder.mutation<void, Pick<IExercise, 'id' | 'workout_id'>>({
      query: ({ id: exerciseId }) => ({
        url: `exercises/${exerciseId}`,
        method: 'DELETE',
      }),
      onQueryStarted: async (deletedExercise, { dispatch, queryFulfilled }) => {
        const { id, workout_id: workoutId } = deletedExercise;

        const exerciseListUpdate = dispatch(
          updateQueryData('getExercises', { workout_id: workoutId }, draftExercises => {
            delete draftExercises[id];
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          exerciseListUpdate.undo();
        }
      },
    }),
    getSets: builder.query<Record<ISet['id'], ISet>, TGetSetsParams>({
      query: setParams => ({
        params: setParams,
        url: 'sets',
      }),
      transformResponse: (sets: ISet[]): Record<ISet['id'], ISet> => groupBy(sets, 'id'),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data: sets } = await queryFulfilled;

        dispatch(
          upsertQueryEntries(
            Object.values(sets).map(set => ({
              endpointName: 'getSet',
              arg: set.id,
              value: set,
            })),
          ),
        );
      },
    }),
    getSet: builder.query<ISet, ISet['id']>({
      query: setId => `sets/${setId}`,
    }),
    createSet: builder.mutation<ISet, Omit<ISet, 'id'>>({
      query: setBody => ({
        body: setBody,
        url: 'sets',
        method: 'POST',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data: newSet } = await queryFulfilled;

        const { id, exercise_id: exerciseId } = newSet;

        dispatch(
          updateQueryData('getSets', { exercise_id: exerciseId }, draftSets => {
            draftSets[id] = newSet;
          }),
        );

        dispatch(upsertQueryData('getSet', newSet.id, newSet));
      },
    }),
    updateSet: builder.mutation<ISet, ISet>({
      query: ({ id: setId, ...setBody }) => ({
        body: setBody,
        url: `sets/${setId}`,
        method: 'PUT',
      }),
      onQueryStarted: async (updatedSet, { dispatch, queryFulfilled }) => {
        const { id, exercise_id: exerciseId } = updatedSet;

        const setUpdate = dispatch(
          updateQueryData('getSet', id, draftSet => ({
            ...draftSet,
            ...updatedSet,
          })),
        );

        const setListUpdate = dispatch(
          updateQueryData('getSets', { exercise_id: exerciseId }, draftSets => {
            draftSets[id] = updatedSet;
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          setUpdate.undo();
          setListUpdate.undo();
        }
      },
    }),
    deleteSet: builder.mutation<void, Pick<ISet, 'id' | 'exercise_id'>>({
      query: ({ id: setId }) => ({
        url: `sets/${setId}`,
        method: 'DELETE',
      }),
      onQueryStarted: async (deletedSet, { dispatch, queryFulfilled }) => {
        const { id, exercise_id: exerciseId } = deletedSet;

        const setListUpdate = dispatch(
          updateQueryData('getSets', { exercise_id: exerciseId }, draftSets => {
            delete draftSets[id];
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          setListUpdate.undo();
        }
      },
    }),
  }),
});

export const {
  util: { updateQueryData, upsertQueryData, upsertQueryEntries },
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
