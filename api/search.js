export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { q, api_key } = req.query;

  if (!q || !api_key) {
    return res.status(400).json({ error: 'Missing query or api_key' });
  }

  try {
    const params = new URLSearchParams({
      q,
      api_key,
      num: '5',
      engine: 'google',
      output: 'json'
    });

    const response = await fetch(`https://serpapi.com/search?${params.toString()}`);
    const data = await response.json();

    if (data.error) {
      return res.status(403).json({ error: data.error });
    }

    const results = (data.organic_results || []).map(r => ({
      title: r.title || '',
      link: r.link || '',
      snippet: r.snippet || ''
    }));

    return res.status(200).json({ results });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
