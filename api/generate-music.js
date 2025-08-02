export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { title, prompt, tags } = req.body;

  try {
    const response = await fetch("https://studio-api.suno.ai/api/v1/generate/v2/", {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SUNO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        prompt,
        tags,
        make_instrumental: false,
        continue_at: null,
        mv: "chirp-v3-5",
        callbackUrl: `${process.env.CALLBACK_URL}/api/callback`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.msg || 'Erreur génération' });
    }

    return res.status(200).json({ task_id: data.task_id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}