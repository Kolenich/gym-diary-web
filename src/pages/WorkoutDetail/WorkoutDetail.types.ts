import { type IWorkout } from 'api/workouts';

export type TWorkoutWithoutDate = Omit<IWorkout, 'date'> & Partial<Pick<IWorkout, 'date'>>;
