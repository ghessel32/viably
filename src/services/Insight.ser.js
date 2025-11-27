import { authService } from "./Authservice";
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API;

export default async function getInsights(posts, idea) {
  try {
    const prompt = `You are an AI product analyst.  
Your job is to extract concise, high-signal market insights from real user discussions.According to the given idea.

Here the idea : ${idea}

Given the Reddit post data below, analyze the content and summarize key insights in exactly this JSON structure:

const insight = {
  marketDemand: [
    "...",
    "...",
    "...",
  ],
  painPoints: [
    "...",
    "...",
    "...",
  ],
  competitive: [
    "...",
    "...",
    "...",
  ],
};

Rules:
- Each field must have 3–4 short but insight-rich bullet points.
- Use natural, research-style phrasing (not robotic or generic).
- Don’t repeat sentences or copy text directly from the post.
- "marketDemand" = what the market is actively seeking or showing interest in.
- "painPoints" = frustrations, limitations, or challenges mentioned or implied.
- "competitive" = insights about current solutions, competitors, or market gaps.
- If a category lacks data, infer insights reasonably from context — but keep them realistic.

Now analyze this Reddit post and produce output only in that structure (no extra text):
${posts}`;

    // Call Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => null);

      console.error("AI API ERROR:", err); // Full error for debugging

      throw new Error("AI service is temporarily unavailable.");
    }

    const data = await response.json();

    // Extract and parse AI-generated insights
    const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const jsonMatch = textResponse.match(/{[\s\S]*}/);
    const insight = jsonMatch ? eval(`(${jsonMatch[0]})`) : null;

    // Store insights in  sessionStorage as an array
    const _id = sessionStorage.getItem("idea_id");
    const { error } = await authService.setInsights(_id, insight);

    if (error) {
      throw new Error("Failed to save insights: " + error.message);
    }

    sessionStorage.setItem("insight", JSON.stringify(insight));

    return { success: 200 };
  } catch (error) {
    console.error("❌ Error fetching insights:", error);
    return { success: 500, error: error.message };
  }
}
