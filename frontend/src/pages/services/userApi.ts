import axios from "axios";

import type {
  User,
  UserFormData,
} from "../../types/user";

const api = axios.create({
  baseURL: "https://subscription-management-app-c1fa.onrender.com/api",
});

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");

  return response.data.users;
};
export const getUserById = async (
  id: number
): Promise<User> => {
  const response = await api.get(`/users/${id}`);

  return response.data;
};

export const createUser = async (
  user: UserFormData
) => {
  const response = await api.post(
    "/users",
    user
  );

  return response.data;
};

export const updateUser = async (
  id: number,
  user: UserFormData
) => {
  const response = await api.put(
    `/users/${id}`,
    user
  );

  return response.data;
};

export const patchUser = async (
  id: number,
  user: Partial<UserFormData>
) => {
  const response = await api.patch(
    `/users/${id}`,
    user
  );

  return response.data;
};

export const deleteUser = async (
  id: number
) => {
  const response = await api.delete(
    `/users/${id}`
  );

  return response.data;
};