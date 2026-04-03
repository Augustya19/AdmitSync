

export const askHuggingFace = async (prompt) => {
  try {
    const res = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt
        })
      }
    );

    const data = await res.json();

    return data[0]?.generated_text || "No response from fallback AI.";

  } catch (err) {
    console.error("HF error:", err);
    return "⚠️ Backup AI also failed.";
  }
};