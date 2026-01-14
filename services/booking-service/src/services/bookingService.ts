import dayjs from "dayjs";
import { pool } from "../db";
import { publishBookingCreated } from "../pubsub/publisher";

export class BookingService {
  static async createBooking(params: {
    roomId: string;
    userId: string;
    startDate: string;
    endDate: string;
    guestCount: number;
  }) {
    const { roomId, userId, startDate, endDate, guestCount } = params;

    const start = dayjs(startDate).startOf("day");
    const end = dayjs(endDate).endOf("day");

    if (end.isBefore(start)) {
      throw new Error("Invalid date range");
    }

    const days: Date[] = [];
    let current = start;
    while (current.isSame(end) || current.isBefore(end)) {
      days.push(current.toDate());
      current = current.add(1, "day");
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const { rows: availability } = await client.query(
        `
        SELECT COUNT(*)::int AS count
        FROM "RoomAvailability"
        WHERE "roomId" = $1
          AND date = ANY($2)
          AND "isAvailable" = true
        `,
        [roomId, days]
      );

      if (availability[0].count !== days.length) {
        throw new Error("Room not available for selected dates");
      }

      const { rows: bookings } = await client.query(
        `
        INSERT INTO "Booking"
          (id, "roomId", "userId", "startDate", "endDate", "guestCount", "createdAt")
        VALUES
          (gen_random_uuid(), $1, $2, $3, $4, $5, now())
        RETURNING *
        `,
        [
          roomId,
          userId,
          start.toDate(),
          end.toDate(),
          guestCount,
        ]
      );

      const booking = bookings[0];

      await client.query(
        `
        UPDATE "RoomAvailability"
        SET "isAvailable" = false
        WHERE "roomId" = $1
          AND date = ANY($2)
        `,
        [roomId, days]
      );

      await client.query("COMMIT");

      // Pub/Sub event 
      await publishBookingCreated({
        bookingId: booking.id,
        roomId,
        userId,
        startDate,
        endDate,
      });

      return booking;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  static async getUserBookings(userId: string) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM "Booking"
      WHERE "userId" = $1
      ORDER BY "createdAt" DESC
      `,
      [userId]
    );

    return rows;
  }
}
