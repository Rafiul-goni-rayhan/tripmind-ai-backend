import { Request, Response } from "express";
import Booking from "../models/Booking";
import Trip from "../models/Trip";

// @desc    Create a new booking
// @route   POST /api/bookings
export const createBooking = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;
    const { tripId, travelDate, travelers, contactPhone } = req.body;

    if (!tripId || !travelDate || !travelers || !contactPhone) {
      return res.status(400).json({ success: false, message: "সব ফিল্ড পূরণ করতে হবে" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip পাওয়া যায়নি" });
    }

    const totalPrice = trip.price * Number(travelers);

     const booking = await Booking.create({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      tripId,
      travelDate,
      travelers,
      contactPhone,
      totalPrice,
      status: "pending_payment",
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Booking তৈরি করতে সমস্যা হয়েছে", error });
  }
};

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my
export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;
    const bookings = await Booking.find({ userId: currentUser.id })
      .populate("tripId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Booking লোড করতে সমস্যা হয়েছে", error });
  }
};

// @desc    Get all bookings (admin only)
// @route   GET /api/bookings
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({})
      .populate("tripId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Booking লোড করতে সমস্যা হয়েছে", error });
  }
};

// @desc    Cancel a booking (owner only)
// @route   PUT /api/bookings/:id/cancel
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking পাওয়া যায়নি" });
    }

    const isOwner = booking.userId === currentUser.id;
    const isAdmin = currentUser.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "অনুমতি নেই" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Booking cancel করতে সমস্যা হয়েছে", error });
  }
};