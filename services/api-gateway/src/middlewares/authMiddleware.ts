import { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../config/firebase";
import { prisma } from "../prisma";

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

    // USER UPSERT
    const user = await prisma.user.upsert({
      where: { id: decoded.uid },
      update: {},
      create: {
        id: decoded.uid,
        email: decoded.email!,
        role: "USER",
      },
    });

    req.user = {
      id: user.id,
      email: user.email!,
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
