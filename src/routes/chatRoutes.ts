import { Router } from "express";
import { getChatHistory, sendMessage, clearChatHistory } from "../controllers/chatController";
import { requireAuth } from "../middleware/requireAdmin";

const router = Router();

router.get("/history", requireAuth, getChatHistory);
router.post("/message", requireAuth, sendMessage);
router.delete("/history", requireAuth, clearChatHistory);

export default router;