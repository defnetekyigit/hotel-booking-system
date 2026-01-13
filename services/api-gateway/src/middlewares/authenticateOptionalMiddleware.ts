import { Response, NextFunction } from "express";
import { firebaseAdmin } from "../config/firebase";
import { AuthRequest } from "./authMiddleware";
import { pool } from "../db";

export async function authenticateOptional(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(); // anonymous
  }

  try {
    const token = header.slice("Bearer ".length);
    const decoded = await firebaseAdmin.auth().verifyIdToken(token);

    const { rows } = await pool.query(
      `SELECT id, email, role FROM "User" WHERE id = $1`,
      [decoded.uid]
    );

    const user = rows[0];

    if (user) {
      req.user = {
        id: user.id,
        role: user.role,
        email: user.email ?? undefined,
      };
    }
  } catch {
    // invalid token → ignore
  }

  next();
}
