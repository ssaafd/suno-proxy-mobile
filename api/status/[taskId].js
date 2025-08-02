
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { taskId } = req.query;
  if (!taskId) {
    return res.status(400).json({ error: 'Missing taskId' });
  }

  try {
    const response = await fetch(`https://api.suno.ai/api/v1/generate/record-info?taskId=${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.SUNO_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.msg || 'Status error'
      });
    }

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
