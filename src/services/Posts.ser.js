import { authService } from "./Authservice";

export async function generateRedditPosts() {
  try {
    const idea = sessionStorage.getItem("idea");
    const insightsData = sessionStorage.getItem("insight");

    if (!idea || !insightsData) {
      throw new Error(
        "Missing required data: idea or insights not found in session"
      );
    }

    const insights = JSON.parse(insightsData);

    const marketDemand = Array.isArray(insights.marketDemand)
      ? insights.marketDemand.join(", ")
      : insights.marketDemand;

    const painPoints = Array.isArray(insights.painPoints)
      ? insights.painPoints.join(", ")
      : insights.painPoints;
    const competitive = Array.isArray(insights.competitive)
      ? insights.competitive.join(", ")
      : insights.competitive;

    const dayKeyPoints = [
      {
        day: 1,
        points: [
          "Lead with problem",
          "Ask specific questions",
          "Mention project casually",
        ],
      },
      {
        day: 2,
        points: [
          "Frame as research",
          "Use pain point language",
          "Be transparent",
        ],
      },
      {
        day: 3,
        points: ["Seek validation", "Show homework done", "Ask for criticism"],
      },
      {
        day: 4,
        points: [
          "Share tangible progress",
          "Be open about limitations",
          "Ask technical questions",
        ],
      },
      {
        day: 5,
        points: [
          "Show differentiation",
          "Invite discussion",
          "Highlight what makes you different",
        ],
      },
      {
        day: 6,
        points: [
          "Lead with insights/data",
          "Provide pure value",
          "Mention project naturally",
        ],
      },
      {
        day: 7,
        points: [
          "Thank community",
          "Share learnings",
          "Soft CTA to follow journey",
        ],
      },
    ];

    const prompt = buildPrompt({
      idea,
      marketDemand,
      painPoints,
      competitive,
      dayKeyPoints,
    });

    const apiKey = import.meta.env.VITE_GEMINI_API;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => null);

      console.error("AI API ERROR:", err); // Full error for debugging

      throw new Error("AI service is temporarily unavailable.");
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    const result = parsePostsFromResponse(text);

    return result;
  } catch (error) {
    console.error("Error generating Reddit posts:", error);
    throw error;
  }
}

/**
 * Builds the prompt for Gemini
 */
function buildPrompt({
  idea,
  marketDemand,
  painPoints,
  competitive,
  dayKeyPoints,
}) {
  const dayKeyPointsArray = JSON.stringify(dayKeyPoints, null, 2);

  return `# 7-Day Reddit Validation Campaign Generator

Generate 7 authentic Reddit posts for idea validation. Posts should feel like genuine founder conversations, NOT marketing.
Also give 5 relevant subreddits for posting.subreddits array of 5 relevant subreddit names (include r/ prefix)

## Inputs
**Idea:** ${idea}

**Insights:**
- Market Demand: ${marketDemand}
- Pain Points: ${painPoints}  
- Competitive Landscape: ${competitive}

**Daily Key Points:** ${dayKeyPointsArray}

## 3-Phase Strategy
**Days 1-3 (LISTEN):** Ask questions, show research, frame as learning. Mention project casually.
**Days 4-5 (SHOW):** Share tangible progress, be transparent about limits, invite technical feedback.
**Days 6-7 (VALUE):** Lead with insights/data, thank community, reference earlier posts, soft CTA.

## Critical Rules
**DO:**
- Sound like real founder (casual, vulnerable, uses "I")
- Lead with value (questions, insights, learnings)
- Weave insights naturally into narrative
- Use specific questions (not "What do you think?")
- Show you've done homework
- 100-200 words, line breaks for readability
- 1-2 emojis max, sparingly

**DON'T:**
- Start with "Hey guys" or "Check out my..."
- Put links in main post
- Compare directly to competitors or claim "better"
- Use jargon (leverage, synergy, disruptive, revolutionary)
- Hard sell or push signups
- List features without context
- Use multiple exclamation marks

## Integration Pattern
- Reference pain points as questions to validate
- Use demand insights to show you understand the space
- Mention competitive gaps to show differentiation (subtly)
- Connect insights to real user problems
- Make it about THEM (their needs, their feedback)

## Output Format
Return ONLY a valid JSON object with subreddits and posts arrays, no markdown formatting:
{
  "subreddits": [
    "r/SaaS",
    "r/Entrepreneur",
    "r/startups",
    "r/SideProject",
    "r/Bootstrapped"
  ],
  "posts": [
    {
      "day": 1,
      "title": "Conversational title 60-80 chars",
      "post": "Post draft with line breaks\\n\\nUse \\\\n for formatting"
    },
    {
      "day": 2,
      "title": "Another conversational title",
      "post": "Second post draft\\n\\nWith proper formatting"
    }
  ]
}


## Quality Checks
- Title: Curiosity-driven, no clickbait
- Hook: First 2 sentences grab attention
- Value: Every post teaches or asks something useful
- CTA: Ends with discussion invitation
- Progression: Days 6-7 reference learnings from Days 1-5
- Authenticity: Reads like founder, not marketer

Generate all 7 posts now. Each should advance the validation journey while providing genuine value to readers.`;
}

/**
 * Parses the AI response and extracts subreddits and posts
 */
function parsePostsFromResponse(text) {
  try {
    // Remove markdown code blocks if present
    let cleanText = text.trim();

    // Remove ```json or ``` markers
    cleanText = cleanText.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    // Parse JSON
    const response = JSON.parse(cleanText);

    // Check if response has the expected structure
    if (!response.subreddits || !response.posts) {
      throw new Error("Invalid response format: missing subreddits or posts");
    }

    const { subreddits, posts } = response;

    // Validate subreddits
    if (!Array.isArray(subreddits) || subreddits.length === 0) {
      throw new Error("Invalid subreddits format: expected non-empty array");
    }

    // Validate posts structure
    if (!Array.isArray(posts) || posts.length !== 7) {
      throw new Error("Invalid posts format: expected array of 7 posts");
    }

    // Validate each post has required fields
    posts.forEach((post, index) => {
      if (!post.day || !post.title || !post.post) {
        throw new Error(`Post ${index + 1} missing required fields`);
      }
    });
    storeData(subreddits, posts);

    return { subreddits, posts };
  } catch (error) {
    console.error("Failed to parse posts:", error);
    console.error("Raw response:", text);
    throw new Error("Failed to parse AI response into posts");
  }
}

/**
 * Retrieves stored posts and subreddits from sessionStorage
 */
export function getStoredPosts() {
  const postsData = sessionStorage.getItem("posts");
  const subredditsData = sessionStorage.getItem("subreddits");

  const posts = postsData ? JSON.parse(postsData) : null;
  const subreddits = subredditsData ? JSON.parse(subredditsData) : null;

  return { posts, subreddits };
}

/**
 * Clears stored posts and subreddits from sessionStorage
 */
export function clearStoredPosts() {
  sessionStorage.removeItem("posts");
  sessionStorage.removeItem("subreddits");
}

async function storeData(subreddit, posts) {
  const _id = sessionStorage.getItem("idea_id");
  authService.setPosts(_id, posts, subreddit);
}
