import axios from 'axios';

// 환경에 따라 baseURL 설정
const isProduction = import.meta.env.PROD;
// 백엔드 서버 URL을 항상 명시적으로 사용
const baseURL = isProduction
  ? 'https://simcar.kro.kr/api' // 배포 환경 - 전체 URL 사용
  : '/api'; // 개발 환경 - Vite 프록시 사용

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
    // 토큰 추가
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
