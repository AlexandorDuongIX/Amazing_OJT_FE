export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  token: string;
  expiresAtUtc: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
  expiresAtUtc?: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword?: string;
  confirmPassword?: string;
}
