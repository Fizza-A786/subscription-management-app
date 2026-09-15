export type UserRole =
  | "admin"
  | "customer";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
}