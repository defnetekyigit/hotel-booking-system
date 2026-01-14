import dayjs from "dayjs";
import { pool } from "../db";

export class SearchService {
  static async searchAvailableRooms(params: {
    city: string;
    startDate: string;
    endDate: string;
    guests: number;
    isLoggedIn: boolean;
  }) {
    const { city, startDate, endDate, guests, isLoggedIn } = params;

    const start = dayjs(startDate).startOf("day");
    const end = dayjs(endDate).startOf("day");

    if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
      throw new Error("Invalid date range");
    }

    const requiredDays = end.diff(start, "day") + 1;

    const discountMultiplier = isLoggedIn ? 0.9 : 1;

    const { rows } = await pool.query(
      `
      SELECT
        r.id              AS "roomId",
        r.type            AS "roomType",
        r.capacity,
        r."basePrice",
        h.id              AS "hotelId",
        h.name            AS "hotelName",
        h.city,
        h.country,
        h.address,
        json_agg(
          json_build_object(
            'date', ra.date,
            'price', ROUND(ra.price * $6, 2)
          )
          ORDER BY ra.date
        ) AS availability
      FROM "Room" r
      JOIN "Hotel" h ON h.id = r."hotelId"
      JOIN "RoomAvailability" ra ON ra."roomId" = r.id
      WHERE
        h.city = $1
        AND r.capacity >= $2
        AND ra.date BETWEEN $3 AND $4
        AND ra."isAvailable" = true
      GROUP BY r.id, h.id
      HAVING COUNT(ra.id) = $5
      `,
      [
        city,
        guests,
        start.toDate(),
        end.toDate(),
        requiredDays,
        discountMultiplier,
      ]
    );

    return rows.map((row) => ({
      id: row.roomId,
      type: row.roomType,
      capacity: row.capacity,
      basePrice: row.basePrice,
      hotel: {
        id: row.hotelId,
        name: row.hotelName,
        city: row.city,
        country: row.country,
        address: row.address,
      },
      availability: row.availability,
    }));
  }
}
