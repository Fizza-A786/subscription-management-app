export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
}

export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
}