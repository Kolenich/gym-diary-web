import initialState from './constants';

export enum Workouts {
  LOAD = 'LOAD_WORKOUTS'
}

interface ReducerAction {
  type: string;
  payload: unknown;
}

export default (state = initialState, action: ReducerAction) => {
  switch (action.type) {
    case Workouts.LOAD:
      return { ...state, workouts: action.payload };
    default:
      return state;
  }
};
