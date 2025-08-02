export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { prompt, style, title } = req.body;

  if (!prompt || !style || !title) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  try {
    const sunoResponse = await fetch("https://studio-api.suno.ai/api/generate/v2/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SUNO_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        style,
        title,
        mv: "chirp-v3-0", 
        continue_clip_id: null,
        make_instrumental: false,
        num_generations: 1
      })
    });

    const result = await sunoResponse.json();

    if (!result || !result[0] || !result[0].uuid) {
      return res.status(500).json({ error: 'Réponse Suno invalide', raw: result });
    }

    return res.status(200).json({ task_id: result[0].uuid });

  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
}