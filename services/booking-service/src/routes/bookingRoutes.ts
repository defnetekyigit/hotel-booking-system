import { Router } from "express";
import { BookingController } from "../controllers/bookingController";

const router = Router();

router.post("/", BookingController.create);
router.get("/", BookingController.list);
export default router;
