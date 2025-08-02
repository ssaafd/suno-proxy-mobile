export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { title, tags } = req.body;

  if (!title || !tags) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  try {
    const response = await fetch("https://studio-api.suno.ai/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUNO_API_KEY}`,
      },
      body: JSON.stringify({
        title,
        tags,
        callbackUrl: "https://proxy-mobile.vercel.app/api/music-callback"
      }),
    });

    const data = await response.json();

    if (!data || !data.task_id) {
      return res.status(500).json({ error: 'Aucune tâche créée', raw: data });
    }

    res.status(200).json({ taskId: data.task_id });
  } catch (error) {
    console.error("Erreur génération:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}