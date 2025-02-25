export interface CarImage {
  id: number;
  originalFileName: string;
  filePath: string;
  thumbnail: boolean;
}

export interface Car {
  id: number;
  type: string;
  price: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  images: CarImage[];
  carNumber: string;
  insuranceHistory: number;
  inspectionHistory: number;
  color: string;
  transmission: string;
  region: string;
  contactNumber: string;
  sellerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarListResponse {
  id: number;
  type: string;
  price: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  imageUrl: string; // 대표 이미지 URL
  region: string;
  createdAt: string;
}

export interface CarFilter {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  brands?: string[];
  types?: string[];
  transmissions?: string[];
  fuelTypes?: string[];
  colors?: string[];
}

export interface CarDiagnosis {
  carId: number;
  reliabilityScore: number;
  evaluationComment: string;
}
