import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_CONTEXT = `তুমি TripMind AI এর একজন বন্ধুসুলভ ট্রাভেল অ্যাসিস্ট্যান্ট। তুমি ইউজারকে ট্রিপ প্ল্যানিং, ডেস্টিনেশন সাজেশন এবং আমাদের প্ল্যাটফর্মে নেভিগেট করতে সাহায্য করো।

আমাদের প্ল্যাটফর্মে এই ধরনের trip আছে: beach, mountain, city, adventure, cultural — মূলত বাংলাদেশের বিভিন্ন destination (Cox's Bazar, Sylhet, Bandarban, Sundarbans, Rangamati, Dhaka ইত্যাদি)।

উত্তর সংক্ষিপ্ত, বন্ধুত্বপূর্ণ এবং সহায়ক রাখো। ইউজার বাংলা বা ইংরেজি যেভাবে লিখবে, সেভাবেই উত্তর দাও। ট্রিপ সম্পর্কিত প্রশ্ন না হলেও ভদ্রভাবে সাহায্য করার চেষ্টা করো, কিন্তু ট্রাভেল টপিকের দিকে কথোপকথন ফিরিয়ে আনার চেষ্টা করো।`;

interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

export async function getChatResponse(
  history: ChatHistoryItem[],
  newMessage: string
): Promise<string> {
  const contents = [
    ...history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
    { role: "user", parts: [{ text: newMessage }] },
  ];

  const response = await ai.models.generateContent({
   model: "gemini-flash-latest",
    contents,
    config: {
      systemInstruction: SYSTEM_CONTEXT,
    },
  });

  return response.text || "দুঃখিত, উত্তর দিতে সমস্যা হচ্ছে। আবার চেষ্টা করো।";
}

export async function getFollowUpSuggestions(
  lastAiResponse: string
): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
     model: "gemini-flash-latest",
      contents: `এই AI উত্তরের ভিত্তিতে ইউজার পরবর্তীতে যা জিজ্ঞেস করতে পারে এমন ৩টা ছোট (৫-৭ শব্দের) follow-up প্রশ্ন সাজেস্ট করো। শুধু JSON array ফরম্যাটে দাও, অন্য কিছু লিখো না: ["প্রশ্ন ১", "প্রশ্ন ২", "প্রশ্ন ৩"]\n\nAI উত্তর: "${lastAiResponse}"`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
  } catch {
    return [];
  }
}
interface TripSummary {
  id: string;
  title: string;
  category: string;
  price: number;
  location: string;
  rating: number;
  shortDescription: string;
}

interface RecommendationPreferences {
  budget?: number;
  interests?: string;
  preferredCategory?: string;
}

export async function getRecommendations(
  trips: TripSummary[],
  preferences: RecommendationPreferences
): Promise<string[]> {
  const prompt = `তুমি একজন ট্রাভেল রেকোমেন্ডেশন ইঞ্জিন। নিচে উপলব্ধ trip গুলোর তালিকা দেওয়া হলো (JSON আকারে), এবং ইউজারের পছন্দ। ইউজারের পছন্দ অনুযায়ী সবচেয়ে ভালো ম্যাচ হওয়া সর্বোচ্চ ৬টা trip এর ID, priority অনুযায়ী সাজিয়ে দাও।

শুধুমাত্র একটা JSON array ফরম্যাটে trip ID গুলো দাও, অন্য কোনো লেখা/ব্যাখ্যা দিও না। ফরম্যাট: ["id1", "id2", "id3"]

উপলব্ধ Trips:
${JSON.stringify(trips)}

ইউজারের পছন্দ:
- বাজেট: ${preferences.budget ? `৳${preferences.budget} পর্যন্ত` : "নির্দিষ্ট নেই"}
- আগ্রহ: ${preferences.interests || "নির্দিষ্ট নেই"}
- পছন্দের ক্যাটাগরি: ${preferences.preferredCategory || "যেকোনো"}

উপরের তথ্য অনুযায়ী trip ID এর array দাও:`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to get recommendations:", error);
    // Fallback: return top-rated trips if AI fails
    return trips
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
      .map((t) => t.id);
  }
}