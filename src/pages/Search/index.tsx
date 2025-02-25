import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { BiHeart, BiSearch, BiSolidHeart, BiFilter, BiX } from 'react-icons/bi';
import { AppDispatch, RootState } from '../../store';
import { fetchCars } from '../../store/carSlice';
import { addFavorite, removeFavorite } from '../../api/carApi';
import { CarListResponse, CarFilter } from '../../types/car';

const Search = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { cars, loading, error } = useSelector((state: RootState) => state.car);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCars, setFilteredCars] = useState<CarListResponse[]>([]);
  const [favoriteCars, setFavoriteCars] = useState<number[]>([]);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState<number | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // URL에서 필터 파라미터 파싱
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const searchTermParam = query.get('searchTerm') || '';
    const maxPriceParam = query.get('maxPrice');
    const minYearParam = query.get('minYear');
    const maxYearParam = query.get('maxYear');
    const brandsParam = query.get('brands');
    const typesParam = query.get('types');
    const transmissionsParam = query.get('transmissions');
    const fuelTypesParam = query.get('fuelTypes');
    const colorsParam = query.get('colors');

    // 검색창에 검색어 설정
    setSearchTerm(searchTermParam);

    // 필터 객체 생성
    const filter: CarFilter = {};

    if (searchTermParam) filter.searchTerm = searchTermParam;
    if (maxPriceParam) filter.maxPrice = parseInt(maxPriceParam);
    if (minYearParam) filter.minYear = parseInt(minYearParam);
    if (maxYearParam) filter.maxYear = parseInt(maxYearParam);
    if (brandsParam) filter.brands = brandsParam.split(',');
    if (typesParam) filter.types = typesParam.split(',');
    if (transmissionsParam) filter.transmissions = transmissionsParam.split(',');
    if (fuelTypesParam) filter.fuelTypes = fuelTypesParam.split(',');
    if (colorsParam) filter.colors = colorsParam.split(',');

    // 필터가 있으면 API 호출
    void dispatch(fetchCars(Object.keys(filter).length > 0 ? filter : undefined));
  }, [dispatch, location.search]);

  useEffect(() => {
    // 로컬 스토리지에서 찜한 차량 목록 불러오기
    const savedFavorites = localStorage.getItem('favoriteCars');
    if (savedFavorites) {
      setFavoriteCars(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    // 검색어에 따라 차량 필터링 (클라이언트 측 필터링)
    if (searchTerm.trim() === '') {
      setFilteredCars(cars);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = cars.filter((car) => {
      return (
        car.brand.toLowerCase().includes(lowerSearchTerm) ||
        car.model.toLowerCase().includes(lowerSearchTerm) ||
        car.type.toLowerCase().includes(lowerSearchTerm)
      );
    });
    setFilteredCars(filtered);
  }, [searchTerm, cars]);

  // 모바일 필터가 열렸을 때 스크롤 방지
  useEffect(() => {
    if (showMobileFilter) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showMobileFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // 현재 URL에서 파라미터를 가져옵니다
    const currentParams = new URLSearchParams(location.search);

    // 검색어 파라미터 업데이트
    if (searchTerm.trim()) {
      currentParams.set('searchTerm', searchTerm);
    } else {
      currentParams.delete('searchTerm');
    }

    // 업데이트된 파라미터로 검색 페이지로 이동
    navigate(`/search?${currentParams.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFavorite = async (carId: number) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/search${location.search}` } });
      return;
    }

    try {
      setIsLoadingFavorite(carId);

      if (favoriteCars.includes(carId)) {
        // 이미 찜한 차량이면 찜하기 취소
        await removeFavorite(carId);
        setFavoriteCars((prev) => prev.filter((id) => id !== carId));
      } else {
        // 찜하지 않은 차량이면 찜하기 추가
        await addFavorite(carId);
        setFavoriteCars((prev) => [...prev, carId]);
      }

      // 로컬 스토리지에 저장
      localStorage.setItem(
        'favoriteCars',
        JSON.stringify(
          favoriteCars.includes(carId)
            ? favoriteCars.filter((id) => id !== carId)
            : [...favoriteCars, carId]
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to toggle favorite:', error.message);
      }
      alert('찜하기 처리에 실패했습니다.');
    } finally {
      setIsLoadingFavorite(null);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // 현재 활성화된 필터 개수
  const getActiveFiltersCount = () => {
    const query = new URLSearchParams(location.search);
    let count = 0;

    if (query.get('searchTerm')) count++;
    if (query.get('maxPrice')) count++;
    if (query.get('minYear')) count++;
    if (query.get('maxYear')) count++;
    if (query.get('brands')) count++;
    if (query.get('types')) count++;
    if (query.get('transmissions')) count++;
    if (query.get('fuelTypes')) count++;
    if (query.get('colors')) count++;

    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  // 필터 초기화
  const clearAllFilters = () => {
    navigate('/search');
  };

  if (loading) {
    return <div className='flex justify-center items-center min-h-screen'>로딩중...</div>;
  }

  if (error) {
    return <div className='text-red-500 text-center py-4'>{error}</div>;
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
      {/* Search Header */}
      <div className='mb-6 sm:mb-8'>
        <h1 className='text-xl sm:text-2xl font-bold text-gray-900 mb-4'>차량 검색</h1>
        <form onSubmit={handleSearch} className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
          <div className='flex-1 relative'>
            <input
              type='text'
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder='브랜드, 모델, 차종으로 검색하세요'
              className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            <BiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
          </div>
          <div className='flex space-x-2'>
            <button
              type='button'
              onClick={() => setShowMobileFilter(true)}
              className='md:hidden px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center'
            >
              <BiFilter className='mr-1' />
              필터
              {activeFiltersCount > 0 && (
                <span className='ml-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <button
              type='submit'
              className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              검색
            </button>
          </div>
        </form>
      </div>

      {/* 활성화된 필터가 있는 경우 초기화 버튼 */}
      {activeFiltersCount > 0 && (
        <div className='mb-4 flex justify-between items-center'>
          <div className='text-gray-600'>총 {filteredCars.length}대의 차량이 검색되었습니다</div>
          <button
            onClick={clearAllFilters}
            className='text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center'
          >
            <BiX className='mr-1' />
            필터 초기화
          </button>
        </div>
      )}
      {/* 필터가 없는 경우 결과만 표시 */}
      {activeFiltersCount === 0 && (
        <div className='mb-4 text-gray-600'>총 {filteredCars.length}대의 차량이 검색되었습니다</div>
      )}

      {/* Car Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
        {filteredCars.map((car: CarListResponse) => (
          <div
            key={car.id}
            className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
          >
            <div className='relative'>
              <img
                src={car.imageUrl}
                alt={`${car.brand} ${car.model}`}
                className='w-full h-48 object-cover'
              />
              <button
                onClick={() => void handleFavorite(car.id)}
                disabled={isLoadingFavorite === car.id}
                className='absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors'
              >
                {isLoadingFavorite === car.id ? (
                  <span className='block w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin'></span>
                ) : favoriteCars.includes(car.id) ? (
                  <BiSolidHeart className='w-5 h-5 text-red-500' />
                ) : (
                  <BiHeart className='w-5 h-5 text-red-500' />
                )}
              </button>
            </div>
            <div className='p-4'>
              <h3 className='text-lg font-bold text-gray-900'>
                {car.brand} {car.model}
              </h3>
              <div className='mt-1 text-sm text-gray-500'>
                <span>{car.year}년</span>
                <span className='mx-2'>·</span>
                <span>{car.type}</span>
              </div>
              <div className='mt-2 flex items-center justify-between'>
                <span className='text-lg font-bold text-blue-600'>{formatPrice(car.price)}원</span>
                <span className='text-sm text-gray-500'>{car.region}</span>
              </div>
              <button
                onClick={() => navigate(`/cars/${car.id}`)}
                className='mt-4 w-full py-2 bg-gray-100 text-gray-700 rounded font-medium hover:bg-gray-200 transition-colors'
              >
                자세히 보기
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className='text-center py-12 bg-white rounded-lg shadow-sm'>
          <BiSearch className='w-12 h-12 text-gray-300 mx-auto mb-4' />
          <p className='text-gray-500 text-lg mb-2'>검색 결과가 없습니다.</p>
          <p className='text-gray-400 text-sm mb-4'>다른 검색어나 필터 조건을 시도해보세요.</p>
          <button
            onClick={clearAllFilters}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            필터 초기화
          </button>
        </div>
      )}

      {/* 모바일 필터 오버레이 */}
      {showMobileFilter && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
          onClick={() => setShowMobileFilter(false)}
        ></div>
      )}

      {/* 모바일 필터 패널 */}
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          showMobileFilter ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='p-4 h-full flex flex-col'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='text-lg font-bold'>필터</h3>
            <button
              onClick={() => setShowMobileFilter(false)}
              className='text-gray-500 hover:text-gray-700'
            >
              <BiX size={24} />
            </button>
          </div>

          <div className='flex-1 overflow-y-auto'>
            {/* 여기에 필터 옵션들을 추가할 수 있습니다 */}
            <div className='mb-4'>
              <p className='text-sm text-gray-500 mb-2'>
                홈 화면에서 사이드바를 통해 필터를 설정할 수 있습니다.
              </p>
            </div>
          </div>

          <div className='pt-4 border-t border-gray-200'>
            <button
              onClick={clearAllFilters}
              className='w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors mb-2'
            >
              필터 초기화
            </button>
            <button
              onClick={() => {
                setShowMobileFilter(false);
                navigate('/');
              }}
              className='w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors'
            >
              홈으로 이동
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
