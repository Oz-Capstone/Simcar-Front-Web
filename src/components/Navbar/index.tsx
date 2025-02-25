import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BiMenu, BiUserCircle, BiX } from 'react-icons/bi';
import { logout } from '../../store/authSlice';
import logo from '../../assets/images/logo.png';
import { RootState } from '../../store/index';

interface NavbarProps {
  onToggleSidebar: () => void;
  showSidebarButton: boolean;
}

const Navbar = ({ onToggleSidebar, showSidebarButton }: NavbarProps) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 현재 경로가 홈 경로인지 확인
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(logout());
    setShowProfileMenu(false);
    setShowMobileMenu(false);
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    // 중고차 지식 테스트는 로그인 없이 이용 가능
    if (path === '/quiz') {
      navigate(path);
      setShowMobileMenu(false);
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: path } });
    } else {
      navigate(path);
    }
    setShowMobileMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 모바일 메뉴가 열렸을 때 스크롤 방지
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showMobileMenu]);

  return (
    <nav className='fixed top-0 left-0 right-0 bg-white shadow-md z-50'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='flex items-center justify-between h-16 md:h-20'>
          {/* 왼쪽: 로고 */}
          <div className='flex items-center'>
            <Link to='/'>
              <img src={logo} alt='Logo' className='h-20 md:h-[150px] w-auto object-contain' />
            </Link>
          </div>

          {/* 모바일 메뉴 버튼 - 모바일에서만 표시 */}
          <div className='md:hidden'>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className='text-gray-600 hover:text-blue-600'
              aria-label='메뉴'
            >
              {showMobileMenu ? <BiX size={24} /> : <BiMenu size={24} />}
            </button>
          </div>

          {/* 데스크탑 메뉴 - 데스크탑에서만 표시 */}
          <div className='hidden md:flex items-center space-x-8'>
            <div className='flex items-center space-x-8 mr-8'>
              <Link
                to='/search'
                className='text-gray-600 hover:text-blue-600 font-medium transition-colors'
              >
                차량검색
              </Link>
              <button
                onClick={() => handleNavigation('/sell')}
                className='text-gray-600 hover:text-blue-600 font-medium transition-colors'
              >
                내차팔기
              </button>
              <Link
                to='/quiz'
                className='text-gray-600 hover:text-blue-600 font-medium transition-colors'
              >
                중고차 지식 테스트
              </Link>
            </div>

            {isAuthenticated ? (
              <div className='relative flex items-center' ref={menuRef}>
                <BiUserCircle size={28} className='text-[#36379C] mr-2' />
                <div
                  className='flex items-center cursor-pointer'
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <span className='text-gray-700'>{user?.name} 님</span>
                </div>
                {showProfileMenu && (
                  <div className='absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'>
                    <div className='py-1'>
                      <Link
                        to='/mypage'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                        onClick={() => setShowProfileMenu(false)}
                      >
                        마이페이지
                      </Link>
                      <button
                        onClick={handleLogout}
                        className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to='/login'
                className='bg-[#36379C] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#2F2F8C] transition-colors'
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {showMobileMenu && (
        <div className='fixed inset-0 z-40 bg-white mt-16'>
          <div className='p-5 space-y-4'>
            {isAuthenticated && (
              <div className='flex items-center py-3 mb-2 border-b border-gray-200'>
                <BiUserCircle size={28} className='text-[#36379C] mr-2' />
                <span className='text-gray-700 font-medium'>{user?.name} 님</span>
              </div>
            )}

            {showSidebarButton && isHomePage && (
              <button
                onClick={() => {
                  onToggleSidebar();
                  setShowMobileMenu(false);
                }}
                className='block w-full text-left py-3 text-lg text-gray-700 hover:text-blue-600 font-medium border-b border-gray-200'
              >
                필터
              </button>
            )}

            <Link
              to='/search'
              className='block py-3 text-lg text-gray-700 hover:text-blue-600 font-medium border-b border-gray-200'
              onClick={() => setShowMobileMenu(false)}
            >
              차량검색
            </Link>

            <button
              onClick={() => handleNavigation('/sell')}
              className='block w-full text-left py-3 text-lg text-gray-700 hover:text-blue-600 font-medium border-b border-gray-200'
            >
              내차팔기
            </button>

            <Link
              to='/quiz'
              className='block py-3 text-lg text-gray-700 hover:text-blue-600 font-medium border-b border-gray-200'
              onClick={() => setShowMobileMenu(false)}
            >
              중고차 지식 테스트
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to='/mypage'
                  className='block py-3 text-lg text-gray-700 hover:text-blue-600 font-medium border-b border-gray-200'
                  onClick={() => setShowMobileMenu(false)}
                >
                  마이페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className='block w-full text-left py-3 text-lg text-red-600 hover:text-red-800 font-medium border-b border-gray-200'
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className='block py-3 text-lg text-gray-700 hover:text-blue-600 font-medium border-b border-gray-200'
                  onClick={() => setShowMobileMenu(false)}
                >
                  로그인
                </Link>
                <Link
                  to='/signup'
                  className='block py-3 text-lg text-gray-700 hover:text-blue-600 font-medium border-b border-gray-200'
                  onClick={() => setShowMobileMenu(false)}
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
