import { Request, Response } from "express";
import { HotelService } from "../services/hotelService";

export class HotelController {
  static async listHotels(req: Request, res: Response) {
    const hotels = await HotelService.listHotels();
    res.json(hotels);
  }

  static async getHotelRooms(req: Request, res: Response) {
    const { hotelId } = req.params;
    const rooms = await HotelService.getHotelRooms(hotelId);
    res.json(rooms);
  }

  static async getRoomAvailability(req: Request, res: Response) {
    const { roomId } = req.params;
    const availability =
      await HotelService.getRoomAvailability(roomId);
    res.json(availability);
  }
}
