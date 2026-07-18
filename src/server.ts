import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import connectDB from "./config/db";
import { auth } from "./config/auth";
import tripRoutes from "./routes/tripRoutes";
import chatRoutes from "./routes/chatRoutes";
import recommendationRoutes from "./routes/recommendationRoutes";

import contactRoutes from "./routes/contactRoutes";
import bookingRoutes from "./routes/bookingRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS must be configured before auth routes
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Better Auth handler - must be BEFORE express.json()
app.all("/api/auth/*splat", toNodeHandler(auth));

// Regular JSON middleware for other routes
app.use(express.json());

// API routes
app.use("/api/trips", tripRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/recommendations", 
    recommendationRoutes);


    app.use("/api/contact", contactRoutes);
    app.use("/api/bookings", bookingRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "TripMind AI backend is running" });
});

// Connect to MongoDB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});