export {
  default as workoutsApiSlice,
  useGetWorkouts,
  useGetWorkout,
  useDeleteWorkout,
  useCreateWorkout,
  useUpdateWorkout,
} from './workouts.api';
export type { IWorkout, IExercise, ISet, TGetWorkoutsParams } from './workouts.types';
