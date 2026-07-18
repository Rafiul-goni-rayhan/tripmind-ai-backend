import { Router } from "express";
import {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripsByUser,
} from "../controllers/tripController";
import { requireAuth, requireAdmin } from "../middleware/requireAdmin";

const router = Router();

// Public routes
router.get("/", getTrips);
router.get("/user/:userId", getTripsByUser);
router.get("/:id", getTripById);

// Protected routes (login required)
router.post("/", requireAdmin, createTrip);
router.put("/:id", requireAuth, updateTrip);
router.delete("/:id", requireAuth, deleteTrip);

export default router;