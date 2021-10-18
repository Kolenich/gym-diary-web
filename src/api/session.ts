import axios from 'axios';
import { baseURL } from 'lib/utils';

// Request cancel setup
const { CancelToken } = axios;
export const source = CancelToken.source();

const session = axios.create({
  baseURL,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  timeout: 10000,
});

export default session;
