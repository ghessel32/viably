export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { q, restrict_sr, type, sort, t, limit } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const params = new URLSearchParams({
      q,
      restrict_sr: restrict_sr || '0',
      type: type || 'link',
      sort: sort || 'relevance',
      t: t || 'month',
      limit: limit || '6',
    });

    const url = `https://api.reddit.com/search/?${params}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Viably/1.0 (by /u/FlowerSoft297)',
      },
    });

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Reddit API Error:', error);
    res.status(500).json({ error: 'Failed to fetch from Reddit' });
  }
}