import { getCurrentHost } from 'utils/get-current-host';

export const BASE_URL = process.env.NODE_ENV === 'production'
  ? getCurrentHost()
  : 'http://localhost:8000';
