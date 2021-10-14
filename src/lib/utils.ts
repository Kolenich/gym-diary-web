import { AxiosError } from 'axios';
import { SERVER_NOT_AVAILABLE, SERVER_RESPONSES } from './constants';

const getCurrentHost = () => {
  const url = window.location.href;
  const arr = url.split('/');
  return `${arr[0]}//${arr[2]}`;
};

export const baseURL = process.env.NODE_ENV === 'production'
  ? getCurrentHost()
  : 'http://localhost:8000';

export const getErrorMessage = (error: AxiosError<Record<string, string>>) => {
  let message = SERVER_NOT_AVAILABLE;
  if (error.response) {
    message = SERVER_RESPONSES[error.response.status];
    if (error.response.data.detail) {
      message = error.response.data.detail;
    }
    if (error.response.data.non_field_errors) {
      ([message] = error.response.data.non_field_errors);
    }
  }
  return message;
};

export const isAxiosError = (error: unknown): error is AxiosError<Record<string, string>> => (
  (error as AxiosError<Record<string, string>>).isAxiosError
);
