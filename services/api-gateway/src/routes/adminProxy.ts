import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { authenticate, AuthRequest } from "../middlewares/authMiddleware";
import { requireAdmin } from "../middlewares/adminMiddleware";

const router = Router();

/**
 * Admin → Hotel Service
 */
router.use(
  "/",
  authenticate,
  requireAdmin,
  createProxyMiddleware({
    target: process.env.HOTEL_SERVICE_URL!,
    changeOrigin: true,
    pathRewrite: {
      "^/api/v1/admin": "/admin",
    },
    onProxyReq: (proxyReq, req: AuthRequest) => {
      const hasBody = ["POST", "PUT", "PATCH"].includes(req.method ?? "");
      if (hasBody && req.body && req.user) {
        proxyReq.setHeader("x-user-id", req.user.id);
        proxyReq.setHeader("x-user-role", req.user.role);
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
  })
);

export default router;
