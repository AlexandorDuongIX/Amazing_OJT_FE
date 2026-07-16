import axiosClient from './axiosClient';
import type { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  RequestPasswordResetRequest,
  PasswordResetResponse,
  ResetPasswordRequest 
} from '../types/auth';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return await axiosClient.post<any, AuthResponse>('/Auth/login', data);
  },
  
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return await axiosClient.post<any, AuthResponse>('/Auth/register', data);
  },

  requestPasswordReset: async (data: RequestPasswordResetRequest): Promise<PasswordResetResponse> => {
    return await axiosClient.post<any, PasswordResetResponse>('/Auth/request-password-reset', data);
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    return await axiosClient.post('/Auth/reset-password', data);
  },
};
