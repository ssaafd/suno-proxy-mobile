export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { title, prompt } = req.body;
  const apiKey = process.env.SUNO_API_KEY;

  try {
    const response = await fetch('https://api.sunoapi.org/api/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt,
        title,
        model: "v3",           // ou "v3_5"
        customMode: true,
        instrumental: false,
        tags: []
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: 'Erreur API', details: errText });
    }

    const data = await response.json();
    res.status(200).json(data); // contient taskId, etc.
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
}