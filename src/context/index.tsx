import { useMediaQuery, useTheme } from '@mui/material';
import { useAPI } from 'api';
import { Moment } from 'moment';
import React, { createContext, FC, useCallback, useReducer } from 'react';
import initialState from './initialState';
import reducer, { Workouts } from './reducer';
import { ContextState, ContextValue } from './types';

export const Context = createContext({} as ContextValue);

const ContextProvider: FC = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const api = useAPI();

  const [state, dispatch] = useReducer(reducer, initialState as never);

  /**
   * Base action for loading workouts
   * @type {() => Promise<void>}
   */
  const loadWorkouts = useCallback(async () => {
    const response = await api.get('workouts-api/workouts/');

    dispatch({
      type: Workouts.LOAD,
      payload: response.data,
    });
  }, [api]);

  /**
   * Action for deleting workout
   * @type {(id: number) => Promise<void>}
   */
  const deleteWorkout = useCallback(async (id: number) => {
    await api.delete(`/workouts-api/workouts/${id}/`);

    dispatch({
      type: Workouts.DELETE,
      payload: id,
    });
  }, [api]);

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
        isMobile,
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
