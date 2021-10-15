import session from './session';

class API {
  get = <T>(url: string, params?: unknown) => session.get<T>(url, { params })

  post = <T>(url: string, data: unknown, headers?: Record<string, string>) => (
    session.post<T>(url, data, { headers })
  )

  put = <T>(url: string, data: unknown, headers?: Record<string, string>) => (
    session.put<T>(url, data, { headers })
  )

  patch = <T>(url: string, data: unknown, headers?: Record<string, string>) => (
    session.patch<T>(url, data, { headers })
  )

  delete = (url: string, headers?: Record<string, string>) => session.delete(url, { headers })
}

export default new API();
