import type { User } from "../types/user";

export const users: User[] = [
  {
    id: 1,
    name: "Fizza",
    email: "devfizza@gmail.com",
    phone: "03001234567",
    gender: "female",
    role: "admin",
    password:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJkZXZmaXp6YUBnbWFpbC5jb20iLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE3OTAzNDE5MTAsImV4cCI6MTc5MDQyODMxMH0.4ErFRGwyNTB63baYy4bIQwqkqxYFyBoWl8QBJ8YBMS8",
  },

  {
    id: 2,
    name: "Ahmed",
    email: "ahmed@gmail.com",
    phone: "03111234567",
    gender: "male",
    role: "customer",
    password:
      "$2b$10$7PkK6oWbNSBDaEMzGZqnieX9j3U.chqVuCEDphe/LU//j8/sRNC6W",
  },

  {
    id: 3,
    name: "Sara",
    email: "sara@gmail.com",
    phone: "03221234567",
    gender: "female",
    role: "customer",
    password:
      "$2b$10$beREdi8Ovf2NQChYO2c02.JWBybWHewZqEtIkrBLa3g8XLUTqOzL6",
  },
];