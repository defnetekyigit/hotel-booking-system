import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { authenticate, AuthRequest } from "../middlewares/authMiddleware";
import { authenticateOptional } from "../middlewares/authenticateOptionalMiddleware";

const router = Router();

//SEARCH SERVICE
router.use(
  "/search",
  authenticateOptional,
  createProxyMiddleware({
    target: process.env.SEARCH_SERVICE_URL!,
    changeOrigin: true,
    pathRewrite: {
      "^/api/v1/search": "/search",
    },
    onProxyReq: (proxyReq, req: AuthRequest) => {
      if (req.user) {
        proxyReq.setHeader("x-user-logged-in", "true");
      }
    },
  })
);

//BOOKING SERVICE
router.use(
  "/bookings",
  authenticate,
  createProxyMiddleware({
    target: process.env.BOOKING_SERVICE_URL!,
    changeOrigin: true,
    pathRewrite: {
      "^/api/v1/bookings": "/bookings",
    },
    onProxyReq: (proxyReq, req: AuthRequest) => {
      if (req.user) {
        proxyReq.setHeader("x-user-id", req.user.id);
        proxyReq.setHeader("x-user-role", req.user.role);
      }

      const hasBody = ["POST", "PUT", "PATCH"].includes(req.method ?? "");

      if (hasBody && req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
  })
);
// HOTEL SERVICE (USER + ADMIN READ)
router.use(
  "/hotels",
  authenticate,
  createProxyMiddleware({
    target: process.env.HOTEL_SERVICE_URL!,
    changeOrigin: true,
    pathRewrite: {
      "^/api/v1": "",
    },
    onProxyReq: (proxyReq, req: any) => {
      if (req.user) {
        proxyReq.setHeader("x-user-id", req.user.id);
        proxyReq.setHeader("x-user-role", req.user.role);
      }
    },
  })
);

router.use(
  "/rooms",
  authenticate,
  createProxyMiddleware({
    target: process.env.HOTEL_SERVICE_URL!,
    changeOrigin: true,
    pathRewrite: {
      "^/api/v1": "",
    },
    onProxyReq: (proxyReq, req: any) => {
      if (req.user) {
        proxyReq.setHeader("x-user-id", req.user.id);
        proxyReq.setHeader("x-user-role", req.user.role);
      }
    },
  })
);

export default router;
