import api from 'lib/api';
import React, { createContext, FC, useCallback, useEffect, useReducer } from 'react';
import initialState from './constants';
import reducer, { Workouts } from './reducer';
import { ContextActions, ContextState } from './types';

export const Context = createContext({} as ContextState & Partial<ContextActions>);

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

  useEffect(() => {
    (async () => {
      await loadWorkouts();
    })();
  }, [loadWorkouts]);

  return (
    <Context.Provider
      value={{
        ...state as ContextState,
        loadWorkouts,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
