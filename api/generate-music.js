const SUNO_API_BASE_URL = 'https://api.sunoapi.org';

// Handler principal de la fonction Vercel
export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleStartGeneration(req, res);
  } else if (req.method === 'GET') {
    return handleCheckStatus(req, res);
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}

// Démarre la génération et retourne un taskId
async function handleStartGeneration(req, res) {
  try {
    const response = await fetch(`${SUNO_API_BASE_URL}/api/v1/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    if (response.status !== 200) throw new Error(data.msg);
    return res.status(200).json({ taskId: data.data.taskId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Vérifie le statut d'une génération via son taskId
async function handleCheckStatus(req, res) {
  try {
    const { taskId } = req.query;
    if (!taskId) return res.status(400).json({ error: 'Task ID is required' });

    const response = await fetch(`${SUNO_API_BASE_URL}/api/v1/generate/record-info?taskId=${taskId}`, {
      headers: { 'Authorization': `Bearer ${process.env.SUNO_API_KEY}` },
    });
    const data = await response.json();
    if (response.status !== 200) throw new Error(data.msg);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
