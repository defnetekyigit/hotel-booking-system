import { Request } from "express";

export function getAdminUserId(req: Request): string {
  const userId = req.headers["x-user-id"];
  const role = req.headers["x-user-role"];

  if (!userId || typeof userId !== "string") {
    throw new Error("Missing user id");
  }

  if (role !== "ADMIN") {
    throw new Error("Admin only");
  }

  return userId;
}
