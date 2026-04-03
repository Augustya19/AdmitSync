import { askGemini } from "../gemini";

export const getAIResponse = async (input, exams) => {
  let prompt;

  if (exams.length > 0) {
    prompt = `
User asked: ${input}

Here are relevant exams:
${JSON.stringify(exams, null, 2)}

Suggest the best options and explain briefly.
`;
  } else {
    prompt = input; // fallback → full AI
  }

  const response = await askGemini(prompt);
  return response;
};