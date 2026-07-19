import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
} from "../controllers/bookingController";
import { requireAuth, requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.post("/", requireAuth, createBooking);
router.get("/my", requireAuth, getMyBookings);
router.get("/", requireAdmin, getAllBookings);
router.put("/:id/cancel", requireAuth, cancelBooking);

export default router;