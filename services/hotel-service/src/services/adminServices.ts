import { pool } from "../db";
import dayjs from "dayjs";
import { randomUUID } from "crypto";

export class AdminService {
  static async createHotel(data: {
    name: string;
    city: string;
    country: string;
    address: string;
    adminUserId: string;
  }) {
    const { name, city, country, address, adminUserId } = data;

    const { rows } = await pool.query(
      `
      INSERT INTO "Hotel" (id, name, city, country, address, "adminUserId", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, now(), now())
      RETURNING *
      `,
      [name, city, country, address, adminUserId]
    );

    return rows[0];
  }

  static async createRoom(data: {
    hotelId: string;
    type: string;
    capacity: number;
    basePrice: number;
  }) {
    const { hotelId, type, capacity, basePrice } = data;

    const { rows } = await pool.query(
      `
      INSERT INTO "Room" (id, "hotelId", type, capacity, "basePrice", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, $2, $3, $4, now(), now())
      RETURNING *
      `,
      [hotelId, type, capacity, basePrice]
    );

    return rows[0];
  }

  static async createRoomAvailability(params: {
    roomId: string;
    startDate: string;
    endDate: string;
    price: number;
  }) {
    const { roomId, startDate, endDate, price } = params;

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (!start.isValid() || !end.isValid()) {
      throw new Error("Invalid date format");
    }

    if (end.isBefore(start)) {
      throw new Error("End date must be after start date");
    }

    const values: any[] = [];
    const placeholders: string[] = [];

    let i = 1;
    let current = start;

    while (current.isSame(end) || current.isBefore(end)) {
      placeholders.push(
        `($${i++}, $${i++}, $${i++}, $${i++}, $${i++})`
      );
      values.push(
        randomUUID(),
        roomId,
        current.toDate(),
        price,
        true
      );
      current = current.add(1, "day");
    }

    const query = `
      INSERT INTO "RoomAvailability" (id, "roomId", date, price, "isAvailable")
      VALUES ${placeholders.join(",")}
      ON CONFLICT ("roomId", date) DO NOTHING
    `;

    await pool.query(query, values);

    return { daysCreated: placeholders.length };
  }
}
