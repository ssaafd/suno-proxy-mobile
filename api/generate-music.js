// api/generate-music.js (version compatible Vercel CommonJS)

module.exports = async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { prompt, style, title } = req.body;

  if (!prompt || !style || !title) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  try {
    const response = await fetch('https://api.sunoapi.org/api/v1/generate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        style,
        title,
        customMode: true,
        instrumental: false,
        model: 'V4_5',
        callBackUrl: '',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data?.data?.taskId) {
      console.error('Erreur API Suno:', data);
      return res.status(response.status || 500).json({ error: data?.msg || 'Erreur Suno inconnue' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Erreur serveur interne:', err);
    res.status(500).json({ error: 'Erreur serveur interne', details: err.message });
  }
};