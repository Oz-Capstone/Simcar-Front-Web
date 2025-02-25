import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BiImageAdd, BiWon, BiCar, BiMap, BiInfoCircle } from 'react-icons/bi';
import { registerCar } from '../../api/carApi';
import type { CarRegistrationRequest } from '../../api/carApi';
import { RootState } from '../../store';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

interface StepItem {
  title: string;
  icon: JSX.Element;
}

interface CarFormData {
  type: string;
  customType: string;
  price: string;
  brand: string;
  customBrand: string;
  model: string;
  year: string;
  mileage: string;
  fuelType: string;
  customFuelType: string;
  carNumber: string;
  insuranceHistory: string;
  inspectionHistory: string;
  color: string;
  customColor: string;
  transmission: string;
  region: string;
  customRegion: string;
  contactNumber: string;
}

const initialFormData: CarFormData = {
  type: '',
  customType: '',
  price: '',
  brand: '',
  customBrand: '',
  model: '',
  year: new Date().getFullYear().toString(),
  mileage: '',
  fuelType: '',
  customFuelType: '',
  carNumber: '',
  insuranceHistory: '0',
  inspectionHistory: '0',
  color: '',
  customColor: '',
  transmission: '',
  region: '',
  customRegion: '',
  contactNumber: '',
};

const SellCar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/sell' } });
    }
  }, [isAuthenticated, navigate]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState<CarFormData>({
    ...initialFormData,
    contactNumber: '',
  });

  const carTypes = ['SUV', '경차', '소형', '중형', '대형', '승합차', '직접입력'] as const;
  const brands = [
    '현대(Hyundai)',
    '기아(Kia)',
    '제네시스(Genesis)',
    'BMW',
    '벤츠(Benz)',
    '아우디(Audi)',
    '직접입력',
  ] as const;
  const fuelTypes = ['가솔린', '디젤', '전기', '하이브리드', 'LPG', '직접입력'] as const;
  const colors = ['검정', '흰색', '회색', '빨강', '파랑', '직접입력'] as const;
  const transmissions = ['자동', '수동'] as const;
  const regions = [
    '서울',
    '부산',
    '대구',
    '인천',
    '광주',
    '대전',
    '울산',
    '세종',
    '경기',
    '직접입력',
  ] as const;

  const steps: StepItem[] = [
    { title: '차량 이미지', icon: <BiImageAdd className='w-6 h-6' /> },
    { title: '기본 정보', icon: <BiCar className='w-6 h-6' /> },
    { title: '가격 정보', icon: <BiWon className='w-6 h-6' /> },
    { title: '추가 정보', icon: <BiInfoCircle className='w-6 h-6' /> },
    { title: '연락처', icon: <BiMap className='w-6 h-6' /> },
  ];

  const validateField = (value: string): boolean => {
    return value !== undefined && value !== null && value.trim() !== '';
  };

  const validateStep = (step: number): boolean => {
    const validations: { [key: number]: { [key: string]: boolean } } = {
      1: { images: imageFiles.length > 0 },
      2: {
        typeValid: validateField(
          formData.type === '직접입력' ? formData.customType : formData.type
        ),
        brandValid: validateField(
          formData.brand === '직접입력' ? formData.customBrand : formData.brand
        ),
        model: validateField(formData.model),
        year: validateField(formData.year),
      },
      3: {
        price: validateField(formData.price),
        mileage: validateField(formData.mileage),
      },
      4: {
        fuelTypeValid: validateField(
          formData.fuelType === '직접입력' ? formData.customFuelType : formData.fuelType
        ),
        colorValid: validateField(
          formData.color === '직접입력' ? formData.customColor : formData.color
        ),
        transmission: validateField(formData.transmission),
        carNumber: validateField(formData.carNumber),
        insuranceHistory: validateField(formData.insuranceHistory),
        inspectionHistory: validateField(formData.inspectionHistory),
      },
      5: {
        regionValid: validateField(
          formData.region === '직접입력' ? formData.customRegion : formData.region
        ),
        contactNumber: validateField(formData.contactNumber),
      },
    };

    const stepValidations = validations[step];
    return stepValidations ? Object.values(stepValidations).every(Boolean) : true;
  };

  const handleImageUpload = (files: FileList): boolean => {
    const newFiles = Array.from(files);
    const totalFiles = imageFiles.length + newFiles.length;

    if (totalFiles > 5) {
      setError('이미지는 최대 5개까지 업로드할 수 있습니다.');
      return false;
    }

    for (const file of newFiles) {
      if (file.size > 5 * 1024 * 1024) {
        setError('각 이미지의 크기는 5MB를 초과할 수 없습니다.');
        return false;
      }

      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드할 수 있습니다.');
        return false;
      }
    }

    try {
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      setImageFiles((prev) => [...prev, ...newFiles]);
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
      return true;
    } catch (error) {
      console.error('Image handling error:', error);
      setError('이미지 처리에 실패했습니다.');
      return false;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleImageUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files) {
      handleImageUpload(files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'price') {
      const numericValue = value.replace(/[^0-9]/g, '');
      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
      return;
    }

    if (name === 'contactNumber') {
      const numericValue = value.replace(/[^0-9]/g, '');
      let formattedValue = numericValue;
      if (numericValue.length >= 3) {
        formattedValue = numericValue.slice(0, 3) + '-' + numericValue.slice(3);
      }
      if (numericValue.length >= 7) {
        formattedValue = formattedValue.slice(0, 8) + '-' + formattedValue.slice(8);
      }
      // 최대 13자리로 제한 (010-1234-5678 형식)
      if (formattedValue.length <= 13) {
        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getBrandValue = (): string => {
    if (formData.brand === '직접입력') {
      return formData.customBrand;
    }

    // 브랜드 문자열에서 영문 부분만 추출
    const matches = formData.brand.match(/\(([^)]+)\)/);
    if (matches && matches[1]) {
      return matches[1].toLowerCase();
    }

    // 괄호가 없는 경우 그대로 반환 (예: BMW)
    return formData.brand.toLowerCase();
  };

  const getRegionValue = (): string => {
    if (formData.region === '직접입력') {
      return formData.customRegion;
    }

    // API에서 사용하는 지역 이름으로 변환
    const regionMap: { [key: string]: string } = {
      서울: 'Seoul',
      부산: 'Busan',
      대구: 'Daegu',
      인천: 'Incheon',
      광주: 'Gwangju',
      대전: 'Daejeon',
      울산: 'Ulsan',
      세종: 'Sejong',
      경기: 'Gyeonggi',
    };

    return regionMap[formData.region] || formData.region;
  };

  const getTypeValue = (): string => {
    return formData.type === '직접입력' ? formData.customType : formData.type;
  };

  const getFuelTypeValue = (): string => {
    return formData.fuelType === '직접입력' ? formData.customFuelType : formData.fuelType;
  };

  const getColorValue = (): string => {
    return formData.color === '직접입력' ? formData.customColor : formData.color;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep !== steps.length || !validateStep(currentStep)) {
      setError('모든 필수 항목을 입력해주세요.');
      return;
    }

    if (imageFiles.length === 0) {
      setError('최소 1개의 이미지를 업로드해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const carRegistrationData: CarRegistrationRequest = {
        type: getTypeValue(),
        price: parseInt(formData.price.replace(/,/g, ''), 10),
        brand: getBrandValue(),
        model: formData.model,
        year: parseInt(formData.year, 10),
        mileage: parseInt(formData.mileage, 10),
        fuelType: getFuelTypeValue(),
        carNumber: formData.carNumber,
        insuranceHistory: parseInt(formData.insuranceHistory, 10),
        inspectionHistory: parseInt(formData.inspectionHistory, 10),
        color: getColorValue(),
        transmission: formData.transmission,
        region: getRegionValue(),
        contactNumber: formData.contactNumber,
      };

      const result = await registerCar(carRegistrationData, imageFiles);
      console.log('Car registration result:', result);

      navigate('/mypage');
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.status === 401) {
        setError('인증이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login', { state: { from: '/sell' } });
      } else {
        console.error('Car registration error:', axiosError);
        setError(axiosError.response?.data?.message || '차량 등록에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(steps.length, prev + 1));
      setError('');
    } else {
      setError('현재 단계의 모든 필수 항목을 입력해주세요.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    setError('');
  };

  const canProceed = validateStep(currentStep);

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold text-center mb-8'>내 차 판매하기</h1>

        {error && <div className='bg-red-50 text-red-500 p-4 rounded-lg mb-6'>{error}</div>}

        {/* 진행 단계 표시 */}
        <div className='mb-8'>
          <div className='flex justify-between items-center'>
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`flex flex-col items-center flex-1 ${
                  index + 1 === currentStep
                    ? 'text-blue-600'
                    : index + 1 < currentStep
                      ? 'text-green-500'
                      : 'text-gray-400'
                }`}
              >
                <div className='relative w-full'>
                  <div
                    className={`h-1 ${index + 1 <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}
                  />
                  <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center
                    ${
                      index + 1 === currentStep
                        ? 'bg-blue-600 text-white'
                        : index + 1 < currentStep
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.icon}
                  </div>
                </div>
                <span className='mt-2 text-sm'>{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-8'>
          {/* 이미지 업로드 섹션 */}
          <div
            className={`p-8 rounded-lg transition-all duration-300 ${
              currentStep === 1 ? 'block' : 'hidden'
            }`}
          >
            <div
              className='border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors'
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {previewUrls.length > 0 ? (
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                  {previewUrls.map((url, index) => (
                    <div key={url} className='relative'>
                      <img
                        src={url}
                        alt={`Car preview ${index + 1}`}
                        className='w-full h-48 object-cover rounded-lg'
                      />
                      <button
                        type='button'
                        className='absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100'
                        onClick={(e) => {
                          e.stopPropagation();
                          const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
                          const newImageFiles = imageFiles.filter((_, i) => i !== index);
                          setPreviewUrls(newPreviewUrls);
                          setImageFiles(newImageFiles);
                          URL.revokeObjectURL(url);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {previewUrls.length < 5 && (
                    <div
                      className='border-2 border-dashed rounded-lg p-8 flex items-center justify-center cursor-pointer hover:border-blue-500'
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className='text-center'>
                        <BiImageAdd className='w-12 h-12 mx-auto text-gray-400' />
                        <p className='mt-2 text-sm text-gray-500'>추가 이미지 업로드</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className='space-y-4'>
                  <BiImageAdd className='w-16 h-16 mx-auto text-gray-400' />
                  <div>
                    <p className='text-lg font-medium text-gray-700'>
                      차량 이미지를 업로드해주세요
                    </p>
                    <p className='text-sm text-gray-500 mt-2'>
                      클릭하여 이미지를 선택하거나 드래그앤드롭하세요 (최대 5장)
                    </p>
                  </div>
                </div>
              )}
              <input
                type='file'
                ref={fileInputRef}
                className='hidden'
                accept='image/*'
                onChange={handleFileChange}
                multiple
              />
            </div>
          </div>

          {/* 기본 정보 섹션 */}
          <div className={`space-y-6 ${currentStep === 2 ? 'block' : 'hidden'}`}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>차종</label>
                <select
                  name='type'
                  value={formData.type}
                  onChange={handleChange}
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white'
                  required
                >
                  <option value=''>선택해주세요</option>
                  {carTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {formData.type === '직접입력' && (
                  <input
                    type='text'
                    name='customType'
                    value={formData.customType}
                    onChange={handleChange}
                    className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mt-2'
                    placeholder='차종을 입력해주세요'
                    required
                  />
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>브랜드</label>
                <select
                  name='brand'
                  value={formData.brand}
                  onChange={handleChange}
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white'
                  required
                >
                  <option value=''>선택해주세요</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
                {formData.brand === '직접입력' && (
                  <input
                    type='text'
                    name='customBrand'
                    value={formData.customBrand}
                    onChange={handleChange}
                    className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mt-2'
                    placeholder='브랜드를 입력해주세요'
                    required
                  />
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>모델명</label>
                <input
                  type='text'
                  name='model'
                  value={formData.model}
                  onChange={handleChange}
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                  placeholder='예: 그랜저'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>연식</label>
                <input
                  type='number'
                  name='year'
                  value={formData.year}
                  onChange={handleChange}
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                  min='1990'
                  max={new Date().getFullYear()}
                  required
                />
              </div>
            </div>
          </div>

          {/* 가격 정보 섹션 */}
          <div className={`space-y-6 ${currentStep === 3 ? 'block' : 'hidden'}`}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  판매가격 (원)
                </label>
                <input
                  type='text'
                  name='price'
                  value={formData.price}
                  onChange={handleChange}
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                  placeholder='예: 50,000,000'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  주행거리 (km)
                </label>
                <input
                  type='number'
                  name='mileage'
                  value={formData.mileage}
                  onChange={handleChange}
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                  placeholder='예: 45000'
                  min='0'
                  required
                />
              </div>
            </div>
          </div>

          {/* 추가 정보 섹션 */}
          <div className={`space-y-6 ${currentStep === 4 ? 'block' : 'hidden'}`}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>연료</label>
                <select
                  name='fuelType'
                  value={formData.fuelType}
                  onChange={handleChange}
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white'
                  required
                >
                  <option value=''>선택해주세요</option>
                  {fuelTypes.map((fuel) => (
                    <option key={fuel} value={fuel}>
                      {fuel}
                    </option>
                  ))}
                </select>
                {formData.fuelType === '직접입력' && (
                  <input
                    type='text'
                    name='customFuelType'
                    value={formData.customFuelType}
                    onChange={handleChange}
                    className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mt-2'
                    placeholder='연료 종류를 입력해주세요'
                    required
                  />
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>색상</label>
                <select
                  name='color'
                  value={formData.color}
                  onChange={handleChange}
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white'
                  required
                >
                  <option value=''>선택해주세요</option>
                  {colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                {formData.color === '직접입력' && (
                  <input
                    type='text'
                    name='customColor'
                    value={formData.customColor}
                    onChange={handleChange}
                    className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mt-2'
                    placeholder='색상을 입력해주세요'
                    required
                  />
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>변속기</label>
                <select
                  name='transmission'
                  value={formData.transmission}
                  onChange={handleChange}
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white'
                  required
                >
                  <option value=''>선택해주세요</option>
                  {transmissions.map((trans) => (
                    <option key={trans} value={trans}>
                      {trans}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>차량번호</label>
                <input
                  type='text'
                  name='carNumber'
                  value={formData.carNumber}
                  onChange={handleChange}
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                  placeholder='예: 12가 3456'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  보험이력 (회)
                </label>
                <input
                  type='number'
                  name='insuranceHistory'
                  value={formData.insuranceHistory}
                  onChange={handleChange}
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                  min='0'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  성능점검이력 (회)
                </label>
                <input
                  type='number'
                  name='inspectionHistory'
                  value={formData.inspectionHistory}
                  onChange={handleChange}
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                  min='0'
                  required
                />
              </div>
            </div>
          </div>

          {/* 연락처 섹션 */}
          <div className={`space-y-6 ${currentStep === 5 ? 'block' : 'hidden'}`}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>지역</label>
                <select
                  name='region'
                  value={formData.region}
                  onChange={handleChange}
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white'
                  required
                >
                  <option value=''>선택해주세요</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {formData.region === '직접입력' && (
                  <input
                    type='text'
                    name='customRegion'
                    value={formData.customRegion}
                    onChange={handleChange}
                    className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mt-2'
                    placeholder='지역을 입력해주세요'
                    required
                  />
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>연락처</label>
                <input
                  type='tel'
                  name='contactNumber'
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                  placeholder='예: 010-1234-5678'
                  required
                />
              </div>
            </div>
          </div>

          {/* 네비게이션 버튼 */}
          <div className='flex justify-between pt-6'>
            <button
              type='button'
              onClick={handlePrevious}
              className={`px-6 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors ${
                currentStep === 1 ? 'invisible' : ''
              }`}
            >
              이전
            </button>

            {currentStep < steps.length ? (
              <button
                type='button'
                onClick={handleNext}
                disabled={!canProceed}
                className='px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300'
              >
                다음
              </button>
            ) : (
              <button
                type='submit'
                disabled={loading || !canProceed}
                className='px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300'
              >
                {loading ? '등록 중...' : '차량 등록하기'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellCar;
