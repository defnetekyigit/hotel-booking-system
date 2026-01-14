import { Request, Response } from "express";
import { sendBookingMail } from "../mail/mailer";

export async function bookingHandler(req: Request, res: Response) {
  try {
    const message = req.body.message;
    if (!message?.data) {
      return res.status(400).send("No message");
    }

    const payload = JSON.parse(
      Buffer.from(message.data, "base64").toString()
    );

    console.log("📩 Booking event received:", payload);

    // örnek payload:
    // { bookingId, userId, roomId, startDate, endDate }

    await sendBookingMail("yourmail@gmail.com", payload);

    res.status(204).send(); // ACK
  } catch (err) {
    console.error("PubSub handler error", err);
    res.status(500).send();
  }
}
