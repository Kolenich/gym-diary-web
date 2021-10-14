import api from 'lib/api';
import React, { createContext, FC, useEffect, useReducer } from 'react';
import initialState from './constants';
import reducer from './reducer';
import { ContextState } from './types';

export const Context = createContext({} as ContextState);

const ContextProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState as never);

  useEffect(() => {
    (async () => {
      const response = await api.get('workout-api/workouts/');

      dispatch({
        type: 'LOAD_WORKOUTS',
        payload: response.data,
      });
    })();
  }, []);

  return (
    <Context.Provider value={state}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
