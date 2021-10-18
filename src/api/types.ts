import { AxiosPromise } from 'axios';

export interface APIContextActions {
  get: <T>(url: string, params?: unknown) => AxiosPromise<T>;
  post: <T>(url: string, data: unknown, headers?: Record<string, string>) => AxiosPromise<T>;
  put: <T>(url: string, data: unknown, headers?: Record<string, string>) => AxiosPromise<T>;
  patch: <T>(url: string, data: unknown, headers?: Record<string, string>) => AxiosPromise<T>;
  doDelete: (url: string, headers?: Record<string, string>) => AxiosPromise;
}
