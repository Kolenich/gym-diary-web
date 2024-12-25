import { type IWorkout } from 'api/workouts';

export interface IWorkoutsState {
  workoutDate: IWorkout['date'];
}
