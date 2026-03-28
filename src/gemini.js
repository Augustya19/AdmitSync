import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDLDcayYBgKpgPpRv4LRaQx8s_kFpKlpbE");

const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
});

export async function fetchExamData(query) {
    console.log("👉 Gemini called with:", query);

    const prompt = `
User searched: "${query}"

Give Indian exam details in JSON:

{
  "name": "",
  "full": "",
  "stream": "engineering/medical/management/law/design/general",
  "link": "",
  "deadlines": [
    { "type": "", "date": "YYYY-MM-DD" }
  ]
}

Only JSON.
`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        console.log("👉 Gemini raw:", text);

        const cleaned = text.replace(/```json|```/g, "").trim();

        return JSON.parse(cleaned);
    } catch (err) {
        console.error("❌ Gemini error:", err);
        return null;
    }
}