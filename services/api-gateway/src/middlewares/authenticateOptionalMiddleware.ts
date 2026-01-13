import { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../config/firebase";
import { prisma } from "../prisma";
import { AuthRequest } from "./authMiddleware";
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

    const user = await prisma.user.findUnique({
      where: { id: decoded.uid },
    });

    if (user) {
      req.user = {
        id: user.id,
        role: user.role,
        email: user.email ?? undefined,
      };
    }
  } catch {
    // ignore invalid token
  }

  next();
}
