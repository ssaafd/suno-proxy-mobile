// Vercel Serverless Function

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, style, title } = req.body;

  const SUNO_API_KEY = process.env.SUNO_API_KEY;

  const response = await fetch('https://api.sunoapi.org/api/v1/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUNO_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt,
      style,
      title,
      customMode: true,
      instrumental: false,
      model: 'V4_5',
      callBackUrl: "" // à compléter si tu veux des callbacks
    })
  });

  const data = await response.json();
  return res.status(200).json(data);
}