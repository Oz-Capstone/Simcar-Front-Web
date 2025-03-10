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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/members/login', {
        email,
        password,
      });

      if (response.status === 200) {
        if (response.data?.token) {
          localStorage.setItem('token', response.data.token);
        }

        const profileResponse = await api.get('/members/profile');
        if (profileResponse.data) {
          localStorage.setItem('user', JSON.stringify(profileResponse.data));
          dispatch(setUser(profileResponse.data));
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      if (error.response?.status === 401) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
      console.error('Login error:', error);
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
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                  <BiEnvelope className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='이메일을 입력해주세요'
                  className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#36379C] focus:border-transparent'
                  required
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
                  placeholder='비밀번호를 입력해주세요'
                  className='w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#36379C] focus:border-transparent'
                  required
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
                type='submit'
                className='w-full py-4 bg-[#36379C] text-white rounded-lg font-medium hover:bg-[#2F2F8C] transition-colors'
              >
                로그인
              </button>
            </form>

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
