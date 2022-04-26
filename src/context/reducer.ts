import initialState from './initialState';

export enum Workouts {
  LOAD = 'LOAD_WORKOUTS',
  SET_DAY = 'SET_WORKOUT_DAY',
  DELETE = 'DELETE_WORKOUT',
}

interface ReducerAction {
  type: Workouts;
  payload: unknown;
}

export default (state = initialState, action: ReducerAction) => {
  switch (action.type) {
    case Workouts.LOAD:
      return { ...state, workouts: action.payload };
    case Workouts.SET_DAY:
      return { ...state, workoutDay: action.payload };
    case Workouts.DELETE:
      return {
        ...state,
        workouts: state.workouts.filter((workout) => workout.id !== action.payload),
      };
    default:
      return state;
  }
};
