import axios from "axios";

import type {
  LoginData,
  SignupData,
  AuthResponse,
} from "../../types/authApi";

/* =========================================
   API CONFIGURATION
   ========================================= */

const api = axios.create({
  baseURL: "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================================
   SIGNUP
   POST /api/auth/signup
   ========================================= */

export const signup = async (
  data: SignupData
) => {
  const response = await api.post(
    "/auth/signup",
    data
  );

  return response.data;
};

/* =========================================
   LOGIN
   POST /api/auth/login
   ========================================= */

export const login = async (
  data: LoginData
): Promise<AuthResponse> => {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};

/* =========================================
   GET PROFILE
   GET /api/auth/profile
   ========================================= */

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get(
    "/auth/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.user;
};

/* =========================================
   LOGOUT
   ========================================= */

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};