import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bookingRoutes from "./routes/bookingRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "booking-service up" });
});

app.use("/bookings", bookingRoutes);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`Booking Service running on port ${PORT}`);
});
