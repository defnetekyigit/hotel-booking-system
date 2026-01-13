import { Request, Response } from "express";
import { AdminService } from "../services/adminServices";
import { getAdminUserId } from "../utils/auth";

export class AdminController {
  static async createHotel(req: Request, res: Response) {
    try {
      const { name, city, country, address } = req.body;

      if (!name || !city || !country || !address) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const adminUserId = getAdminUserId(req);

      const hotel = await AdminService.createHotel({
        name,
        city,
        country,
        address,
        adminUserId,
      });

      res.status(201).json(hotel);
    } catch (err: any) {
      console.error("Error creating hotel", err.message);

      const status = err.message === "Admin only" ? 403 : 500;
      res.status(status).json({ message: err.message });
    }
  }

  static async createRoom(req: Request, res: Response) {
    try {
      const { hotelId, type, capacity, basePrice } = req.body;

      if (!hotelId || !type || !capacity || !basePrice) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Admin kontrolü burada da geçerli
      getAdminUserId(req);

      const room = await AdminService.createRoom({
        hotelId,
        type,
        capacity,
        basePrice,
      });

      res.status(201).json(room);
    } catch (err: any) {
      console.error("Error creating room", err.message);

      const status = err.message === "Admin only" ? 403 : 500;
      res.status(status).json({ message: err.message });
    }
  }

  static async createRoomAvailability(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const { startDate, endDate, price } = req.body;

      if (!startDate || !endDate || !price) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Admin kontrolü
      getAdminUserId(req);

      const result = await AdminService.createRoomAvailability({
        roomId,
        startDate,
        endDate,
        price,
      });

      res.status(201).json({
        message: "Availability created",
        ...result,
      });
    } catch (err: any) {
      console.error("createRoomAvailability error:", err.message);

      const status = err.message === "Admin only" ? 403 : 400;
      res.status(status).json({
        message: err.message || "Failed to create availability",
      });
    }
  }
}
