import express from "express";

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  patchUser,
  deleteUser,
} from "../controllers/userController";

import { adminOnly } from "../middleware/roleMiddleware";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// ==========================================
// GET ALL USERS
// LOGIN REQUIRED
// ==========================================

router.get(
  "/",
  authMiddleware,
  getUsers
);

// ==========================================
// GET USER BY ID
// LOGIN REQUIRED
// ==========================================

router.get(
  "/:id",
  authMiddleware,
  getUserById
);

// ==========================================
// CREATE USER - POST
// ADMIN ONLY
// ==========================================

router.post(
  "/",
  authMiddleware,
  adminOnly,
  createUser
);

// ==========================================
// COMPLETE UPDATE USER - PUT
// ADMIN ONLY
// ==========================================

router.put(
  "/:id",
  authMiddleware,
  adminOnly,
  updateUser
);

// ==========================================
// PARTIAL UPDATE USER - PATCH
// ADMIN ONLY
// ==========================================

router.patch(
  "/:id",
  authMiddleware,
  adminOnly,
  patchUser
);

// ==========================================
// DELETE USER
// ADMIN ONLY
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  deleteUser
);

export default router;