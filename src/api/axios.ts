import axios from 'axios';

// 환경에 따라 baseURL 설정
const isProduction = import.meta.env.PROD;

// 배포 환경에서는 백엔드 서버의 API 경로를 직접 사용
// 개발 환경에서는 vite의 프록시 설정을 사용하기 위해 상대 경로 사용
const baseURL = isProduction
  ? 'https://simcar.kro.kr/api' // 수정: URL에 /api를 포함
  : '/api';

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
    // 이제 모든 요청에 baseURL이 포함되어 있으므로 URL 접두사 추가 로직 제거

    // 토큰 추가
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 요청 로깅
    console.log('Final Request URL:', `${baseURL}${config.url}`);
    console.log('Request Details:', {
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

// Response Interceptor
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
