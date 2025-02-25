import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BiUser,
  BiEnvelope,
  BiPhone,
  BiLockAlt,
  BiShow,
  BiHide,
  BiCar,
  BiTrash,
  BiHeart,
  BiLogOut,
} from 'react-icons/bi';
import { RootState } from '../../store';
import { setUser, logout } from '../../store/authSlice';
import { getMySales, deleteCar, getFavorites, removeFavorite } from '../../api/carApi';
import { CarListResponse } from '../../types/car';
import { UserInfo } from '../../types/auth';
import { api } from '../../api/axios';

interface EditFormType extends UserInfo {
  password?: string;
  confirmPassword?: string;
}

interface LocationState {
  activeTab?: string;
}

const MyPage = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'mySales' | 'myFavorites'>('profile');
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [editForm, setEditForm] = useState<EditFormType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mySales, setMySales] = useState<CarListResponse[]>([]);
  const [myFavorites, setMyFavorites] = useState<CarListResponse[]>([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [salesError, setSalesError] = useState<string | null>(null);
  const [favoritesError, setFavoritesError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const locationState = location.state as LocationState | null;
    if (locationState?.activeTab) {
      setActiveTab(locationState.activeTab as 'profile' | 'mySales' | 'myFavorites');
    }
  }, [location.state]);

  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/members/profile');
      const userData = response.data;
      setUserInfo(userData);
      setEditForm(userData);
      dispatch(setUser(userData));
    } catch (err) {
      setError('회원 정보를 불러오는데 실패했습니다.');
      console.error('Failed to fetch user info:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMySales = async () => {
    try {
      setSalesLoading(true);
      const response = await getMySales();
      setMySales(response);
    } catch (err) {
      setSalesError(err instanceof Error ? err.message : '내 차량 목록을 불러오는데 실패했습니다.');
    } finally {
      setSalesLoading(false);
    }
  };

  const fetchMyFavorites = async () => {
    try {
      setFavoritesLoading(true);
      const response = await getFavorites();
      setMyFavorites(response);
    } catch (err) {
      setFavoritesError(
        err instanceof Error ? err.message : '찜한 차량 목록을 불러오는데 실패했습니다.'
      );
    } finally {
      setFavoritesLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setUserInfo(user);
      setEditForm(user);
      setIsLoading(false);
    } else {
      fetchUserInfo();
    }

    // activeTab에 따라 필요한 데이터만 불러오기
    if (activeTab === 'mySales') {
      fetchMySales();
    } else if (activeTab === 'myFavorites') {
      fetchMyFavorites();
    }
  }, [user, activeTab]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await api.put('/members/profile', {
        password: editForm.password || undefined,
        name: editForm.name,
        phone: editForm.phone,
      });

      await fetchUserInfo();
      setEditMode(false);
      setError(null);
    } catch (err) {
      setError('회원정보 수정에 실패했습니다.');
      console.error('Failed to update user info:', err);
    }
  };

  const handleWithdraw = async () => {
    try {
      setWithdrawLoading(true);
      await api.delete('/members/profile');
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.error('Failed to withdraw membership:', err);
      setError('회원탈퇴에 실패했습니다.');
      setShowWithdrawModal(false);
    } finally {
      setWithdrawLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editForm) return;

    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 11) {
      let formattedValue = value;
      if (value.length >= 3 && value.length <= 7) {
        formattedValue = value.replace(/(\d{3})(\d{1,4})/, '$1-$2');
      } else if (value.length >= 8) {
        formattedValue = value.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
      }
      setEditForm({ ...editForm, phone: formattedValue });
    }
  };

  const handleDeleteClick = (carId: number) => {
    setSelectedCarId(carId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCarId) return;

    try {
      setDeleteLoading(selectedCarId);
      await deleteCar(selectedCarId);
      setMySales((prevSales) => prevSales.filter((car) => car.id !== selectedCarId));
      setShowDeleteModal(false);
      setSelectedCarId(null);
    } catch (err) {
      console.error('Failed to delete car:', err);
      setSalesError('차량 삭제에 실패했습니다.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleRemoveFavorite = async (carId: number) => {
    try {
      await removeFavorite(carId);
      setMyFavorites((prev) => prev.filter((car) => car.id !== carId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  if (isLoading) {
    return <div className='flex justify-center items-center min-h-screen'>로딩중...</div>;
  }

  if (error) {
    return <div className='text-red-500 text-center py-4'>{error}</div>;
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>마이 페이지</h1>
      </div>

      {/* 탭 네비게이션 */}
      <div className='mb-8 border-b border-gray-200'>
        <nav className='flex -mb-px'>
          <button
            onClick={() => setActiveTab('profile')}
            className={`mr-8 py-4 px-1 font-medium ${
              activeTab === 'profile'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            프로필
          </button>
          <button
            onClick={() => {
              setActiveTab('mySales');
              if (mySales.length === 0) fetchMySales();
            }}
            className={`mr-8 py-4 px-1 font-medium ${
              activeTab === 'mySales'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            내 차량
          </button>
          <button
            onClick={() => {
              setActiveTab('myFavorites');
              if (myFavorites.length === 0) fetchMyFavorites();
            }}
            className={`py-4 px-1 font-medium ${
              activeTab === 'myFavorites'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            찜한 차량
          </button>
        </nav>
      </div>

      {/* 프로필 섹션 */}
      {activeTab === 'profile' && (
        <div className='bg-white shadow rounded-lg p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center'>
              <div className='bg-blue-100 rounded-full p-4'>
                <BiUser className='w-12 h-12 text-blue-600' />
              </div>
              <div className='ml-4'>
                <h2 className='text-xl font-semibold text-gray-800'>{userInfo?.name}</h2>
                <p className='text-gray-500'>{userInfo?.email}</p>
              </div>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className='px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800'
            >
              {editMode ? '취소' : '정보 수정'}
            </button>
          </div>

          {!editMode ? (
            <div>
              <div className='space-y-4 mb-8'>
                <div className='flex items-center'>
                  <BiEnvelope className='w-5 h-5 text-gray-400 mr-2' />
                  <span className='text-gray-600'>{userInfo?.email}</span>
                </div>
                <div className='flex items-center'>
                  <BiUser className='w-5 h-5 text-gray-400 mr-2' />
                  <span className='text-gray-600'>{userInfo?.name}</span>
                </div>
                <div className='flex items-center'>
                  <BiPhone className='w-5 h-5 text-gray-400 mr-2' />
                  <span className='text-gray-600'>{userInfo?.phone}</span>
                </div>
              </div>

              <div className='pt-6 border-t border-gray-200'>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className='text-red-600 hover:text-red-800 flex items-center'
                >
                  <BiLogOut className='w-5 h-5 mr-2' />
                  회원탈퇴
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEditSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>이메일</label>
                <div className='flex items-center bg-gray-50 px-3 py-2 rounded-md'>
                  <BiEnvelope className='w-5 h-5 text-gray-400 mr-2' />
                  <input
                    type='email'
                    value={editForm?.email || ''}
                    disabled
                    className='bg-gray-50 block w-full text-gray-500'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>이름</label>
                <div className='flex items-center border rounded-md'>
                  <BiUser className='w-5 h-5 text-gray-400 ml-3' />
                  <input
                    type='text'
                    value={editForm?.name || ''}
                    onChange={(e) =>
                      setEditForm(editForm ? { ...editForm, name: e.target.value } : null)
                    }
                    className='block w-full px-3 py-2 border-0 focus:ring-0'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>전화번호</label>
                <div className='flex items-center border rounded-md'>
                  <BiPhone className='w-5 h-5 text-gray-400 ml-3' />
                  <input
                    type='tel'
                    value={editForm?.phone || ''}
                    onChange={handlePhoneChange}
                    className='block w-full px-3 py-2 border-0 focus:ring-0'
                    placeholder='010-0000-0000'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  새 비밀번호 (선택)
                </label>
                <div className='flex items-center border rounded-md relative'>
                  <BiLockAlt className='w-5 h-5 text-gray-400 ml-3' />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={editForm?.password || ''}
                    onChange={(e) =>
                      setEditForm(editForm ? { ...editForm, password: e.target.value } : null)
                    }
                    className='block w-full px-3 py-2 border-0 focus:ring-0'
                    placeholder='변경을 원하시면 입력해주세요'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3'
                  >
                    {showPassword ? (
                      <BiHide className='w-5 h-5 text-gray-400' />
                    ) : (
                      <BiShow className='w-5 h-5 text-gray-400' />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  새 비밀번호 확인
                </label>
                <div className='flex items-center border rounded-md relative'>
                  <BiLockAlt className='w-5 h-5 text-gray-400 ml-3' />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={editForm?.confirmPassword || ''}
                    onChange={(e) =>
                      setEditForm(
                        editForm ? { ...editForm, confirmPassword: e.target.value } : null
                      )
                    }
                    className='block w-full px-3 py-2 border-0 focus:ring-0'
                    placeholder='비밀번호를 다시 입력해주세요'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3'
                  >
                    {showConfirmPassword ? (
                      <BiHide className='w-5 h-5 text-gray-400' />
                    ) : (
                      <BiShow className='w-5 h-5 text-gray-400' />
                    )}
                  </button>
                </div>
              </div>

              <div className='pt-4'>
                <button
                  type='submit'
                  className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'
                >
                  저장하기
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 내가 등록한 차량 섹션 */}
      {activeTab === 'mySales' && (
        <div className='bg-white shadow rounded-lg p-6'>
          <div className='mb-6'>
            <h2 className='text-lg font-semibold text-gray-800 flex items-center'>
              <BiCar className='w-5 h-5 text-blue-500 mr-2' />
              내가 등록한 차량
            </h2>
          </div>

          {salesLoading ? (
            <div className='text-center py-4'>로딩중...</div>
          ) : salesError ? (
            <div className='text-red-500 text-center py-4'>{salesError}</div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {mySales.map((car) => (
                <div
                  key={car.id}
                  className='bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow'
                >
                  <div className='aspect-w-16 aspect-h-9'>
                    <img
                      src={car.imageUrl}
                      alt={`${car.brand} ${car.model}`}
                      className='w-full h-48 object-cover'
                    />
                  </div>
                  <div className='p-4'>
                    <h3 className='text-lg font-medium text-gray-900'>
                      {car.brand} {car.model}
                    </h3>
                    <div className='mt-1 text-sm text-gray-500'>
                      <span>{car.year}년식</span>
                      <span className='mx-2'>·</span>
                      <span>{car.type}</span>
                    </div>
                    <div className='mt-2 flex items-center justify-between'>
                      <span className='text-lg font-bold text-blue-600'>
                        {formatPrice(car.price)}원
                      </span>
                      <span className='text-sm text-gray-500'>{car.region}</span>
                    </div>
                    <div className='mt-4 space-y-2'>
                      <button
                        onClick={() => navigate(`/cars/${car.id}`)}
                        className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'
                      >
                        상세 정보
                      </button>
                      <button
                        onClick={() => handleDeleteClick(car.id)}
                        disabled={deleteLoading === car.id}
                        className='w-full bg-red-50 text-red-600 py-2 px-4 rounded-md hover:bg-red-100 transition-colors flex items-center justify-center'
                      >
                        {deleteLoading === car.id ? (
                          '삭제 중...'
                        ) : (
                          <>
                            <BiTrash className='w-4 h-4 mr-2' />
                            삭제하기
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!salesLoading && !salesError && mySales.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-gray-500'>등록한 차량이 없습니다.</p>
              <button
                onClick={() => navigate('/sell')}
                className='mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
              >
                차량 등록하기
              </button>
            </div>
          )}
        </div>
      )}

      {/* 찜한 차량 섹션 */}
      {activeTab === 'myFavorites' && (
        <div className='bg-white shadow rounded-lg p-6'>
          <div className='mb-6'>
            <h2 className='text-lg font-semibold text-gray-800 flex items-center'>
              <BiHeart className='w-5 h-5 text-red-500 mr-2' />
              찜한 차량
            </h2>
          </div>

          {favoritesLoading ? (
            <div className='text-center py-4'>로딩중...</div>
          ) : favoritesError ? (
            <div className='text-red-500 text-center py-4'>{favoritesError}</div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {myFavorites.map((car) => (
                <div
                  key={car.id}
                  className='bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow'
                >
                  <div className='aspect-w-16 aspect-h-9 relative'>
                    <img
                      src={car.imageUrl}
                      alt={`${car.brand} ${car.model}`}
                      className='w-full h-48 object-cover'
                    />
                    <button
                      onClick={() => handleRemoveFavorite(car.id)}
                      className='absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100'
                    >
                      <BiHeart className='w-5 h-5 text-red-500 fill-red-500' />
                    </button>
                  </div>
                  <div className='p-4'>
                    <h3 className='text-lg font-medium text-gray-900'>
                      {car.brand} {car.model}
                    </h3>
                    <div className='mt-1 text-sm text-gray-500'>
                      <span>{car.year}년식</span>
                      <span className='mx-2'>·</span>
                      <span>{car.type}</span>
                    </div>
                    <div className='mt-2 flex items-center justify-between'>
                      <span className='text-lg font-bold text-blue-600'>
                        {formatPrice(car.price)}원
                      </span>
                      <span className='text-sm text-gray-500'>{car.region}</span>
                    </div>
                    <button
                      onClick={() => navigate(`/cars/${car.id}`)}
                      className='mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'
                    >
                      상세 정보
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!favoritesLoading && !favoritesError && myFavorites.length === 0 && (
            <div className='text-center py-12'>
              <BiHeart className='w-16 h-16 text-gray-300 mx-auto mb-4' />
              <p className='text-gray-500'>찜한 차량이 없습니다.</p>
              <button
                onClick={() => navigate('/search')}
                className='mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
              >
                차량 검색하기
              </button>
            </div>
          )}
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-96'>
            <h3 className='text-lg font-semibold mb-4'>차량 삭제</h3>
            <p className='text-gray-600 mb-6'>정말로 이 차량을 삭제하시겠습니까?</p>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setShowDeleteModal(false)}
                className='px-4 py-2 text-gray-600 hover:text-gray-800'
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 회원탈퇴 확인 모달 */}
      {showWithdrawModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-96'>
            <h3 className='text-lg font-semibold mb-4'>회원탈퇴</h3>
            <p className='text-gray-600 mb-2'>정말로 탈퇴하시겠습니까?</p>
            <p className='text-gray-500 text-sm mb-6'>
              탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.
            </p>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className='px-4 py-2 text-gray-600 hover:text-gray-800'
              >
                취소
              </button>
              <button
                onClick={handleWithdraw}
                disabled={withdrawLoading}
                className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400'
              >
                {withdrawLoading ? '처리중...' : '탈퇴하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
