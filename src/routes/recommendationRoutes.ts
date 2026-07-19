import { Router } from "express";
import { getPersonalizedRecommendations } from "../controllers/recommendationController";
import { requireAuth } from "../middleware/requireAdmin";

const router = Router();

router.post("/", requireAuth, getPersonalizedRecommendations);

export default router;