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

  const REQ_TIMEOUT = 7000;
  const controller = new AbortController();
  setTimeout(() => controller.abort(), REQ_TIMEOUT);

  const url = `https://www.reddit.com/search.json?${params}`;

  // --- Production-safe headers ---
  const headers = {
    "User-Agent": "ViablyBot/1.0 by u/FlowerSoft297",
    "Accept": "application/json"
  };

  // --- CDN cache for Reddit ---
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");

  try {
    const response = await fetch(url, {
      headers,
      signal: controller.signal
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        source: "reddit",
        status: response.status,
        body: text
      });
    }

    return res.status(200).json(JSON.parse(text));

  } catch (err) {
    return res.status(500).json({
      stage: "server",
      error: err.name === "AbortError" ? "timeout" : err.message
    });
  }
}
