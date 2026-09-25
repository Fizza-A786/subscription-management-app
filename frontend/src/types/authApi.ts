import type { Gender, UserRole } from "./user";

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  role: UserRole;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}