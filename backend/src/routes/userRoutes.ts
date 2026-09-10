import express from "express";

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  patchUser,
  deleteUser,
} from "../controllers/userController";


const router = express.Router();


// ==========================================
// GET ALL USERS
// ==========================================

router.get("/", getUsers);


// ==========================================
// GET USER BY ID
// ==========================================

router.get("/:id", getUserById);


// ==========================================
// POST CREATE USER
// ==========================================

router.post("/", createUser);


// ==========================================
// PUT COMPLETE UPDATE
// ==========================================

router.put("/:id", updateUser);


// ==========================================
// PATCH PARTIAL UPDATE
// ==========================================

router.patch("/:id", patchUser);


// ==========================================
// DELETE USER
// ==========================================

router.delete("/:id", deleteUser);


export default router;