import mongoose, { Schema, Document } from "mongoose";

export interface ITrip extends Document {
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  date: Date;
  location: string;
  category: "beach" | "mountain" | "city" | "adventure" | "cultural";
  rating: number;
  images: string[];
  duration: string;
  groupSize: string;
  included: string[];
  excluded: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: 200,
    },
    fullDescription: {
      type: String,
      required: [true, "Full description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["beach", "mountain", "city", "adventure", "cultural"],
      required: [true, "Category is required"],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    images: {
      type: [String],
      default: [],
    },
    duration: {
      type: String,
      default: "",
    },
    groupSize: {
      type: String,
      default: "",
    },
    included: {
      type: [String],
      default: [],
    },
    excluded: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITrip>("Trip", TripSchema);