import { Request, Response } from "express";
import { BookingService } from "../services/bookingService";
import { publishBookingCreated } from "../pubsub/publisher";

export class BookingController {
  static async create(req: Request, res: Response) {
    try {
      const { roomId, startDate, endDate, guestCount } = req.body;

      const userId = req.headers["x-user-id"];

      if (!userId || typeof userId !== "string") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!roomId || !startDate || !endDate || !guestCount) {
        return res.status(400).json({
          message: "Missing required fields",
        });
      }

      const booking = await BookingService.createBooking({
        roomId,
        startDate,
        endDate,
        guestCount: Number(guestCount),
        userId,
      });

      await publishBookingCreated({
        bookingId: booking.id,
        roomId: booking.roomId,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
      });

      res.status(201).json(booking);
    } catch (err: any) {
      res.status(400).json({
        message: err.message || "Booking failed",
      });
    }
  }
  // BookingController
  static async list(req: Request, res: Response) {
    const userId = req.headers["x-user-id"];
    if (!userId || typeof userId !== "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bookings = await BookingService.getUserBookings(userId);
    res.json(bookings);
  }
}
