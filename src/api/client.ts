import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

apiClient.interceptors.response.use(
  (response) => {
    const csrf = response.headers['x-csrf-token'];
    if (csrf) axios.defaults.headers.common['X-CSRFToken'] = csrf;
    return response;
  },
  async (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const { status, config } = error.response;

      if (status === 401 && config.url?.endsWith('/auth/user/')) {
        return Promise.resolve({
          ...error.response,
          data: null,
          status: 200,
        });
      }
      if (status === 401) {
        console.error('Unauthorized (401)');
      } else if (status === 403) {
        console.error('Forbidden (403)');
      } else if (status === 429) {
        console.error('Rate limited (429)');
      } else if (status >= 500) {
        console.error('Server error:', error.response.data);
      }
    } else {
      console.error('Network or unexpected error', error);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
