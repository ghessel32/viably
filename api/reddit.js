import fetch from "node-fetch";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { q, restrict_sr, type, sort, t, limit } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const params = new URLSearchParams({
      q,
      restrict_sr: restrict_sr || "0",
      type: type || "link",
      sort: sort || "relevance",
      t: t || "month",
      limit: limit || "6",
    });

    // Use www.reddit.com instead of api.reddit.com and add .json
    const url = `https://www.reddit.com/search.json?${params}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "ViablyBot/1.0 by u/FlowerSoft297",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Reddit API error:", response.status, errorText);
      return res.status(response.status).json({
        redditStatus: response.status,
        redditError: errorText || "Unknown Reddit failure",
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Reddit API Error:", error.message);
    res.status(500).json({
      error: "Failed to fetch from Reddit",
      details: error.message,
    });
  }
}
