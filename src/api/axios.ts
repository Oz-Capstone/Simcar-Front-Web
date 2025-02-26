import axios from 'axios';

// 환경에 따라 baseURL 설정
const isProduction = import.meta.env.PROD;
const baseURL = isProduction
  ? 'https://simcar.kro.kr' // /api 제외하고 기본 URL만 설정
  : '/api'; // 개발 환경에서는 프록시 사용

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // 경로 처리: 프로덕션 환경에서는 /api 접두사 추가
    if (isProduction && config.url && !config.url.startsWith('/api')) {
      config.url = `/api${config.url}`;
    }

    // 토큰 추가
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 요청 로깅
    console.log('Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor는 변경 없음
api.interceptors.response.use(
  (response) => {
    // 응답 로깅
    console.log('Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    // 401 에러 처리
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // 에러 로깅
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    return Promise.reject(error);
  }
);

export default api;
