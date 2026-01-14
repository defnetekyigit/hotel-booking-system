import dotenv from "dotenv";

dotenv.config({ path: "/temp/.env" });

import express from "express";
import { bookingHandler } from "./pubsub/bookingHandler";
import { reminderHandler } from "./scheduler/reminderHandler";
import { capacityAlertHandler } from "./scheduler/capacityAlertHandler";

const app = express();
app.use(express.json());

app.post("/pubsub/booking", bookingHandler);
app.post("/tasks/reminders", reminderHandler);
app.post("/tasks/capacity-alerts", capacityAlertHandler);

app.get("/health", (_, res) => res.send("ok"));

const port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log("Notification service running on port", port)
);
