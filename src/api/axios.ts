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
    // axios 인스턴스에 withCredentials가 설정되어 있어도 각 요청마다 확인
    config.withCredentials = true;

    // 요청 로깅
    console.log('Request Details:', {
      fullUrl: `${baseURL}${config.url}`,
      method: config.method,
      headers: config.headers,
      cookies: document.cookie, // 현재 쿠키 상태 로깅
      withCredentials: config.withCredentials,
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
      cookies: document.cookie, // 응답 후 쿠키 상태 로깅
    });
    return response;
  },
  (error) => {
    // 에러 로깅
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      cookies: document.cookie, // 에러 시 쿠키 상태 로깅
    });

    // 401 에러 처리 - 로그인 페이지에서는 리다이렉트 방지
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      // 현재 경로가 로그인 페이지가 아닐 때만 리다이렉트
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
