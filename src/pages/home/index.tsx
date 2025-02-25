import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BiStar, BiHeart } from 'react-icons/bi';
import { RootState } from '../../store';
import { getFavorites, addFavorite, removeFavorite } from '../../api/carApi';
import { CarListResponse } from '../../types/car';
import hundai from '../../assets/images/hundai.png';
import kia from '../../assets/images/kia.png';
import bmw from '../../assets/images/bmw.png';

interface DefaultCar {
  id: number;
  name: string;
  year: number;
  mileage: string;
  price: string;
  rating: number;
  image: string;
  likes: number;
}

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [favorites, setFavorites] = useState<CarListResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const features = [
    {
      id: 1,
      title: '품질 보증',
      description: '전문가의 철저한 검수를 거친 차량만을 판매합니다',
      icon: '🛡️',
    },
    {
      id: 2,
      title: '합리적인 가격',
      description: '투명한 가격 정책으로 최선의 가격을 제시합니다',
      icon: '💰',
    },
    {
      id: 3,
      title: '안전한 거래',
      description: '전문 상담사가 구매부터 사후관리까지 도와드립니다',
      icon: '🤝',
    },
  ];

  const defaultCars: DefaultCar[] = [
    {
      id: 1,
      name: '현대 그랜저',
      year: 2022,
      mileage: '20,000km',
      price: '35,000,000원',
      rating: 4.8,
      image: hundai,
      likes: 128,
    },
    {
      id: 2,
      name: '기아 K8',
      year: 2023,
      mileage: '5,000km',
      price: '40,000,000원',
      rating: 4.9,
      image: kia,
      likes: 156,
    },
    {
      id: 3,
      name: 'BMW 520d',
      year: 2021,
      mileage: '30,000km',
      price: '55,000,000원',
      rating: 4.7,
      image: bmw,
      likes: 98,
    },
  ];

  useEffect(() => {
    // 사용자가 로그인한 경우 찜한 차량 목록 가져오기
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await getFavorites();
      setFavorites(response);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async (carId: number) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    try {
      // Check if the car is already in favorites
      const isAlreadyFavorite = favorites.some((car) => car.id === carId);

      if (isAlreadyFavorite) {
        await removeFavorite(carId);
        setFavorites((prev) => prev.filter((car) => car.id !== carId));
      } else {
        await addFavorite(carId);
        // Need to refresh favorites to see the updated list
        fetchFavorites();
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleViewAllFavorites = () => {
    navigate('/mypage', { state: { activeTab: 'myFavorites' } });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/search');
    }
  };

  const formatPrice = (price: number | string): string => {
    if (typeof price === 'string') {
      return price;
    }
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  // Define renderDefaultCar and renderFavoriteCar functions for better typing
  const renderDefaultCar = (car: DefaultCar) => (
    <div
      key={car.id}
      className='bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow'
      style={{ cursor: 'default' }}
    >
      <div className='relative'>
        <img src={car.image} alt={car.name} className='w-full h-48 object-cover' />
        <button
          className='absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors'
          onClick={(e) => {
            e.stopPropagation();
            navigate('/login', { state: { from: '/' } });
          }}
        >
          <BiHeart className='w-5 h-5 text-red-500' />
        </button>
      </div>
      <div className='p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-xl font-bold'>{car.name}</h3>
          <div className='flex items-center text-yellow-400'>
            <BiStar className='w-5 h-5' />
            <span className='ml-1 text-gray-700'>{car.rating}</span>
          </div>
        </div>
        <div className='flex items-center text-gray-600 mb-4'>
          <span>{car.year}</span>
          <span className='mx-2'>·</span>
          <span>{car.mileage}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-xl font-bold text-blue-600'>{car.price}</span>
          <span className='text-sm text-gray-500'>좋아요 {car.likes}</span>
        </div>
      </div>
    </div>
  );

  const renderFavoriteCar = (car: CarListResponse) => (
    <div
      key={car.id}
      className='bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow'
      onClick={() => navigate(`/cars/${car.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className='relative'>
        <img
          src={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          className='w-full h-48 object-cover'
        />
        <button
          className='absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors'
          onClick={(e) => {
            e.stopPropagation();
            handleFavoriteToggle(car.id);
          }}
        >
          <BiHeart className='w-5 h-5 text-red-500 fill-red-500' />
        </button>
      </div>
      <div className='p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-xl font-bold'>
            {car.brand} {car.model}
          </h3>
          <div className='flex items-center text-yellow-400'>
            <BiStar className='w-5 h-5' />
            <span className='ml-1 text-gray-700'>4.7</span>
          </div>
        </div>
        <div className='flex items-center text-gray-600 mb-4'>
          <span>{car.year}년식</span>
          <span className='mx-2'>·</span>
          <span>
            {car.mileage
              ? typeof car.mileage === 'number'
                ? car.mileage.toLocaleString()
                : car.mileage
              : 0}
            km
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-xl font-bold text-blue-600'>{formatPrice(car.price)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className='space-y-16'>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-white'>
        <div className='max-w-2xl space-y-6'>
          <h1 className='text-5xl font-bold leading-tight'>믿을 수 있는 중고차 거래</h1>
          <p className='text-xl text-blue-100'>전문가의 검수를 거친 인증 중고차를 만나보세요</p>
          <form onSubmit={handleSearch} className='flex space-x-4'>
            <input
              type='text'
              placeholder='원하시는 차종을 검색하세요'
              className='flex-1 px-6 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type='submit'
              className='px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors'
            >
              검색
            </button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {features.map((feature) => (
          <div
            key={feature.id}
            className='bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow'
          >
            <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl'>
              {feature.icon}
            </div>
            <h3 className='text-lg font-bold mb-2'>{feature.title}</h3>
            <p className='text-gray-600'>{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Car Grid */}
      <section>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-2xl font-bold'>
            {isAuthenticated && favorites.length > 0 ? `${user?.name}님이 찜한 차량` : '추천 매물'}
          </h2>
          <button
            onClick={
              isAuthenticated && favorites.length > 0
                ? handleViewAllFavorites
                : () => navigate('/search')
            }
            className='text-blue-600 hover:text-blue-800 font-medium'
          >
            전체보기
          </button>
        </div>

        {loading ? (
          <div className='text-center py-12'>
            <p className='text-gray-500'>로딩중...</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {isAuthenticated && favorites.length > 0
              ? favorites.slice(0, 3).map(renderFavoriteCar)
              : defaultCars.map(renderDefaultCar)}
          </div>
        )}

        {isAuthenticated && favorites.length === 0 && !loading && (
          <div className='bg-white rounded-2xl shadow-lg p-12 text-center'>
            <BiHeart className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-xl font-medium mb-4'>찜한 차량이 없습니다</h3>
            <p className='text-gray-500 mb-6'>마음에 드는 차량을 찜해보세요</p>
            <button
              onClick={() => navigate('/search')}
              className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
            >
              차량 검색하기
            </button>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className='bg-gray-100 rounded-3xl p-12 text-center'>
        <h2 className='text-3xl font-bold mb-4'>내 중고차 지식 수준 확인하기</h2>
        <p className='text-gray-600 mb-8 max-w-2xl mx-auto'>
          랜덤으로 나오는 중고차 관련 지식 문제를 풀어보고 당신의 현재 수준을 확인하세요!
        </p>
        <button
          onClick={() => navigate('/quiz')}
          className='bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors'
        >
          테스트 하러 가기
        </button>
      </section>
    </div>
  );
};

export default Home;
