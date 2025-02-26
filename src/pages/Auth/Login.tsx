import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BiEnvelope, BiLockAlt, BiShow, BiHide } from 'react-icons/bi';
import { setUser } from '../../store/authSlice';
import logo from '../../assets/images/logo.png';

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Login attempt with:', email);

    // 직접 fetch를 사용하여 로그인 요청
    try {
      // 로그인 전송
      const loginResponse = await fetch('https://simcar.kro.kr/api/members/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include',
      });

      console.log('Login status:', loginResponse.status);

      if (!loginResponse.ok) {
        throw new Error(`Login failed with status: ${loginResponse.status}`);
      }

      let token = '';
      // 응답 헤더에서 Authorization 토큰 확인
      const authHeader = loginResponse.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }

      // 응답 본문 확인
      let responseText = '';
      try {
        responseText = await loginResponse.text();
        console.log('Response body:', responseText);

        if (responseText && responseText.trim()) {
          try {
            const data = JSON.parse(responseText);
            if (data.token) {
              token = data.token;
            }
          } catch (e) {
            console.error('Failed to parse JSON:', e);
          }
        }
      } catch (e) {
        console.error('Failed to read response text:', e);
      }

      // 토큰 저장
      if (token) {
        localStorage.setItem('token', token);
        console.log('Token saved:', token);
      }

      // 프로필 정보 가져오기
      try {
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const profileResponse = await fetch('https://simcar.kro.kr/api/members/profile', {
          method: 'GET',
          headers,
          credentials: 'include',
        });

        if (!profileResponse.ok) {
          throw new Error(`Profile request failed: ${profileResponse.status}`);
        }

        const profileData = await profileResponse.json();
        console.log('Profile data:', profileData);

        localStorage.setItem('user', JSON.stringify(profileData));
        dispatch(setUser(profileData));
        navigate(from, { replace: true });
      } catch (profileError) {
        console.error('Profile error:', profileError);

        // 프로필 획득 실패시에도 로그인은 성공으로 처리
        const defaultUser = { email, name: email.split('@')[0] };
        localStorage.setItem('user', JSON.stringify(defaultUser));
        dispatch(setUser(defaultUser));
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
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
            <form onSubmit={handleLogin} className='space-y-6'>
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
                disabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인'}
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
