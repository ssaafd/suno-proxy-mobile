console.log("SUNO_API_KEY:", process.env.SUNO_API_KEY ? '✓ OK' : '⛔ Manquante');export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Methode non autorisée' });

  const { prompt, title } = req.body;
  if (!prompt || !title) return res.status(400).json({ error: 'prompt et title sont requis' });

  try {
    const response = await fetch('https://api.sunoapi.org/api/v1/generate/music', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUNO_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        title,
        tags: [],
        instrumental: false,
        model: 'chirp-v3-5',
        customMode: true
      })
    });

    const data = await response.json();
    console.log('Suno API generate response:', data);

    if (!data?.data?.taskId) {
      return res.status(500).json({ error: 'Erreur Suno, pas de taskId', raw: data });
    }

    res.status(200).json({ task_id: data.data.taskId });
  } catch (err) {
    console.error('generate-music error', err);
    res.status(500).json({ error: 'Erreur interne', details: err.message });
  }
}