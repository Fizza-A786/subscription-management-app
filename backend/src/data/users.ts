import { User, UserRole } from "../types/user";

export const users: User[] = [
  {
    id: 1,
    name: "Ali",
    email: "ali@gmail.com",
    phone: "03001234567",
    role: UserRole.ADMIN,
    password:
      "$2b$10$DyFPxjlRtGp4ScN5mL/Yv.g4IO7b4S/dEe62EAOkSsn5R.xJ6lzDK",
  },

  {
    id: 2,
    name: "Ahmed",
    email: "ahmed@gmail.com",
    phone: "03111234567",
    role: UserRole.CUSTOMER,
    password:
      "$2b$10$Xx9Dzc4vyY.iqgVSS7Qv5.SmIO9rn5cVO0QmUoxiqKMTc63M0TD5S",
  },

  {
    id: 3,
    name: "Sara",
    email: "sara@gmail.com",
    phone: "03221234567",
    role: UserRole.CUSTOMER,
    password:
      "$2b$10$v.SeNMqdocWio47Nyv7JGuM55EIXzFM9NGO4vEmbz6sHR0/18AFyC",
  },
];