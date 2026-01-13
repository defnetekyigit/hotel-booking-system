import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes";
import hotelRoutes from "./routes/hotelRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "hotel-service up" });
});

app.use("/admin", adminRoutes);
app.use("/", hotelRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Hotel Service running on port ${PORT}`);
});
