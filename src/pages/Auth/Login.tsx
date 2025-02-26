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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Form submitted');

    try {
      const response = await fetch('https://simcar.kro.kr/api/members/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }

      // 응답 내용 텍스트로 먼저 확인
      const responseText = await response.text();
      console.log('Response text:', responseText);

      // 텍스트가 비어있지 않은 경우에만 JSON 파싱 시도
      let data;
      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
          console.log('Login response data:', data);
        } catch (parseError) {
          console.error('JSON parsing error:', parseError);
          throw new Error('서버 응답을 처리할 수 없습니다');
        }
      } else {
        console.log('Empty response received');
        // 빈 응답이 성공이라고 가정하고 진행
        data = {};
      }

      // 토큰 획득 또는 세션 기반 인증 처리
      if (data?.token) {
        localStorage.setItem('token', data.token);
      } else {
        // 토큰이 없는 경우에도 로그인이 성공했다고 가정
        console.log('No token in response, but login successful');
      }

      // 프로필 정보 가져오기
      try {
        const profileResponse = await fetch('https://simcar.kro.kr/api/members/profile', {
          headers: {
            Authorization: data?.token ? `Bearer ${data.token}` : '',
          },
        });

        if (profileResponse.ok) {
          const profileText = await profileResponse.text();
          if (profileText.trim()) {
            const profileData = JSON.parse(profileText);
            localStorage.setItem('user', JSON.stringify(profileData));
            dispatch(setUser(profileData));
            navigate(from, { replace: true });
          } else {
            throw new Error('프로필 정보가 비어있습니다');
          }
        } else {
          throw new Error(`프로필 요청 실패: ${profileResponse.status}`);
        }
      } catch (profileErr) {
        console.error('Profile fetch error:', profileErr);
        setError('프로필 정보를 가져오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(`로그인에 실패했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
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
