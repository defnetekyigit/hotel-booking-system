import dotenv from "dotenv";

dotenv.config({ path: "/temp/.env" });

import express from "express";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes";
import hotelRoutes from "./routes/hotelRoutes";
import { pool } from "./db";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "hotel-service up" });
});

app.get("/db-health", async (_req, res) => {
  try {
    const r = await pool.query("select 1 as ok");
    res.json({ ok: true, result: r.rows[0] });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.use("/admin", adminRoutes);
app.use("/", hotelRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Hotel Service running on port ${PORT}`);
  console.log("DATABASE_URL exists?", !!process.env.DATABASE_URL);
});
