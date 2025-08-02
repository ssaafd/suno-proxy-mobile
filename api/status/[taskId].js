export default async function handler(req, res) {
  const { taskId } = req.query;
  if (!taskId) return res.status(400).json({ error: 'taskId manquant' });

  try {
    const response = await fetch(`https://api.sunoapi.org/api/v1/generate/record-info?taskId=${taskId}`, {
      headers: { 'Authorization': `Bearer ${process.env.SUNO_API_KEY}` }
    });
    const data = await response.json();
    console.log('Suno API status response:', data);

    const music = data?.data?.response?.sunoData?.[0];
    res.status(200).json({
      status: data.data.status,
      audio_url: music?.audioUrl || null,
      video_url: music?.streamAudioUrl || null,
      cover_url: music?.imageUrl || null
    });
  } catch (err) {
    console.error('status error', err);
    res.status(500).json({ error: 'Erreur interne', details: err.message });
  }
}