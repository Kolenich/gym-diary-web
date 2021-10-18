import React, { createContext, FC, useCallback, useContext } from 'react';
import session from './session';
import { APIContextActions } from './types';

export const APIContext = createContext({} as APIContextActions);

export const useAPI = () => useContext(APIContext);

const APIProvider: FC = ({ children }) => {
  const get = useCallback(<T, >(url: string, params?: unknown) => (
    session.get<T>(url, { params })
  ), []);

  const post = useCallback(<T, >(url: string, data: unknown, headers?: Record<string, string>) => (
    session.post<T>(url, data, { headers })
  ), []);

  const put = useCallback(<T, >(url: string, data: unknown, headers?: Record<string, string>) => (
    session.put<T>(url, data, { headers })
  ), []);

  const patch = useCallback(<T, >(url: string, data: unknown, headers?: Record<string, string>) => (
    session.patch<T>(url, data, { headers })
  ), []);

  const doDelete = useCallback((url: string, headers?: Record<string, string>) => (
    session.delete(url, { headers })
  ), []);

  return (
    <APIContext.Provider value={{ get, post, put, patch, doDelete }}>
      {children}
    </APIContext.Provider>
  );
};

export default APIProvider;
