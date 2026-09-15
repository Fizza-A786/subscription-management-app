import axios from "axios";

import type {
  User,
  UserFormData,
} from "../../types/user";

/* =========================================
   API CONFIGURATION
   ========================================= */

const api = axios.create({
  baseURL:
    "https://subscription-management-app-c1fa.onrender.com/api",

  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================================
   GET ALL USERS
   GET /api/users
   ========================================= */

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");

  return response.data.users;
};

/* =========================================
   GET SINGLE USER
   GET /api/users/:id
   ========================================= */

export const getUserById = async (
  id: number
): Promise<User> => {
  const response = await api.get(
    `/users/${id}`
  );

  return response.data.user;
};

/* =========================================
   CREATE USER
   POST /api/users
   ========================================= */

export const createUser = async (
  user: UserFormData
): Promise<User> => {
  const response = await api.post(
    "/users",
    user
  );

  return response.data.user;
};

/* =========================================
   UPDATE USER
   PUT /api/users/:id
   ========================================= */

export const updateUser = async (
  id: number,
  user: UserFormData
): Promise<User> => {
  const response = await api.put(
    `/users/${id}`,
    user
  );

  return response.data.user;
};

/* =========================================
   PATCH USER
   PATCH /api/users/:id
   ========================================= */

export const patchUser = async (
  id: number,
  user: Partial<UserFormData>
): Promise<User> => {
  const response = await api.patch(
    `/users/${id}`,
    user
  );

  return response.data.user;
};

/* =========================================
   DELETE USER
   DELETE /api/users/:id
   ========================================= */

export const deleteUser = async (
  id: number
) => {
  const response = await api.delete(
    `/users/${id}`
  );

  return response.data;
};