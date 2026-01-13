import { pool } from "../db";

export class HotelService {
  static async listHotels() {
    const { rows } = await pool.query(`
      SELECT id, name, city, country, address
      FROM "Hotel"
    `);

    return rows;
  }

  static async getHotelRooms(hotelId: string) {
    const { rows } = await pool.query(
      `
      SELECT id, type, capacity, "basePrice"
      FROM "Room"
      WHERE "hotelId" = $1
      `,
      [hotelId]
    );

    return rows;
  }

  static async getRoomAvailability(roomId: string) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM "RoomAvailability"
      WHERE "roomId" = $1
        AND "isAvailable" = true
      ORDER BY date ASC
      `,
      [roomId]
    );

    return rows;
  }
}
