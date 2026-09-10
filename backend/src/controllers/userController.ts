import { Request, Response } from "express";

import { users } from "../data/users";


// ==========================================
// GET ALL USERS
// ==========================================

export const getUsers = (
  req: Request,
  res: Response
) => {

  res.status(200).json({
    message: "Users fetched successfully",
    users,
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
    user,
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
  const { name, email, role } = req.body;


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
  const newUser = {
    id: newId,
    name,
    email,
    role,
  };


  // User array mein add karo
  users.push(newUser);


  // Response
  res.status(201).json({
    message: "User created successfully",
    user: newUser,
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
  const { name, email, role } = req.body;


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


  // Complete user replace
  users[userIndex] = {
    id,
    name,
    email,
    role,
  };


  // Response
  res.status(200).json({
    message: "User updated successfully",
    user: users[userIndex],
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
  const { name, email, role } = req.body;


  // Name update
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


  // Email update
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


  // Role update
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


  // Response
  res.status(200).json({
    message: "User patched successfully",
    user,
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


  // Response
  res.status(200).json({
    message: "User deleted successfully",
    user: deletedUser[0],
  });

};