import { Request, Response, NextFunction } from "express";
import { auth } from "../config/auth";
import { fromNodeHeaders } from "better-auth/node";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.user) {
    return res.status(401).json({ success: false, message: "লগইন করা প্রয়োজন" });
  }

  (req as any).user = session.user;
  next();
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.user) {
    return res.status(401).json({ success: false, message: "লগইন করা প্রয়োজন" });
  }

  if ((session.user as any).role !== "admin") {
    return res.status(403).json({ success: false, message: "এই কাজের জন্য Admin অনুমতি প্রয়োজন" });
  }

  (req as any).user = session.user;
  next();
};