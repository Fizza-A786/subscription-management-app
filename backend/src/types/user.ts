export type UserRole = "admin" | "customer";

export type Gender = "male" | "female";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  role: UserRole;
  password: string;
}