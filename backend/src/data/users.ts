import { User, UserRole } from "../types/user";

export const users: User[] = [
  {
    id: 1,
    name: "Ali",
    email: "ali@gmail.com",
    phone: "03001234567",
    role: UserRole.ADMIN,
    password:
      "$2b$10$GFRvpPKJpsD.zbTK5JL3q.czCeSZL/.gYM8QFEkDXzHl8HjVnhDzW",
  },

  {
    id: 2,
    name: "Ahmed",
    email: "ahmed@gmail.com",
    phone: "03111234567",
    role: UserRole.CUSTOMER,
    password:
      "$2b$10$YcZcI7KgOw/YJXxoKf5ic.DY0bMzFe9GJ.pPTcNM/94WZxDQFa6Qe",
  },

  {
    id: 3,
    name: "Sara",
    email: "sara@gmail.com",
    phone: "03221234567",
    role: UserRole.CUSTOMER,
    password:
      "$2b$10$XT/iGSO1BscooKLvPn7vFeLIS/.uzLNrfzzOLlQywHVxbcez6BRfq",
  },
];