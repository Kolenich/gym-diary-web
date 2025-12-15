import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
    getWorkouts: builder.query<IWorkout[], TGetWorkoutsParams>({
      query: workoutParams => ({
        params: workoutParams,
        url: 'workouts',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data: workouts } = await queryFulfilled;

        dispatch(
          upsertQueryEntries(
            workouts.map(workout => ({
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

        dispatch(
          updateQueryData('getWorkouts', { date: newWorkout.date }, draftWorkouts => draftWorkouts.concat(newWorkout)),
        );

        dispatch(upsertQueryData('getWorkout', newWorkout.id, newWorkout));
      },
    }),
    updateWorkout: builder.mutation<IWorkout, IWorkout>({
      query: ({ id: workoutId, ...workoutBody }) => ({
        body: workoutBody,
        url: `workouts/${workoutId}`,
        method: 'PUT',
      }),
      onQueryStarted: async (updatedWorkout, { dispatch, queryFulfilled }) => {
        const workoutUpdate = dispatch(
          updateQueryData('getWorkout', updatedWorkout.id, draftWorkout => ({
            ...draftWorkout,
            ...updatedWorkout,
          })),
        );

        const workoutListUpdate = dispatch(
          updateQueryData('getWorkouts', { date: updatedWorkout.date }, draftWorkouts =>
            draftWorkouts.map(draftWorkout => {
              const isTargetWorkout = draftWorkout.id === updatedWorkout.id;

              if (isTargetWorkout) {
                return { ...draftWorkout, ...updatedWorkout };
              }

              return draftWorkout;
            }),
          ),
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
        const workoutListUpdate = dispatch(
          updateQueryData('getWorkouts', { date: deletedWorkout.date }, draftWorkouts =>
            draftWorkouts.filter(draftWorkout => draftWorkout.id !== deletedWorkout.id),
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          workoutListUpdate.undo();
        }
      },
    }),
    getExercises: builder.query<IExercise[], TGetExercisesParams>({
      query: exerciseParams => ({
        params: exerciseParams,
        url: 'exercises',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data: exercises } = await queryFulfilled;

        dispatch(
          upsertQueryEntries(
            exercises.map(exercise => ({
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

        dispatch(
          updateQueryData('getExercises', { workout_id: newExercise.workout_id }, draftExercises =>
            draftExercises.concat(newExercise),
          ),
        );

        dispatch(upsertQueryData('getExercise', newExercise.id, newExercise));
      },
    }),
    updateExercise: builder.mutation<IExercise, IExercise>({
      query: ({ id: exerciseId, ...exerciseBody }) => ({
        body: exerciseBody,
        url: `exercises/${exerciseId}`,
        method: 'PUT',
      }),
      onQueryStarted: async (updatedExercise, { dispatch, queryFulfilled }) => {
        const exerciseUpdate = dispatch(
          updateQueryData('getExercise', updatedExercise.id, draftExercise => ({
            ...draftExercise,
            ...updatedExercise,
          })),
        );

        const exerciseListUpdate = dispatch(
          updateQueryData('getExercises', { workout_id: updatedExercise.workout_id }, draftExercises =>
            draftExercises.map(draftExercise => {
              const isTargetExercise = draftExercise.id === updatedExercise.id;

              if (isTargetExercise) {
                return { ...draftExercise, ...updatedExercise };
              }

              return draftExercise;
            }),
          ),
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
        const exerciseListUpdate = dispatch(
          updateQueryData('getExercises', { workout_id: deletedExercise.workout_id }, draftExercises =>
            draftExercises.filter(draftExercise => draftExercise.id !== deletedExercise.id),
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          exerciseListUpdate.undo();
        }
      },
    }),
    getSets: builder.query<ISet[], TGetSetsParams>({
      query: setParams => ({
        params: setParams,
        url: 'sets',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data: sets } = await queryFulfilled;

        dispatch(
          upsertQueryEntries(
            sets.map(set => ({
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

        dispatch(
          updateQueryData('getSets', { exercise_id: newSet.exercise_id }, draftSets => draftSets.concat(newSet)),
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
        const setUpdate = dispatch(
          updateQueryData('getSet', updatedSet.id, draftSet => ({
            ...draftSet,
            ...updatedSet,
          })),
        );

        const setListUpdate = dispatch(
          updateQueryData('getSets', { exercise_id: updatedSet.exercise_id }, draftSets =>
            draftSets.map(draftSet => {
              const isTargetSet = draftSet.id === updatedSet.id;

              if (isTargetSet) {
                return { ...draftSet, ...updatedSet };
              }

              return draftSet;
            }),
          ),
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
        const setListUpdate = dispatch(
          updateQueryData('getSets', { exercise_id: deletedSet.exercise_id }, draftSets =>
            draftSets.filter(draftSet => draftSet.id !== deletedSet.id),
          ),
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
