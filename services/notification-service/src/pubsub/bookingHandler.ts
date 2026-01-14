import { Request, Response } from "express";
import { sendBookingMail } from "../mail/mailer";
import { pool } from "../db";

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

    const { userId } = payload;

    const { rows } = await pool.query(
      `SELECT email FROM "User" WHERE id = $1`,
      [userId]
    );

    const user = rows[0];
    if (!user?.email) {
      console.warn("User email not found for booking", payload.bookingId);
      return res.status(204).send();
    }

    await sendBookingMail(user.email, payload);

    res.status(204).send();
  } catch (err) {
    console.error("PubSub handler error", err);
    res.status(500).send();
  }
}
