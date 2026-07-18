import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: string;
  userName: string;
  userEmail: string;
  tripId: mongoose.Types.ObjectId;
  travelDate: Date;
  travelers: number;
  contactPhone: string;
  totalPrice: number;
  status: "confirmed" | "cancelled";
  createdAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    travelDate: { type: Date, required: true },
    travelers: { type: Number, required: true, min: 1 },
    contactPhone: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);