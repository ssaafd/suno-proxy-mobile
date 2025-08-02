export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { taskId } = req.query;
  if (!taskId) return res.status(400).json({ error: 'taskId requis' });

  try {
    const result = await fetch(`https://studio-api.suno.ai/api/v1/generate/record-info?taskId=${taskId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const json = await result.json();

    if (!result.ok) {
      return res.status(result.status).json({ error: json.msg || 'Erreur check status' });
    }

    return res.status(200).json(json.data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}