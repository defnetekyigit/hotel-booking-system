import { Router } from "express";
import { AdminController } from "../controllers/adminController";

const router = Router();

router.post("/hotels", AdminController.createHotel);
router.post("/rooms", AdminController.createRoom);
router.post(
  "/rooms/:roomId/availability",
  AdminController.createRoomAvailability
);

export default router;
