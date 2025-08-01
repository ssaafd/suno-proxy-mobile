export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt, style, title } = req.body;
  if (!prompt || !style || !title) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.sunoapi.org/api/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        style,
        title,
        customMode: true,
        instrumental: false,
        model: 'V4_5',
        callBackUrl: '' // vide pour polling
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.msg || 'API Error' });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}