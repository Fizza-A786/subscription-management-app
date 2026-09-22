import { Request, Response, NextFunction } from "express";

export const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({
      message: "User is not authenticated",
    });
  }

  if (user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }

  next();
};