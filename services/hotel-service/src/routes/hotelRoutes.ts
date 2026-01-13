import { Router } from "express";
import { HotelController } from "../controllers/hotelController";

const router = Router();

router.get("/hotels", HotelController.listHotels);
router.get("/hotels/:hotelId/rooms", HotelController.getHotelRooms);
router.get("/rooms/:roomId/availability", HotelController.getRoomAvailability);

export default router;
