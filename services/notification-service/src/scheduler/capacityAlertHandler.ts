import { Request, Response } from "express";
import { pool } from "../db";
import { sendCapacityAlertMail } from "../mail/mailer";

export async function capacityAlertHandler(_: Request, res: Response) {
  /**
   * Her hotel için:
   * - total room sayısı
   * - available room sayısı
   * - oran < %20 ise admin'e mail
   */

  const { rows: hotels } = await pool.query(`
    SELECT
      h.id as "hotelId",
      h.name as "hotelName",
      h."adminUserId",
      COUNT(r.id)::int as "totalRooms",
      COUNT(ra.id)::int as "availableRooms"
    FROM "Hotel" h
    JOIN "Room" r ON r."hotelId" = h.id
    LEFT JOIN "RoomAvailability" ra
      ON ra."roomId" = r.id
      AND ra."isAvailable" = true
      AND ra."date" >= CURRENT_DATE
    GROUP BY h.id
  `);

  let alertsSent = 0;

  for (const hotel of hotels) {
    if (hotel.totalRooms === 0) continue;

    const ratio = hotel.availableRooms / hotel.totalRooms;

    if (ratio < 0.2) {
      // admin mailini bul
      const { rows } = await pool.query(
        `SELECT email FROM "User" WHERE id = $1`,
        [hotel.adminUserId]
      );

      const admin = rows[0];
      if (!admin?.email) continue;

      await sendCapacityAlertMail(admin.email, {
        hotelName: hotel.hotelName,
        availableRooms: hotel.availableRooms,
        totalRooms: hotel.totalRooms,
      });

      alertsSent++;
    }
  }

  res.send({ alertsSent });
}
