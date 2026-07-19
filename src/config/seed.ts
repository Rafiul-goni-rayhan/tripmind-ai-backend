import mongoose from "mongoose";
import dotenv from "dotenv";
import Trip from "../models/Trip";

dotenv.config();

const dummyUserId = new mongoose.Types.ObjectId();

const sampleTrips = [
  {
    title: "Cox's Bazar Beach Escape",
    shortDescription: "World's longest natural sea beach with golden sunsets.",
    fullDescription:
      "Experience the breathtaking beauty of Cox's Bazar, home to the world's longest natural sea beach. Enjoy long walks on the sand, fresh seafood, and stunning sunset views over the Bay of Bengal.",
    price: 8500,
    date: new Date("2026-09-15"),
    location: "Cox's Bazar, Bangladesh",
    category: "beach",
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    ],
    duration: "3 Days 2 Nights",
    groupSize: "2-15 people",
    included: ["Hotel stay", "Breakfast", "Beach activities"],
    excluded: ["Airfare", "Personal expenses"],
    createdBy: dummyUserId,
  },
  {
    title: "Sylhet Tea Garden Trail",
    shortDescription: "Rolling green tea gardens and misty hills.",
    fullDescription:
      "Wander through the lush tea gardens of Sylhet, visit Ratargul Swamp Forest, and explore the scenic hills of Jaflong. A perfect escape into nature.",
    price: 6200,
    date: new Date("2026-08-20"),
    location: "Sylhet, Bangladesh",
    category: "mountain",
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1500534623283-312aade485b7",
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
    ],
    duration: "2 Days 1 Night",
    groupSize: "2-10 people",
    included: ["Transport", "Hotel stay", "Guide"],
    excluded: ["Meals", "Entry tickets"],
    createdBy: dummyUserId,
  },
  {
    title: "Dhaka Heritage City Tour",
    shortDescription: "Explore centuries of history in Old Dhaka.",
    fullDescription:
      "Walk through the narrow lanes of Old Dhaka, visit Lalbagh Fort, Ahsan Manzil, and taste authentic street food. A cultural deep-dive into Bangladesh's capital.",
    price: 3500,
    date: new Date("2026-08-05"),
    location: "Dhaka, Bangladesh",
    category: "city",
    rating: 4.3,
    images: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da",
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df",
    ],
    duration: "1 Day",
    groupSize: "2-20 people",
    included: ["Guide", "Transport", "Lunch"],
    excluded: ["Entry fees", "Souvenirs"],
    createdBy: dummyUserId,
  },
  {
    title: "Bandarban Hill Trekking",
    shortDescription: "Adventure trekking through Bangladesh's highest peaks.",
    fullDescription:
      "Challenge yourself with a trek to Nilgiri and Boga Lake in Bandarban. Experience tribal culture, waterfalls, and panoramic mountain views.",
    price: 9800,
    date: new Date("2026-10-01"),
    location: "Bandarban, Bangladesh",
    category: "adventure",
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306",
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5",
    ],
    duration: "4 Days 3 Nights",
    groupSize: "4-12 people",
    included: ["Guide", "Camping gear", "Meals"],
    excluded: ["Transport to Bandarban", "Personal gear"],
    createdBy: dummyUserId,
  },
  {
    title: "Sundarbans Mangrove Safari",
    shortDescription: "Spot Royal Bengal Tigers in the world's largest mangrove forest.",
    fullDescription:
      "Cruise through the waterways of the Sundarbans, spot wildlife including deer, crocodiles, and if lucky, the elusive Royal Bengal Tiger. A once-in-a-lifetime nature experience.",
    price: 12500,
    date: new Date("2026-11-10"),
    location: "Sundarbans, Bangladesh",
    category: "adventure",
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801",
    ],
    duration: "3 Days 2 Nights",
    groupSize: "6-20 people",
    included: ["Boat cruise", "Meals", "Forest permit"],
    excluded: ["Airfare", "Insurance"],
    createdBy: dummyUserId,
  },
  {
    title: "Rangamati Lake Retreat",
    shortDescription: "Peaceful lakeside relaxation amid hill tracts.",
    fullDescription:
      "Relax by the serene Kaptai Lake, visit the hanging bridge, and enjoy tribal handicrafts in Rangamati. Perfect for a calm cultural getaway.",
    price: 5400,
    date: new Date("2026-09-25"),
    location: "Rangamati, Bangladesh",
    category: "cultural",
    rating: 4.4,
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    ],
    duration: "2 Days 1 Night",
    groupSize: "2-15 people",
    included: ["Boat ride", "Hotel stay", "Breakfast"],
    excluded: ["Lunch/Dinner", "Transport"],
    createdBy: dummyUserId,
  },
];

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI not found");

    await mongoose.connect(uri);
    console.log("Connected to MongoDB for seeding...");

    await Trip.deleteMany({});
    console.log("Old trip data cleared.");

    await Trip.insertMany(sampleTrips);
    console.log(`${sampleTrips.length} sample trips inserted successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();