export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { title, prompt, tags } = req.body;

  if (!title || !prompt || !tags) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  try {
    const response = await fetch('https://studio-api.suno.ai/api/generate/v2/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SUNO_API_KEY}`,
      },
      body: JSON.stringify({
        title: title,
        prompt: prompt,
        tags: tags,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Erreur Suno:', result);
      return res.status(response.status).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
}