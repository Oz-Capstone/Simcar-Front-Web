import axios from 'axios';

// 환경에 따라 baseURL 설정
const isProduction = import.meta.env.PROD;
const baseURL = isProduction ? 'https://simcar.kro.kr/api' : '/api';

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // 쿠키 전송 허용
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // 요청 로깅
    console.log('Request Details:', {
      fullUrl: `${baseURL}${config.url}`,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // 응답 로깅
    console.log('Response Success:', {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    // 에러 로깅
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // 401 에러 처리
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      // 로그인 페이지에 있는 경우는 리다이렉트하지 않음
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
