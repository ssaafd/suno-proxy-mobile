export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { title, prompt, tags, instrumental } = req.body;

  try {
    const sunoRes = await fetch('https://api.suno.ai/api/v1/generate/music', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer caa204a1f65a2762cc234531c1d28e74',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        prompt,
        tags,
        model: 'chirp-v3-5',
        instrumental
      })
    });

    const data = await sunoRes.json();
    res.status(200).json({ task_id: data?.data?.taskId || null });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}