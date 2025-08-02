
// ✅ Fichier /api/info/[taskId].js

export default async function handler(req, res) {
  const { taskId } = req.query;

  if (!taskId) {
    return res.status(400).json({ error: "taskId manquant" });
  }

  try {
    const response = await fetch(`https://api.sunoapi.org/api/v1/generate/record-info?taskId=${taskId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.SUNO_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (data.code !== 200) {
      return res.status(500).json({ error: data.msg || "Erreur Suno" });
    }

    return res.status(200).json(data.data);
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
}
