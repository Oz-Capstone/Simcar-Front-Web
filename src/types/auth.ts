export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserInfo {
  email: string;
  name: string;
  phone: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
}

export interface ErrorResponse {
  message: string;
}
