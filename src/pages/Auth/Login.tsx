import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BiEnvelope, BiLockAlt, BiShow, BiHide } from 'react-icons/bi';
import { api } from '../../api/axios';
import { setUser } from '../../store/authSlice';
import logo from '../../assets/images/logo.png';
import { AxiosError } from 'axios';
import { ErrorResponse } from '../../types/auth';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  // 클릭 핸들러를 직접 사용
  const handleLogin = async () => {
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('로그인 시도:', { email, password });

      // API 요청 직접 호출
      const response = await api.post('/members/login', {
        email,
        password,
      });

      console.log('로그인 응답:', response);

      if (response.status === 200) {
        try {
          console.log('프로필 정보 요청 시작');
          const profileResponse = await api.get('/members/profile');
          console.log('프로필 응답:', profileResponse.data);

          if (profileResponse.data) {
            localStorage.setItem('user', JSON.stringify(profileResponse.data));
            dispatch(setUser(profileResponse.data));
            console.log('로그인 성공, 리다이렉트:', from);
            navigate(from, { replace: true });
          }
        } catch (profileErr) {
          console.error('프로필 요청 실패:', profileErr);
          setError('사용자 정보를 가져오는데 실패했습니다.');
        }
      } else {
        setError('로그인에 실패했습니다.');
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      console.error('로그인 에러:', error);

      if (error.response?.status === 401) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 키보드 Enter 이벤트 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 기본 동작 방지
      handleLogin();
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <div className='max-w-5xl w-full flex rounded-3xl overflow-hidden shadow-xl'>
        <div className='hidden lg:flex lg:w-1/2 bg-[#36379C] p-12 flex-col relative'>
          <div className='flex-1 flex items-center justify-center'>
            <Link to='/'>
              <img
                src={logo}
                alt='Logo'
                className='w-[600px] h-auto object-contain mx-auto transform translate-x-[-30px]'
              />
            </Link>
          </div>
        </div>

        <div className='w-full lg:w-1/2 bg-white p-12'>
          <div className='max-w-md mx-auto mt-24'>
            <h1 className='text-3xl font-bold text-gray-900 mb-10 text-center'>로그인</h1>
            {error && <p className='text-red-500 text-center mb-4'>{error}</p>}

            {/* 폼 대신 div 사용 */}
            <div className='space-y-6'>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                  <BiEnvelope className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder='이메일을 입력해주세요'
                  className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#36379C] focus:border-transparent'
                />
              </div>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                  <BiLockAlt className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder='비밀번호를 입력해주세요'
                  className='w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#36379C] focus:border-transparent'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                >
                  {showPassword ? (
                    <BiHide className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  ) : (
                    <BiShow className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  )}
                </button>
              </div>
              <button
                type='button'
                onClick={handleLogin}
                disabled={isLoading}
                className='w-full py-4 bg-[#36379C] text-white rounded-lg font-medium hover:bg-[#2F2F8C] transition-colors disabled:bg-[#5758BB]'
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </div>

            <p className='mt-8 text-center text-gray-600'>
              계정이 없으신가요?{' '}
              <Link to='/signup' className='text-[#36379C] hover:text-[#2F2F8C] font-medium'>
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
