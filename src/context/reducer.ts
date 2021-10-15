import initialState from './constants';
import { Workout } from './types';

export enum Workouts {
  LOAD = 'LOAD_WORKOUTS',
  EDIT = 'EDIT_WORKOUT',
  ADD = 'ADD_WORKOUT',
  SELECT = 'SELECT_WORKOUT',
  UPDATE = 'UPDATE_WORKOUT',
}

interface ReducerAction {
  type: string;
  payload: unknown;
}

export default (state = initialState, action: ReducerAction) => {
  switch (action.type) {
    case Workouts.LOAD:
      return { ...state, workouts: action.payload };
    case Workouts.EDIT:
      return { ...state, workoutDay: action.payload };
    case Workouts.ADD:
      return { ...state, workouts: state.workouts.concat(action.payload as Workout) };
    case Workouts.SELECT:
      return { ...state, selectedWorkout: action.payload };
    case Workouts.UPDATE:
      return {
        ...state,
        workouts: state.workouts.map((workout) => {
          if ((action.payload as Workout).id === workout.id) {
            return { ...workout, ...action.payload as Workout };
          }
          return workout;
        }),
      };
    default:
      return state;
  }
};
