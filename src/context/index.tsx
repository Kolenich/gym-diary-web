import api from 'lib/api';
import { Moment } from 'moment';
import React, { createContext, FC, useCallback, useReducer } from 'react';
import initialState from './constants';
import reducer, { Workouts } from './reducer';
import { ContextState, ContextValue, Workout } from './types';

export const Context = createContext({} as ContextValue);

const ContextProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState as never);

  /**
   * Base action for loading workouts
   * @type {() => Promise<void>}
   */
  const loadWorkouts = useCallback(async () => {
    const response = await api.get('workout-api/workouts/');

    dispatch({
      type: Workouts.LOAD,
      payload: response.data,
    });
  }, []);

  /**
   * Action for opening edit/create window for workout
   * @type {(day: (moment.Moment | null)) => void}
   */
  const setCurrentDay = useCallback((day: Moment | null) => dispatch({
    type: Workouts.SET_DAY,
    payload: day,
  }), []);

  /**
   * Action for adding newly created workout
   * @type {(workout: Workout) => void}
   */
  const addWorkout = useCallback((workout: Workout) => dispatch({
    type: Workouts.ADD,
    payload: workout,
  }), []);

  /**
   * Action for updating specific workout
   * @type {(workout: Workout) => void}
   */
  const updateWorkout = useCallback((workout: Workout) => dispatch({
    type: Workouts.UPDATE,
    payload: workout,
  }), []);

  return (
    <Context.Provider
      value={{
        ...state as ContextState,
        loadWorkouts,
        setCurrentDay,
        addWorkout,
        updateWorkout,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
