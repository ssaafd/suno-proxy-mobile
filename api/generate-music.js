// /api/generate-music.js
export default async function handler(req, res) {
  // Autorise les requêtes CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { prompt, title, tags, instrumental } = req.body;

    const sunoResponse = await fetch("https://api.sunoapi.org/api/v1/generate/music", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer caa204a1f65a2762cc234531c1d28e74" // Ta clé test ici
      },
      body: JSON.stringify({
        prompt,
        title,
        tags,
        instrumental,
        model: "chirp-v3-5",
        customMode: true
      })
    });

    const data = await sunoResponse.json();

    if (!data?.data?.taskId) {
      return res.status(500).json({ error: "Erreur API", details: data });
    }

    res.status(200).json({ task_id: data.data.taskId });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
}