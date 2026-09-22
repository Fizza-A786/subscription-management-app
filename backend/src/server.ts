import "dotenv/config";
import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});