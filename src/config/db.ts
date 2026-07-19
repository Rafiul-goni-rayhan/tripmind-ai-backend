import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  // If already connected, reuse the connection
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export default connectDB;