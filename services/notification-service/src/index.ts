import express from "express";
import { bookingHandler } from "./pubsub/bookingHandler";
import { reminderHandler } from "./scheduler/reminderHandler";

const app = express();
app.use(express.json());

app.post("/pubsub/booking", bookingHandler);
app.post("/tasks/reminders", reminderHandler);

app.get("/health", (_, res) => res.send("ok"));

const port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log("Notification service running on port", port)
);
