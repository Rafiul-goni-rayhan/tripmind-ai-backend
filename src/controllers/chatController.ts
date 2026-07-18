import { Request, Response } from "express";
import ChatMessage from "../models/ChatMessage";
import { getChatResponse, getFollowUpSuggestions } from "../services/geminiService";

// @desc    Get chat history for logged-in user
// @route   GET /api/chat/history
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const messages = await ChatMessage.find({ userId }).sort({ createdAt: 1 }).limit(50);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch chat history", error });
  }
};

// @desc    Send a message to the AI assistant
// @route   POST /api/chat/message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // Get recent history for context (last 10 messages)
    const recentHistory = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);
    const history = recentHistory.reverse().map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Save user message
    await ChatMessage.create({ userId, role: "user", content: message });

    // Get AI response
    const aiResponse = await getChatResponse(history, message);

    // Save AI response
    await ChatMessage.create({ userId, role: "assistant", content: aiResponse });

    // Get follow-up suggestions
    const suggestions = await getFollowUpSuggestions(aiResponse);

    res.status(200).json({
      success: true,
      data: { role: "assistant", content: aiResponse },
      suggestions,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ success: false, message: "AI response failed", error: String(error) });
  }
};

// @desc    Clear chat history
// @route   DELETE /api/chat/history
export const clearChatHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    await ChatMessage.deleteMany({ userId });
    res.status(200).json({ success: true, message: "Chat history cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to clear chat history", error });
  }
};