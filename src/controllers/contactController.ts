import { Request, Response } from "express";
import Contact from "../models/Contact";

// @desc    Submit a contact form message
// @route   POST /api/contact
export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "সব ফিল্ড পূরণ করা প্রয়োজন" });
    }

    const contact = await Contact.create({ name, email, subject, message });
    res.status(201).json({ success: true, data: contact, message: "মেসেজ সফলভাবে পাঠানো হয়েছে" });
  } catch (error) {
    res.status(500).json({ success: false, message: "মেসেজ পাঠাতে সমস্যা হয়েছে", error });
  }
};