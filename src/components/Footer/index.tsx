import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white mt-16'>
      <div className='max-w-7xl mx-auto px-6 py-8 md:py-12'>
        {/* 모바일용 간소화된 푸터 */}
        <div className='md:hidden'>
          <div className='mb-8 text-center'>
            <h3 className='text-lg font-bold mb-2'>고객센터</h3>
            <p className='text-xl font-bold text-blue-400'>1588-1588</p>
            <p className='text-sm text-gray-400 mt-1'>평일 09:00 - 18:00</p>
          </div>

          <div className='flex justify-center space-x-6 mb-8'>
            <a href='#' className='text-gray-400 hover:text-blue-500 transition-colors'>
              <FaFacebook className='w-6 h-6' />
            </a>
            <a href='#' className='text-gray-400 hover:text-pink-500 transition-colors'>
              <FaInstagram className='w-6 h-6' />
            </a>
            <a href='#' className='text-gray-400 hover:text-yellow-500 transition-colors'>
              <RiKakaoTalkFill className='w-6 h-6' />
            </a>
          </div>

          <div className='grid grid-cols-2 gap-3 mb-8'>
            <Link to='/terms' className='text-sm text-gray-400 hover:text-blue-400'>
              이용약관
            </Link>
            <Link to='/privacy' className='text-sm text-gray-400 hover:text-blue-400'>
              개인정보처리방침
            </Link>
            <Link to='/faq' className='text-sm text-gray-400 hover:text-blue-400'>
              자주 묻는 질문
            </Link>
            <Link to='/guide' className='text-sm text-gray-400 hover:text-blue-400'>
              이용가이드
            </Link>
          </div>

          <div className='text-center text-xs text-gray-500 border-t border-gray-800 pt-6'>
            <p>상호명: 중고차 거래 플랫폼</p>
            <p>대표: 오정선</p>
            <p className='mt-2'>© 2024 중고차 거래 플랫폼.</p>
            <p>All rights reserved.</p>
          </div>
        </div>

        {/* 데스크탑용 푸터 */}
        <div className='hidden md:block'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-10'>
            <div>
              <h3 className='text-lg font-bold mb-4'>고객센터</h3>
              <p className='text-2xl font-bold text-blue-400'>1588-1588</p>
              <p className='text-gray-400 mt-2'>평일 09:00 - 18:00</p>
              <p className='text-gray-400'>주말 및 공휴일 휴무</p>
              <p className='text-gray-400 mt-2'>cs@usedcar.com</p>
            </div>

            <div>
              <h3 className='text-lg font-bold mb-4'>회사소개</h3>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <Link to='/about' className='hover:text-blue-400 transition-colors'>
                    회사소개
                  </Link>
                </li>
                <li>
                  <Link to='/careers' className='hover:text-blue-400 transition-colors'>
                    채용정보
                  </Link>
                </li>
                <li>
                  <Link to='/news' className='hover:text-blue-400 transition-colors'>
                    뉴스룸
                  </Link>
                </li>
                <li>
                  <Link to='/partnership' className='hover:text-blue-400 transition-colors'>
                    제휴문의
                  </Link>
                </li>
                <li>
                  <Link to='/investor' className='hover:text-blue-400 transition-colors'>
                    투자정보
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='text-lg font-bold mb-4'>이용안내</h3>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <Link to='/terms' className='hover:text-blue-400 transition-colors'>
                    이용약관
                  </Link>
                </li>
                <li>
                  <Link to='/privacy' className='hover:text-blue-400 transition-colors'>
                    개인정보처리방침
                  </Link>
                </li>
                <li>
                  <Link to='/faq' className='hover:text-blue-400 transition-colors'>
                    자주 묻는 질문
                  </Link>
                </li>
                <li>
                  <Link to='/guide' className='hover:text-blue-400 transition-colors'>
                    이용가이드
                  </Link>
                </li>
                <li>
                  <Link to='/sitemap' className='hover:text-blue-400 transition-colors'>
                    사이트맵
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='text-lg font-bold mb-4'>소셜 미디어</h3>
              <div className='flex space-x-4'>
                <a href='#' className='text-gray-400 hover:text-blue-500 transition-colors'>
                  <FaFacebook className='w-6 h-6' />
                </a>
                <a href='#' className='text-gray-400 hover:text-pink-500 transition-colors'>
                  <FaInstagram className='w-6 h-6' />
                </a>
                <a href='#' className='text-gray-400 hover:text-yellow-500 transition-colors'>
                  <RiKakaoTalkFill className='w-6 h-6' />
                </a>
              </div>
              <p className='text-gray-400 mt-4'>
                최신 소식과 이벤트 정보를
                <br />
                소셜 미디어에서 만나보세요.
              </p>
            </div>
          </div>

          <div className='border-t border-gray-800 pt-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='text-gray-400 text-sm'>
                <p>상호명: 중고차 거래 플랫폼 | 대표: 오정선</p>
                <p>사업자등록번호: 123-45-67890 | 통신판매업신고: 제2024-서울강남-1234호</p>
                <p>주소: 서울특별시 강남구 테헤란로 231 오성빌딩 4층</p>
              </div>
              <div className='text-gray-400 text-sm md:text-right'>
                <p>© 2024 중고차 거래 플랫폼. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
