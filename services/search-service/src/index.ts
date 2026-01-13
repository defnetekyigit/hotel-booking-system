import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import searchRoutes from "./routes/searchRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "search-service up" });
});

app.use("/search", searchRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Search Service running on port ${PORT}`);
});
