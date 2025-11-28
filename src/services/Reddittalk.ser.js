import { authService } from "./Authservice";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API;
const OPENROUTER_MODEL =
  import.meta.env.VITE_MODEL || "openai/gpt-oss-20b:free";

// Time

function timeAgo(utcSeconds) {
  const seconds = Math.floor(Date.now() / 1000) - utcSeconds;
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];
  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

// Generate keywords using AI

async function generateKeywords(rawIdea) {
  const prompt = `You are an AI assistant that helps generate effective Reddit search keywords for startup idea validation.

Task:
Given a startup idea, create exactly 3 short, relevant Reddit-style search keywords about the problem space, user needs, or solution type.

Rules:
- All lowercase
- Concise (2–4 words)
- Use natural Reddit phrasing
- Output ONLY a valid JSON array

Example:
Input: "An AI tool that helps validate startup ideas by analyzing market demand and user feedback from Reddit."
Output: ["startup idea validation", "market research tools"]

Now generate only 2 keywords for this idea:
${rawIdea}`;

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: "user", content: prompt }],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => null);

    console.error("AI API ERROR:", err); // Full error for debugging

    throw new Error("AI service is temporarily unavailable.");
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Failed to parse keywords JSON");

  const keywords = JSON.parse(jsonMatch[0]);
  console.log("🧩 Generated keywords:", keywords);
  return keywords;
}

// Reddit Search (no auth)

async function searchKeyword(keyword) {
  const url = `https://api.reddit.com/search/?q=${encodeURIComponent(
    keyword
  )}&restrict_sr=0&type=link&sort=relevance&t=month&limit=6`;

  const response = await fetch(url);

  if (!response.ok)
    throw new Error(
      `Reddit search failed: ${response.status} ${response.statusText}`
    );

  const data = await response.json();
  const posts = data.data?.children || [];

  return posts.map((p) => {
    const d = p.data;
    return {
      title: d.title,
      subreddit: `r/${d.subreddit}`,
      url: `https://reddit.com${d.permalink}`,
      timeAgo: timeAgo(d.created_utc),
      content: d.selftext || "",
    };
  });
}

// Search all keywords

async function searchAllKeywords(keywords) {
  const results = await Promise.all(keywords.map(searchKeyword));
  const allPosts = results.flat();

  // Deduplicate by URL
  const uniquePosts = Array.from(
    new Map(allPosts.map((p) => [p.url, p])).values()
  );

  return uniquePosts;
}

// =====================
// 🚀 Validate Idea (main export)
// =====================
export async function validateIdea(rawIdea) {
  try {
    const keywords = await generateKeywords(rawIdea);
    const posts = await searchAllKeywords(keywords);
    await storeData(rawIdea, posts);
    return { keywords, posts };
  } catch (err) {
    console.error("❌ Validation failed:", err);
    throw err;
  }
}

// =====================
async function storeData(rawIdea, posts) {
  const { data, error } = await authService.setIdea(rawIdea, posts);
  if (error) {
    console.error("❌ Failed to store Reddit talks:", error);
  }

  sessionStorage.setItem("idea_id", data.id);
}
