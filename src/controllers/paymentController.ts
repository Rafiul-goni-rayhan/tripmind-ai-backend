import { Request, Response } from "express";
import Booking from "../models/Booking";
import { createCheckoutSession, getCheckoutSession } from "../services/stripeService";

// @desc    Create Stripe checkout session for a booking
// @route   POST /api/payments/create-checkout-session
export const createPaymentSession = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("tripId");
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking পাওয়া যায়নি" });
    }

    if (booking.userId !== currentUser.id) {
      return res.status(403).json({ success: false, message: "অনুমতি নেই" });
    }

    if (booking.status !== "pending_payment") {
      return res.status(400).json({ success: false, message: "এই booking এর জন্য payment প্রযোজ্য নয়" });
    }

    const tripTitle = (booking.tripId as any)?.title || "Trip Booking";

    const session = await createCheckoutSession({
      bookingId: String(booking._id),
      tripTitle,
      amount: booking.totalPrice,
      customerEmail: booking.userEmail,
    });

    booking.stripeSessionId = session.id;
    await booking.save();

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: "Payment session তৈরি করতে সমস্যা হয়েছে", error });
  }
};

// @desc    Verify payment after Stripe redirect and confirm booking
// @route   GET /api/payments/verify/:sessionId
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await getCheckoutSession(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ success: false, message: "Payment সম্পন্ন হয়নি" });
    }

    const bookingId = session.metadata?.bookingId;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking পাওয়া যায়নি" });
    }

    if (booking.status === "pending_payment") {
      booking.status = "confirmed";
      await booking.save();
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Payment verify করতে সমস্যা হয়েছে", error });
  }
};