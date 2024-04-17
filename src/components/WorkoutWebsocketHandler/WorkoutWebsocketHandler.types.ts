import { type EWorkoutActions } from './WorkoutWebsocketHandler.constants';

export interface IWorkoutWebsocketMessage {
  action: EWorkoutActions;
  arg: number;
}
