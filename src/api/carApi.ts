import { api } from './axios';
import { Car, CarListResponse, CarFilter } from '../types/car';

export interface CarRegistrationRequest {
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

// 이미지 URL을 백엔드 서버 URL과 결합
export const getFullImageUrl = (path: string): string => {
  if (!path) return '';
  return `http://54.180.92.197:8080${path}`;
};

// 로컬 스토리지에서 찜한 차량 ID 목록을 가져오는 함수
export const getFavoriteIdsFromLocalStorage = (): number[] => {
  const savedFavorites = localStorage.getItem('favoriteCars');
  return savedFavorites ? JSON.parse(savedFavorites) : [];
};

// 로컬 스토리지에 찜한 차량 ID 목록을 저장하는 함수
export const saveFavoriteIdsToLocalStorage = (favoriteIds: number[]): void => {
  localStorage.setItem('favoriteCars', JSON.stringify(favoriteIds));
};

// 브랜드 영문명을 한글명으로 변환
export const convertBrandToKorean = (englishBrand: string): string => {
  const brandMap: { [key: string]: string } = {
    genesis: '제네시스',
    hyundai: '현대',
    kia: '기아',
    bmw: 'BMW',
    benz: '벤츠',
    audi: '아우디',
    toyota: '토요타',
    honda: '혼다',
    volkswagen: '폭스바겐',
    tesla: '테슬라',
    chevrolet: '쉐보레',
    ford: '포드',
    nissan: '닛산',
    lexus: '렉서스',
    volvo: '볼보',
  };

  return brandMap[englishBrand.toLowerCase()] || englishBrand;
};

// 지역 영문명을 한글명으로 변환
export const convertRegionToKorean = (englishRegion: string): string => {
  const regionMap: { [key: string]: string } = {
    Seoul: '서울',
    Busan: '부산',
    Daegu: '대구',
    Incheon: '인천',
    Gwangju: '광주',
    Daejeon: '대전',
    Ulsan: '울산',
    Sejong: '세종',
    Gyeonggi: '경기',
    Gangwon: '강원',
    Chungbuk: '충북',
    Chungnam: '충남',
    Jeonbuk: '전북',
    Jeonnam: '전남',
    Gyeongbuk: '경북',
    Gyeongnam: '경남',
    Jeju: '제주',
  };

  return regionMap[englishRegion] || englishRegion;
};

// 차량 데이터 처리 함수 - 영문을 한글로 변환
const processCarData = (car: CarListResponse): CarListResponse => {
  return {
    ...car,
    brand: convertBrandToKorean(car.brand),
    region: convertRegionToKorean(car.region),
    imageUrl: getFullImageUrl(car.imageUrl),
  };
};

// 차량 상세 데이터 처리 함수 - 영문을 한글로 변환
const processCarDetailData = (car: Car): Car => {
  return {
    ...car,
    brand: convertBrandToKorean(car.brand),
    region: convertRegionToKorean(car.region),
    images: car.images.map((image) => ({
      ...image,
      filePath: getFullImageUrl(image.filePath),
    })),
  };
};

// 차량 목록 조회
export const getCars = async (filter?: CarFilter): Promise<CarListResponse[]> => {
  const response = await api.get<CarListResponse[]>('/cars', {
    params: filter,
  });
  // 이미지 URL 처리 및 브랜드/지역 한글 변환
  return response.data.map(processCarData);
};

// 차량 상세 조회
export const getCarDetail = async (carId: number): Promise<Car> => {
  const response = await api.get<Car>(`/cars/${carId}`);
  // 이미지 URL 처리 및 브랜드/지역 한글 변환
  return processCarDetailData(response.data);
};

// 내 판매 차량 목록 조회
export const getMySales = async (): Promise<CarListResponse[]> => {
  const response = await api.get<CarListResponse[]>('/members/sales');
  // 이미지 URL 처리 및 브랜드/지역 한글 변환
  return response.data.map(processCarData);
};

// 찜한 차량 목록 조회
export const getFavorites = async (): Promise<CarListResponse[]> => {
  const response = await api.get<CarListResponse[]>('/members/favorites');
  // 이미지 URL 처리 및 브랜드/지역 한글 변환
  const favorites = response.data.map(processCarData);

  // 찜한 차량 ID를 로컬 스토리지에 저장
  saveFavoriteIdsToLocalStorage(favorites.map((car) => car.id));

  return favorites;
};

// 차량 진단 정보 조회
export const getCarDiagnosis = async (carId: number) => {
  const response = await api.get(`/cars/${carId}/diagnosis`);
  return response.data;
};

// 차량 등록
export const registerCar = async (
  carData: CarRegistrationRequest,
  images: File[]
): Promise<string> => {
  const formData = new FormData();

  // 차량 정보를 JSON string으로 변환하여 request 필드에 추가
  formData.append('request', new Blob([JSON.stringify(carData)], { type: 'application/json' }));

  // 이미지 파일들을 images 필드에 추가
  images.forEach((image) => {
    formData.append('images', image);
  });

  const response = await api.post<string>('/cars', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// 대표 이미지 설정
export const setCarThumbnail = async (carId: number, imageId: number): Promise<void> => {
  await api.put(`/cars/${carId}/thumbnail/${imageId}`);
};

// 차량 정보 수정
export const updateCar = async (carId: number, carData: CarRegistrationRequest): Promise<Car> => {
  const response = await api.put<Car>(`/cars/${carId}`, carData);
  return processCarDetailData(response.data);
};

// 차량 삭제
export const deleteCar = async (carId: number): Promise<void> => {
  await api.delete(`/cars/${carId}`);
};

// 찜하기
export const addFavorite = async (carId: number): Promise<void> => {
  await api.post(`/favorites/${carId}`);

  // 로컬 스토리지에 찜하기 상태 업데이트
  const favoriteIds = getFavoriteIdsFromLocalStorage();
  if (!favoriteIds.includes(carId)) {
    saveFavoriteIdsToLocalStorage([...favoriteIds, carId]);
  }
};

// 찜하기 취소
export const removeFavorite = async (carId: number): Promise<void> => {
  await api.delete(`/favorites/${carId}`);

  // 로컬 스토리지에서 찜하기 상태 업데이트
  const favoriteIds = getFavoriteIdsFromLocalStorage();
  saveFavoriteIdsToLocalStorage(favoriteIds.filter((id) => id !== carId));
};
