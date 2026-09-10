import { User, UserRole } from "../types/user";

export const users: User[] = [
  {
    id: 1,
    name: "Ali",
    email: "ali@gmail.com",
    role: UserRole.ADMIN,
  },
  {
    id: 2,
    name: "Ahmed",
    email: "ahmed@gmail.com",
    role: UserRole.CUSTOMER,
  },
  {
    id: 3,
    name: "Sara",
    email: "sara@gmail.com",
    role: UserRole.CUSTOMER,
  },
];