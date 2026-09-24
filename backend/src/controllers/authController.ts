import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { users } from "../data/users";
import { UserRole } from "../types/user";

// ==========================================
// SIGNUP
// ==========================================

export const signup = async (req: Request, res: Response) => {
  try {
    // Request body se data lena
    const { name, email, phone, password, confirmPassword } = req.body;

    // ==========================================
    // CHECK REQUIRED FIELDS
    // ==========================================

    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // ==========================================
    // CHECK PASSWORD MATCH
    // ==========================================

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // ==========================================
    // CHECK EXISTING EMAIL
    // ==========================================

    const existingUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // ==========================================
    // HASH PASSWORD
    // ==========================================

    const hashedPassword = await bcrypt.hash(password, 10);

    // ==========================================
    // CREATE UNIQUE ID
    // ==========================================

    const newId =
      users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

    // ==========================================
    // CREATE NEW USER
    // ==========================================

    const newUser = {
      id: newId,
      name,
      email,
      phone,
      role: UserRole.CUSTOMER,
      password: hashedPassword,
    };

    // ==========================================
    // SAVE USER
    // ==========================================

    users.push(newUser);

    // ==========================================
    // RESPONSE
    // Password intentionally excluded
    // ==========================================

    return res.status(201).json({
      message: "Signup successful",

      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// LOGIN
// ==========================================

export const login = async (req: Request, res: Response) => {
  try {
    // ==========================================
    // GET EMAIL AND PASSWORD
    // ==========================================

    const { email, password } = req.body;

    // ==========================================
    // CHECK REQUIRED FIELDS
    // ==========================================

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // ==========================================
    // FIND USER
    // ==========================================

    const user = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );

    // ==========================================
    // USER NOT FOUND
    // ==========================================

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ==========================================
    // CHECK PASSWORD
    // ==========================================

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // ==========================================
    // WRONG PASSWORD
    // ==========================================

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ==========================================
    // GET JWT SECRET
    // ==========================================

    const JWT_SECRET = process.env.JWT_SECRET;

    // ==========================================
    // CHECK JWT SECRET
    // ==========================================

    if (!JWT_SECRET) {
      return res.status(500).json({
        message: "JWT secret is not configured",
      });
    }

    // ==========================================
    // CREATE JWT TOKEN
    // ==========================================

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // ==========================================
    // LOGIN SUCCESS
    // ==========================================

    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
// ==========================================
// GET PROFILE - PROTECTED
// ==========================================

export const getProfile = (req: Request, res: Response) => {
  // Middleware ne decoded JWT ko request mein add kiya hai
  const userData = (req as any).user;

  // User ID se actual user find karna
  const user = users.find((user) => user.id === userData.id);

  // User nahi mila
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Password ke baghair user return karna
  return res.status(200).json({
    message: "Profile fetched successfully",

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
};
