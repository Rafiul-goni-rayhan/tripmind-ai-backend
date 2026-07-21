import { Router } from "express";
import { createPaymentSession, verifyPayment } from "../controllers/paymentController";
import { requireAuth } from "../middleware/requireAdmin";

const router = Router();

router.post("/create-checkout-session", requireAuth, createPaymentSession);
router.get("/verify/:sessionId", requireAuth, verifyPayment);

export default router;