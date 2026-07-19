import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage extends Document {
  userId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

const ChatMessageSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);