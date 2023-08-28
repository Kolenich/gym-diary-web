export const DEFAULT_API_TIMEOUT = 10000;
export const xsrfCookieName = 'csrftoken';
export const xsrfHeaderName = 'X-CSRFToken';

export enum EApiMethods {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
}
