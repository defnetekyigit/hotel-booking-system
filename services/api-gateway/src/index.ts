import dotenv from "dotenv";

dotenv.config({ path: "/temp/.env" });

import express from "express";
import cors from "cors";
import proxyRoutes from "./routes/proxy";
import adminProxy from "./routes/adminProxy";
import { authenticate, AuthRequest } from "./middlewares/authMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "api-gateway up" });
});
// auth me 
app.get("/api/v1/auth/me", authenticate, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});
app.use("/api/v1/admin", adminProxy);
app.use("/api/v1", proxyRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

