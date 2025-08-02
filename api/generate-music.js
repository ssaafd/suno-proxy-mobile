export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, description, tags } = req.body;

  if (!process.env.SUNO_API_KEY) {
    return res.status(500).json({ error: 'API key not set' });
  }

  try {
    const response = await fetch('https://studio-api.suno.ai/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUNO_API_KEY}`
      },
      body: JSON.stringify({
        title,
        description,
        tags: tags || ''
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: 'API error', details: data });
    }

    res.status(200).json({ taskId: data.id || data.task_id || 'unknown' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}