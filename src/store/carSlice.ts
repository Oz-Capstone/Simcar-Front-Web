import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Car, CarListResponse, CarFilter } from '../types/car';
import * as carApi from '../api/carApi';

interface CarState {
  cars: CarListResponse[];
  selectedCar: Car | null;
  loading: boolean;
  error: string | null;
  filter: CarFilter;
}

const initialState: CarState = {
  cars: [],
  selectedCar: null,
  loading: false,
  error: null,
  filter: {},
};

export const fetchCars = createAsyncThunk<
  CarListResponse[],
  CarFilter | undefined,
  { rejectValue: string }
>('car/fetchCars', async (filter, { rejectWithValue }) => {
  try {
    const response = await carApi.getCars(filter);
    return response;
  } catch (err) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue('차량 목록을 불러오는데 실패했습니다.');
  }
});

export const fetchCarDetail = createAsyncThunk<Car, number, { rejectValue: string }>(
  'car/fetchCarDetail',
  async (carId, { rejectWithValue }) => {
    try {
      const response = await carApi.getCarDetail(carId);
      return response;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('차량 상세 정보를 불러오는데 실패했습니다.');
    }
  }
);

const carSlice = createSlice({
  name: 'car',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<CarFilter>) => {
      state.filter = action.payload;
    },
    clearSelectedCar: (state) => {
      state.selectedCar = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? '차량 목록을 불러오는데 실패했습니다.';
      })
      .addCase(fetchCarDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCar = action.payload;
      })
      .addCase(fetchCarDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? '차량 상세 정보를 불러오는데 실패했습니다.';
      });
  },
});

export const { setFilter, clearSelectedCar, clearError } = carSlice.actions;
export default carSlice.reducer;
