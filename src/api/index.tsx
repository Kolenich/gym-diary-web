import React, { createContext, PureComponent, useContext } from 'react';
import session from './session';
import { APIContextActions } from './types';

export const APIContext = createContext({} as APIContextActions);

export const useAPI = () => useContext(APIContext);

class APIProvider extends PureComponent {
  get = <T, >(url: string, params?: unknown) => session.get<T>(url, { params })

  post = <T, >(url: string, data: unknown, headers?: Record<string, string>) => (
    session.post<T>(url, data, { headers })
  )

  put = <T, >(url: string, data: unknown, headers?: Record<string, string>) => (
    session.put<T>(url, data, { headers })
  )

  patch = <T, >(url: string, data: unknown, headers?: Record<string, string>) => (
    session.patch<T>(url, data, { headers })
  )

  delete = (url: string, headers?: Record<string, string>) => session.delete(url, { headers })

  render() {
    const { children } = this.props;

    return (
      <APIContext.Provider
        value={{
          get: this.get,
          post: this.post,
          put: this.put,
          patch: this.patch,
          delete: this.delete,
        }}
      >
        {children}
      </APIContext.Provider>
    );
  }
}

export default APIProvider;
