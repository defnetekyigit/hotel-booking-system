import dayjs from "dayjs";
import { pool } from "../db";

type SearchParams = {
  city: string;
  guests?: number;
  startDate?: string;
  endDate?: string;
  isLoggedIn: boolean;
  page: number;
  limit: number;
};

export class SearchService {
  static async search(params: SearchParams) {
    const { city, guests, startDate, endDate, isLoggedIn, page, limit } =
      params;

    const offset = (page - 1) * limit;

    const hasDateRange = Boolean(startDate && endDate);

    if (!hasDateRange) {
      return this.searchWithoutDate({
        city,
        guests,
        page,
        limit,
        offset,
      });
    }

    return this.searchWithDate({
      city,
      guests,
      startDate: startDate!,
      endDate: endDate!,
      isLoggedIn,
      page,
      limit,
      offset,
    });
  }

  private static async searchWithoutDate(params: {
    city: string;
    guests?: number;
    page: number;
    limit: number;
    offset: number;
  }) {
    const { city, guests, limit, offset, page } = params;

    const { rows } = await pool.query(
      `
      SELECT
        r.id,
        r.type,
        r.capacity,
        r."basePrice",
        h.id   AS "hotelId",
        h.name AS "hotelName",
        h.city,
        h.country,
        h.address
      FROM "Room" r
      JOIN "Hotel" h ON h.id = r."hotelId"
      WHERE
        h.city = $1
        AND ($2::int IS NULL OR r.capacity >= $2)
      ORDER BY h.name
      LIMIT $3 OFFSET $4
      `,
      [city, guests ?? null, limit, offset]
    );

    return {
      meta: {
        page,
        limit,
        total: rows.length,
        totalPages: 1,
      },
      items: rows.map((r) => ({
        id: r.id,
        type: r.type,
        capacity: r.capacity,
        basePrice: r.basePrice,
        hotel: {
          id: r.hotelId,
          name: r.hotelName,
          city: r.city,
          country: r.country,
          address: r.address,
        },
      })),
    };
  }

  private static async searchWithDate(params: {
    city: string;
    guests?: number;
    startDate: string;
    endDate: string;
    isLoggedIn: boolean;
    page: number;
    limit: number;
    offset: number;
  }) {
    const {
      city,
      guests,
      startDate,
      endDate,
      isLoggedIn,
      page,
      limit,
      offset,
    } = params;

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
            'price', ROUND((ra.price * $6)::numeric, 2)
          )
          ORDER BY ra.date
        ) AS availability
      FROM "Room" r
      JOIN "Hotel" h ON h.id = r."hotelId"
      JOIN "RoomAvailability" ra ON ra."roomId" = r.id
      WHERE
        h.city = $1
        AND ($2::int IS NULL OR r.capacity >= $2)
        AND ra.date BETWEEN $3 AND $4
        AND ra."isAvailable" = true
      GROUP BY r.id, h.id
      HAVING COUNT(ra.id) = $5
      ORDER BY h.name
      LIMIT $7 OFFSET $8
      `,
      [
        city,
        guests ?? null,
        start.toDate(),
        end.toDate(),
        requiredDays,
        discountMultiplier,
        limit,
        offset,
      ]
    );

    return {
      meta: {
        page,
        limit,
        total: rows.length,
        totalPages: 1,
      },
      items: rows.map((row) => ({
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
      })),
    };
  }
}
