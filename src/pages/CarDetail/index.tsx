import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  BiArrowBack,
  BiHeart,
  BiSolidHeart,
  BiPhone,
  BiChevronLeft,
  BiChevronRight,
  BiEdit,
  BiCheck,
  BiX,
} from 'react-icons/bi';
import {
  getCarDetail,
  getCarDiagnosis,
  addFavorite,
  removeFavorite,
  updateCar,
} from '../../api/carApi';
import type { Car } from '../../types/car';
import type { RootState } from '../../store';

interface EditFormType {
  type: string;
  price: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  carNumber: string;
  insuranceHistory: number;
  inspectionHistory: number;
  color: string;
  transmission: string;
  region: string;
  contactNumber: string;
}

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [diagnosis, setDiagnosis] = useState<{
    reliabilityScore: number;
    evaluationComment: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<EditFormType | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchCarDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const carData = await getCarDetail(parseInt(id));
        setCar(carData);

        // Initialize edit form with current car data
        setEditForm({
          type: carData.type,
          price: carData.price,
          brand: carData.brand,
          model: carData.model,
          year: carData.year,
          mileage: carData.mileage,
          fuelType: carData.fuelType,
          carNumber: carData.carNumber,
          insuranceHistory: carData.insuranceHistory,
          inspectionHistory: carData.inspectionHistory,
          color: carData.color,
          transmission: carData.transmission,
          region: carData.region,
          contactNumber: carData.contactNumber,
        });

        // 찜하기 상태 확인
        const favoriteCars = localStorage.getItem('favoriteCars');
        if (favoriteCars) {
          const favorites = JSON.parse(favoriteCars) as number[];
          setIsFavorite(favorites.includes(parseInt(id)));
        }

        try {
          const diagnosisData = await getCarDiagnosis(parseInt(id));
          setDiagnosis(diagnosisData);
        } catch (diagError) {
          console.log('Diagnosis data not available:', diagError);
        }
      } catch (err) {
        console.error('Failed to fetch car details:', err);
        setError('차량 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetail();
  }, [id]);

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/cars/${id}` } });
      return;
    }

    if (!id) return;

    setFavoriteLoading(true);

    try {
      const carId = parseInt(id);

      if (isFavorite) {
        // 이미 찜한 상태라면 찜하기 취소
        await removeFavorite(carId);
        setIsFavorite(false);

        // 로컬 스토리지에서 제거
        const favoriteCars = localStorage.getItem('favoriteCars');
        if (favoriteCars) {
          const favorites = JSON.parse(favoriteCars) as number[];
          localStorage.setItem(
            'favoriteCars',
            JSON.stringify(favorites.filter((fid) => fid !== carId))
          );
        }

        alert('찜하기가 취소되었습니다.');
      } else {
        // 찜하지 않은 상태라면 찜하기 추가
        await addFavorite(carId);
        setIsFavorite(true);

        // 로컬 스토리지에 저장
        const favoriteCars = localStorage.getItem('favoriteCars');
        if (favoriteCars) {
          const favorites = JSON.parse(favoriteCars) as number[];
          localStorage.setItem('favoriteCars', JSON.stringify([...favorites, carId]));
        } else {
          localStorage.setItem('favoriteCars', JSON.stringify([carId]));
        }

        alert('찜하기가 완료되었습니다.');
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      alert('찜하기 처리에 실패했습니다.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handlePrevImage = () => {
    if (!car?.images.length) return;
    setCurrentImageIndex((prev) => (prev === 0 ? car.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!car?.images.length) return;
    setCurrentImageIndex((prev) => (prev === car.images.length - 1 ? 0 : prev + 1));
  };

  const handleEditSubmit = async () => {
    if (!editForm || !id || !car) return;

    try {
      setUpdateLoading(true);
      await updateCar(parseInt(id), editForm);

      // Refresh car data
      const updatedCar = await getCarDetail(parseInt(id));
      setCar(updatedCar);
      setEditMode(false);
      alert('차량 정보가 수정되었습니다.');
    } catch (err) {
      console.error('Failed to update car:', err);
      alert('차량 정보 수정에 실패했습니다.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const isOwner = car?.sellerName === user?.name;

  const carTypes = ['SUV', '중형', '대형'] as const;
  const brands = ['genesis', 'hyundai', 'kia', 'bmw', 'benz'] as const;
  const fuelTypes = ['가솔린', '디젤', '전기', '하이브리드'] as const;
  const colors = ['검정', '흰색', '회색'] as const;
  const transmissions = ['자동', '수동'] as const;
  const regions = ['Seoul', 'Busan', 'Daegu', 'Incheon'] as const;

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-xl font-medium'>로딩중...</div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-xl font-medium text-red-500'>
          {error || '차량 정보를 찾을 수 없습니다.'}
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      {/* 상단 네비게이션 */}
      <div className='flex items-center justify-between mb-6'>
        <button
          onClick={() => navigate(-1)}
          className='flex items-center text-gray-600 hover:text-gray-900'
        >
          <BiArrowBack className='w-6 h-6 mr-2' />
          뒤로가기
        </button>
        <div className='flex space-x-4'>
          {isOwner && !editMode && (
            <button
              onClick={() => setEditMode(true)}
              className='flex items-center space-x-2 bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700'
            >
              <BiEdit className='w-5 h-5' />
              <span>수정하기</span>
            </button>
          )}
          <button
            onClick={handleFavorite}
            disabled={favoriteLoading}
            className='flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50'
          >
            {favoriteLoading ? (
              <span className='block w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin mr-2'></span>
            ) : isFavorite ? (
              <BiSolidHeart className='w-5 h-5 text-red-500' />
            ) : (
              <BiHeart className='w-5 h-5 text-red-500' />
            )}
            <span>{isFavorite ? '찜하기 취소' : '찜하기'}</span>
          </button>
        </div>
      </div>

      {/* 차량 이미지 */}
      <div className='relative mb-8'>
        <div className='relative aspect-w-16 aspect-h-9'>
          <img
            src={car.images[currentImageIndex]?.filePath}
            alt={`${car.brand} ${car.model}`}
            className='w-full h-[500px] object-cover rounded-lg'
          />
          {car.images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70'
              >
                <BiChevronLeft className='w-6 h-6' />
              </button>
              <button
                onClick={handleNextImage}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70'
              >
                <BiChevronRight className='w-6 h-6' />
              </button>
            </>
          )}
        </div>
        {car.images.length > 1 && (
          <div className='flex justify-center mt-4 space-x-2'>
            {car.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  currentImageIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 차량 기본 정보 */}
      <div className='bg-white p-8 rounded-lg shadow-lg mb-8'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold mb-2'>
            {car.brand} {car.model}
          </h1>
          {editMode ? (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>브랜드</label>
                  <select
                    value={editForm?.brand}
                    onChange={(e) =>
                      setEditForm(editForm ? { ...editForm, brand: e.target.value } : null)
                    }
                    className='w-full p-2 border rounded'
                  >
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>모델</label>
                  <input
                    type='text'
                    value={editForm?.model}
                    onChange={(e) =>
                      setEditForm(editForm ? { ...editForm, model: e.target.value } : null)
                    }
                    className='w-full p-2 border rounded'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>가격</label>
                  <input
                    type='number'
                    value={editForm?.price}
                    onChange={(e) =>
                      setEditForm(
                        editForm ? { ...editForm, price: parseInt(e.target.value) } : null
                      )
                    }
                    className='w-full p-2 border rounded'
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className='text-2xl font-bold text-blue-600'>{formatPrice(car.price)}원</p>
          )}
        </div>

        <div className='grid grid-cols-2 gap-6'>
          <div>
            <h2 className='text-lg font-semibold mb-4'>기본 정보</h2>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>차종</span>
                {editMode ? (
                  <select
                    value={editForm?.type}
                    onChange={(e) =>
                      setEditForm(editForm ? { ...editForm, type: e.target.value } : null)
                    }
                    className='w-48 p-2 border rounded'
                  >
                    {carTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className='font-medium'>{car.type}</span>
                )}
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>연식</span>
                {editMode ? (
                  <input
                    type='number'
                    value={editForm?.year}
                    onChange={(e) =>
                      setEditForm(editForm ? { ...editForm, year: parseInt(e.target.value) } : null)
                    }
                    className='w-48 p-2 border rounded'
                  />
                ) : (
                  <span className='font-medium'>{car.year}년</span>
                )}
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>주행거리</span>
                {editMode ? (
                  <input
                    type='number'
                    value={editForm?.mileage}
                    onChange={(e) =>
                      setEditForm(
                        editForm ? { ...editForm, mileage: parseInt(e.target.value) } : null
                      )
                    }
                    className='w-48 p-2 border rounded'
                  />
                ) : (
                  <span className='font-medium'>{formatPrice(car.mileage)}km</span>
                )}
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>색상</span>
                {editMode ? (
                  <select
                    value={editForm?.color}
                    onChange={(e) =>
                      setEditForm(editForm ? { ...editForm, color: e.target.value } : null)
                    }
                    className='w-48 p-2 border rounded'
                  >
                    {colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className='font-medium'>{car.color}</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className='text-lg font-semibold mb-4'>차량 정보</h2>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>연료</span>
                {editMode ? (
                  <select
                    value={editForm?.fuelType}
                    onChange={(e) =>
                      setEditForm(editForm ? { ...editForm, fuelType: e.target.value } : null)
                    }
                    className='w-48 p-2 border rounded'
                  >
                    {fuelTypes.map((fuelType) => (
                      <option key={fuelType} value={fuelType}>
                        {fuelType}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className='font-medium'>{car.fuelType}</span>
                )}
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>변속기</span>
                {editMode ? (
                  <select
                    value={editForm?.transmission}
                    onChange={(e) =>
                      setEditForm(editForm ? { ...editForm, transmission: e.target.value } : null)
                    }
                    className='w-48 p-2 border rounded'
                  >
                    {transmissions.map((transmission) => (
                      <option key={transmission} value={transmission}>
                        {transmission}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className='font-medium'>{car.transmission}</span>
                )}
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>차량번호</span>
                {editMode ? (
                  <input
                    type='text'
                    value={editForm?.carNumber}
                    onChange={(e) =>
                      setEditForm(editForm ? { ...editForm, carNumber: e.target.value } : null)
                    }
                    className='w-48 p-2 border rounded'
                  />
                ) : (
                  <span className='font-medium'>{car.carNumber}</span>
                )}
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>지역</span>
                {editMode ? (
                  <select
                    value={editForm?.region}
                    onChange={(e) =>
                      setEditForm(editForm ? { ...editForm, region: e.target.value } : null)
                    }
                    className='w-48 p-2 border rounded'
                  >
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className='font-medium'>{car.region}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {editMode && (
          <div className='mt-6 flex justify-end space-x-4'>
            <button
              onClick={() => setEditMode(false)}
              className='px-4 py-2 text-gray-600 hover:text-gray-800'
              disabled={updateLoading}
            >
              <BiX className='w-5 h-5 inline-block mr-1' />
              취소
            </button>
            <button
              onClick={handleEditSubmit}
              disabled={updateLoading}
              className='flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
            >
              {updateLoading ? (
                '저장 중...'
              ) : (
                <>
                  <BiCheck className='w-5 h-5 mr-1' />
                  저장하기
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 차량 진단 정보 */}
      {diagnosis && diagnosis.reliabilityScore !== undefined && diagnosis.evaluationComment && (
        <div className='bg-white p-8 rounded-lg shadow-lg mb-8'>
          <h2 className='text-lg font-semibold mb-4'>차량 진단</h2>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>신뢰도 점수</span>
              <span className='text-2xl font-bold text-blue-600'>
                {diagnosis.reliabilityScore}점
              </span>
            </div>
            <div className='space-y-2'>
              <span className='text-gray-600'>진단 평가</span>
              <p className='text-gray-800 whitespace-pre-line'>{diagnosis.evaluationComment}</p>
            </div>
          </div>
        </div>
      )}

      {/* 이력 정보 */}
      <div className='bg-white p-8 rounded-lg shadow-lg mb-8'>
        <h2 className='text-lg font-semibold mb-4'>이력 정보</h2>
        <div className='grid grid-cols-2 gap-6'>
          <div className='flex justify-between'>
            <span className='text-gray-600'>보험 이력</span>
            {editMode ? (
              <input
                type='number'
                value={editForm?.insuranceHistory}
                onChange={(e) =>
                  setEditForm(
                    editForm ? { ...editForm, insuranceHistory: parseInt(e.target.value) } : null
                  )
                }
                className='w-48 p-2 border rounded'
                min='0'
              />
            ) : (
              <span className='font-medium'>{car.insuranceHistory}회</span>
            )}
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>성능 점검 이력</span>
            {editMode ? (
              <input
                type='number'
                value={editForm?.inspectionHistory}
                onChange={(e) =>
                  setEditForm(
                    editForm ? { ...editForm, inspectionHistory: parseInt(e.target.value) } : null
                  )
                }
                className='w-48 p-2 border rounded'
                min='0'
              />
            ) : (
              <span className='font-medium'>{car.inspectionHistory}회</span>
            )}
          </div>
        </div>
      </div>

      {/* 판매자 연락처 */}
      <div className='bg-white p-8 rounded-lg shadow-lg'>
        <h2 className='text-lg font-semibold mb-4'>판매자 정보</h2>
        <div className='flex items-center justify-between'>
          <div>
            <p className='font-medium'>{car.sellerName}</p>
            <p className='text-gray-600'>{car.region}</p>
          </div>
          <div className='space-x-4'>
            {editMode ? (
              <input
                type='tel'
                value={editForm?.contactNumber}
                onChange={(e) =>
                  setEditForm(editForm ? { ...editForm, contactNumber: e.target.value } : null)
                }
                className='p-2 border rounded'
                placeholder='010-0000-0000'
              />
            ) : (
              <a
                href={`tel:${car.contactNumber}`}
                className='flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700'
              >
                <BiPhone className='w-5 h-5' />
                <span>연락하기</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
