import { Request, Response } from "express";
import Trip from "../models/Trip";
import { getRecommendations } from "../services/geminiService";

// @desc    Get AI-powered personalized trip recommendations
// @route   POST /api/recommendations
export const getPersonalizedRecommendations = async (req: Request, res: Response) => {
  try {
    const { budget, interests, preferredCategory } = req.body;

    // Fetch all available trips to give the AI context
    const allTrips = await Trip.find({}).limit(50);

    if (allTrips.length === 0) {
      return res.status(200).json({ success: true, data: [], message: "কোনো trip পাওয়া যায়নি" });
    }

    const tripSummaries = allTrips.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      category: t.category,
      price: t.price,
      location: t.location,
      rating: t.rating,
      shortDescription: t.shortDescription,
    }));

    const recommendedIds = await getRecommendations(tripSummaries, {
      budget,
      interests,
      preferredCategory,
    });

    // Map back to full trip objects, preserving AI's ranking order
    const recommendedTrips = recommendedIds
      .map((id: string) => allTrips.find((t) => t._id.toString() === id))
      .filter(Boolean);

    res.status(200).json({ success: true, data: recommendedTrips });
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ success: false, message: "Recommendation তৈরি করতে সমস্যা হয়েছে", error: String(error) });
  }
};