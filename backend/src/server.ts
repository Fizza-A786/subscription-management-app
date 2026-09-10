import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes";


const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// USER ROUTES
// ==========================================

app.use("/api/users", userRoutes);


// ==========================================
// SERVER
// ==========================================

const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on http://localhost:${PORT}`
  );

});