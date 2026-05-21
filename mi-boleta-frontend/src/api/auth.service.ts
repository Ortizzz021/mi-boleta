import { apiClient } from './client';
import type { ApiResponse } from '../types/api.types';
import type { User, LoginRequest, LoginResponse, RegisterRequest } from '../types/auth.types';

export const authService = {
  async register(data: RegisterRequest): Promise<ApiResponse<User>> {
    return apiClient.post<ApiResponse<User>>('/auth/register', data, false);
  },

  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data, false);
  },
};
