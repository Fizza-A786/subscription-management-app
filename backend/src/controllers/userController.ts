import { Request, Response } from "express";
import { users } from "../data/users";

// ==========================================
// PUBLIC USER HELPER
// Password ko response se remove karta hai
// ==========================================

const safeUser = (user: any) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
};

// ==========================================
// GET ALL USERS
// ==========================================

export const getUsers = (
  req: Request,
  res: Response
) => {
  const safeUsers = users.map(safeUser);

  res.status(200).json({
    message: "Users fetched successfully",
    users: safeUsers,
  });
};

// ==========================================
// GET USER BY ID
// ==========================================

export const getUserById = (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  const user = users.find(
    (user) => user.id === id
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json({
    message: "User fetched successfully",
    user: safeUser(user),
  });
};

// ==========================================
// POST - CREATE USER
// ==========================================

export const createUser = (
  req: Request,
  res: Response
) => {
  // Request body se data lena
  const {
    name,
    email,
    phone,
    role,
  } = req.body;

  // Validation
  if (!name || !email || !role) {
    return res.status(400).json({
      message: "Name, email and role are required",
    });
  }

  // Safe unique ID
  const newId =
    users.length > 0
      ? Math.max(
          ...users.map((user) => user.id)
        ) + 1
      : 1;

  // New user object
  //
  // CRUD se create hone wale user ke paas
  // abhi authentication password nahi hai.
  const newUser = {
    id: newId,
    name,
    email,
    phone: phone || "",
    role,
    password: "",
  };

  // User array mein add karo
  users.push(newUser);

  // Password response mein nahi bhejna
  res.status(201).json({
    message: "User created successfully",
    user: safeUser(newUser),
  });
};

// ==========================================
// PUT - COMPLETE UPDATE USER
// ==========================================

export const updateUser = (
  req: Request,
  res: Response
) => {
  // URL se ID
  const id = Number(req.params.id);

  // Body se data
  const {
    name,
    email,
    phone,
    role,
  } = req.body;

  // User ka index find
  const userIndex = users.findIndex(
    (user) => user.id === id
  );

  // User nahi mila
  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Validation
  if (!name || !email || !role) {
    return res.status(400).json({
      message: "Name, email and role are required",
    });
  }

  // Existing password ko preserve karna
  const existingPassword =
    users[userIndex].password;

  // Complete user update
  users[userIndex] = {
    id,
    name,
    email,
    phone: phone || users[userIndex].phone || "",
    role,
    password: existingPassword,
  };

  // Password response mein nahi bhejna
  res.status(200).json({
    message: "User updated successfully",
    user: safeUser(users[userIndex]),
  });
};

// ==========================================
// PATCH - PARTIAL UPDATE USER
// ==========================================

export const patchUser = (
  req: Request,
  res: Response
) => {
  // URL se ID
  const id = Number(req.params.id);

  // User find
  const user = users.find(
    (user) => user.id === id
  );

  // User nahi mila
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Body se optional data
  const {
    name,
    email,
    phone,
    role,
  } = req.body;

  // ==========================================
  // NAME UPDATE
  // ==========================================

  if (name !== undefined) {
    if (
      typeof name !== "string" ||
      name.trim() === ""
    ) {
      return res.status(400).json({
        message: "Name cannot be empty",
      });
    }

    user.name = name;
  }

  // ==========================================
  // EMAIL UPDATE
  // ==========================================

  if (email !== undefined) {
    if (
      typeof email !== "string" ||
      email.trim() === ""
    ) {
      return res.status(400).json({
        message: "Email cannot be empty",
      });
    }

    user.email = email;
  }

  // ==========================================
  // PHONE UPDATE
  // ==========================================

  if (phone !== undefined) {
    if (
      typeof phone !== "string" ||
      phone.trim() === ""
    ) {
      return res.status(400).json({
        message: "Phone cannot be empty",
      });
    }

    user.phone = phone;
  }

  // ==========================================
  // ROLE UPDATE
  // ==========================================

  if (role !== undefined) {
    if (
      role !== "admin" &&
      role !== "customer"
    ) {
      return res.status(400).json({
        message: "Role must be admin or customer",
      });
    }

    user.role = role;
  }

  // Password response mein nahi bhejna
  res.status(200).json({
    message: "User patched successfully",
    user: safeUser(user),
  });
};

// ==========================================
// DELETE USER
// ==========================================

export const deleteUser = (
  req: Request,
  res: Response
) => {
  // URL se ID
  const id = Number(req.params.id);

  // User ka index
  const userIndex = users.findIndex(
    (user) => user.id === id
  );

  // User nahi mila
  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // User delete
  const deletedUser = users.splice(
    userIndex,
    1
  );

  // Password response mein nahi bhejna
  res.status(200).json({
    message: "User deleted successfully",
    user: safeUser(deletedUser[0]),
  });
};