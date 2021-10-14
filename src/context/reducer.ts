import initialState from './constants';

interface ReducerAction {
  type: string;
  payload: unknown;
}

export default (state = initialState, action: ReducerAction) => {
  switch (action.type) {
    case 'LOAD_WORKOUTS':
      return { ...state, workouts: action.payload };
    default:
      return state;
  }
};
