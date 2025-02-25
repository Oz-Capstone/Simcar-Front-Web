import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiEnvelope, BiLockAlt, BiShow, BiHide, BiUser, BiPhone } from 'react-icons/bi';
import { api } from '../../api/axios';
import logo from '../../assets/images/logo.png';
import { AxiosError } from 'axios';
import { ErrorResponse } from '../../types/auth';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('비밀번호는 8자 이상이며, 영문자와 숫자를 포함해야 합니다.');
      return;
    }

    const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
    const formattedPhone = phone
      .replace(/[^0-9]/g, '')
      .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    if (!phoneRegex.test(formattedPhone)) {
      setError('전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)');
      return;
    }

    try {
      const response = await api.post('/members/join', {
        email,
        password,
        name,
        phone: formattedPhone,
      });

      if (response.status === 200) {
        navigate('/login');
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError('입력하신 정보를 다시 확인해주세요.');
      } else {
        setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
      console.error('Signup error:', error);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 11) {
      let formattedValue = value;
      if (value.length >= 3 && value.length <= 7) {
        formattedValue = value.replace(/(\d{3})(\d{1,4})/, '$1-$2');
      } else if (value.length >= 8) {
        formattedValue = value.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
      }
      setPhone(formattedValue);
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
            <h1 className='text-3xl font-bold text-gray-900 mb-10 text-center'>회원가입</h1>
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
                  placeholder='비밀번호를 입력해주세요 (8자 이상, 영문자+숫자)'
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
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                  <BiLockAlt className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='비밀번호를 다시 입력해주세요'
                  className='w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#36379C] focus:border-transparent'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                >
                  {showConfirmPassword ? (
                    <BiHide className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  ) : (
                    <BiShow className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  )}
                </button>
              </div>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                  <BiUser className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='이름을 입력해주세요'
                  className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#36379C] focus:border-transparent'
                  required
                />
              </div>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                  <BiPhone className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='tel'
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder='전화번호를 입력해주세요 (010-0000-0000)'
                  className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#36379C] focus:border-transparent'
                  required
                />
              </div>
              <button
                type='submit'
                className='w-full py-4 bg-[#36379C] text-white rounded-lg font-medium hover:bg-[#2F2F8C] transition-colors'
              >
                회원가입
              </button>
            </form>

            <p className='mt-8 text-center text-gray-600'>
              이미 계정이 있으신가요?{' '}
              <Link to='/login' className='text-[#36379C] hover:text-[#2F2F8C] font-medium'>
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
