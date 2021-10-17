import api from 'lib/api';
import { Moment } from 'moment';
import React, { createContext, FC, useCallback, useReducer } from 'react';
import initialState from './constants';
import reducer, { Workouts } from './reducer';
import { ContextState, ContextValue } from './types';

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
   * Action for deleting workout
   * @type {(id: number) => Promise<void>}
   */
  const deleteWorkout = useCallback(async (id: number) => {
    await api.delete(`/workout-api/workouts/${id}/`);

    dispatch({
      type: Workouts.DELETE,
      payload: id,
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

  return (
    <Context.Provider
      value={{
        ...state as ContextState,
        loadWorkouts,
        setCurrentDay,
        deleteWorkout,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
