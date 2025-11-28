// api/reddit.js
const CLIENT_ID = "EPITMBPw35Z1GM81NPDdTQ";
const CLIENT_SECRET = "z-ee1qotTn9QDcFyEGx8-Ugm3e66_A";

let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  const now = Date.now();

  if (cachedToken && now < tokenExpiry) {
    return cachedToken; // return cached token if not expired
  }

  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "client_credentials"
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to get Reddit token: ${res.status} ${errText}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = now + (data.expires_in - 30) * 1000; // refresh 30s early
  return cachedToken;
}

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

  try {
    const token = await getAccessToken();

    const url = `https://oauth.reddit.com/search?${params}`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
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
