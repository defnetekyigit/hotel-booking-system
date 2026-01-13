import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { pool } from "../db";

export async function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { rows } = await pool.query(
    `SELECT role FROM "User" WHERE id = $1`,
    [req.user.id]
  );

  const user = rows[0];

  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
}
