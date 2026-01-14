import { Request, Response } from "express";
import dayjs from "dayjs";
import { senReminderMail } from "../mail/mailer";
import { pool } from "../db";
import { dedupCache } from "../cache/dedupCache";

export async function reminderHandler(_: Request, res: Response) {
  const tomorrow = dayjs().add(1, "day").startOf("day");
  const end = tomorrow.endOf("day");

  const { rows } = await pool.query(
    `
  SELECT
    b.*,
    u.email
  FROM "Booking" b
  JOIN "User" u ON u.id = b."userId"
  WHERE b."startDate" BETWEEN $1 AND $2
  `,
    [tomorrow.toDate(), end.toDate()]
  );

  for (const booking of rows) {
    const dedupKey = `reminder:${booking.id}`;

    if (dedupCache.has(dedupKey)) {
      continue;
    }

    dedupCache.set(dedupKey, 24 * 60 * 60 * 1000); // 1 gün
    await senReminderMail(booking.email, booking);
  }

  res.send({ sent: rows.length });
}
