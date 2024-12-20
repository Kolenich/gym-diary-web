import { type IWorkout } from 'api/workouts';

export type TWorkoutsState = Pick<IWorkout, 'date'>;
