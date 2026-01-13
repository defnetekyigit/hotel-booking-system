import { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../config/firebase";
import { pool } from "../db";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role: "USER" | "ADMIN";
  };
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing token" });
    }

    const token = header.slice("Bearer ".length);
    const decoded = await firebaseAdmin.auth().verifyIdToken(token);

    const { rows } = await pool.query(
      `
      INSERT INTO "User" (id, email, role)
      VALUES ($1, $2, 'USER')
      ON CONFLICT (id)
      DO UPDATE SET email = EXCLUDED.email
      RETURNING id, email, role
      `,
      [decoded.uid, decoded.email]
    );

    const user = rows[0];

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
