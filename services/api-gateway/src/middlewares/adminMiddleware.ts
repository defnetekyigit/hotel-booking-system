import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { prisma } from "../prisma";

export async function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
}
