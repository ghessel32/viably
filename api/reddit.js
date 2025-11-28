export default async function handler(req, res) {

  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { q, restrict_sr, type, sort, t, limit } = req.query;
  if (!q) return res.status(400).json({ error: "missing_query" });

  const params = new URLSearchParams({
    q,
    restrict_sr: restrict_sr || "0",
    type: type || "link",
    sort: sort || "relevance",
    t: t || "month",
    limit: limit || "6"
  });

  const url = `https://www.reddit.com/search.json?${params}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "ViablyBot/1.0 by RahulParjapat",
        "Accept": "application/json"
      }
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        redditStatus: response.status,
        redditBody: text
      });
    }

    return res.status(200).json(JSON.parse(text));

  } catch (err) {
    return res.status(500).json({
      stage: "server",
      error: err.message
    });
  }
}
