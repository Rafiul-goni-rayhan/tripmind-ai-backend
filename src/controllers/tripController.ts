import { Request, Response } from "express";
import Trip from "../models/Trip";

// @desc    Get all trips with search, filter, sort, pagination
// @route   GET /api/trips
export const getTrips = async (req: Request, res: Response) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      minRating,
      sort,
      page = "1",
      limit = "8",
    } = req.query;

    const filter: any = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q as string, $options: "i" } },
        { location: { $regex: q as string, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { rating: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [trips, total] = await Promise.all([
      Trip.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Trip.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: trips,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch trips", error });
  }
};

// @desc    Get single trip by ID
// @route   GET /api/trips/:id
export const getTripById = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    // Related trips: same category, excluding current trip
    const relatedTrips = await Trip.find({
      category: trip.category,
      _id: { $ne: trip._id },
    }).limit(4);

    res.status(200).json({ success: true, data: trip, related: relatedTrips });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch trip", error });
  }
};

// @desc    Create a new trip
// @route   POST /api/trips
export const createTrip = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;
    const tripData = { ...req.body, createdBy: currentUser.id };

    const trip = await Trip.create(tripData);
    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to create trip", error });
  }
};

// @desc    Update a trip
// @route   PUT /api/trips/:id
export const updateTrip = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to update trip", error });
  }
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    const currentUser = (req as any).user;
    const isOwner = trip.createdBy.toString() === currentUser.id;
    const isAdmin = currentUser.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "শুধুমাত্র নিজের trip অথবা admin হলেই delete করা যাবে",
      });
    }

    await Trip.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete trip", error });
  }
};

// @desc    Get trips created by a specific user
// @route   GET /api/trips/user/:userId
export const getTripsByUser = async (req: Request, res: Response) => {
  try {
    const trips = await Trip.find({ createdBy: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: trips });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user trips", error });
  }
};