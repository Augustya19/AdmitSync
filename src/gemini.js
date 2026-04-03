import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const askGemini = async (prompt) => {
  try {
    const apiKey = import.meta.env.VITE_HF_API_KEY;
    if (!apiKey) {
      return "Please add VITE_GEMINI_API_KEY to your .env file (see .env.example)";
    }
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const result = await model.generateContent(prompt);
    return await result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return "AI service unavailable. Check your API key and network.";
  }
};

export const fetchExamData = askGemini;
