import type { User } from "./user";

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user: User;
}