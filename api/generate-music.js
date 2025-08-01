// Contenu du fichier : api/generate-music.js

export default async function handler(request, response) {
  // Liste des adresses qui ont le droit d'utiliser votre API
  const allowedOrigins = [
    // Votre adresse de boutique en ligne
    'https://s164ub-mw.myshopify.com',
    // L'ancienne adresse de prévisualisation (au cas où)
    'https://qj2ls3fvu8igkzlj-93046800727.shopifypreview.com'
  ];

  const origin = request.headers.origin;
  if (allowedOrigins.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    return response.status(403).json({ error: 'Accès non autorisé' });
  }

  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  const { prompt } = request.body;

  if (!prompt) {
    return response.status(400).json({ error: 'La description (prompt) est manquante.' });
  }

  // NOTE : Vérifiez la documentation officielle de Suno pour l'URL exacte de l'API.
  const sunoApiUrl = 'https://api.suno.ai/v1/generate'; 

  try {
    const sunoResponse = await fetch(sunoApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUNO_API_KEY}` 
      },
      body: JSON.stringify({ prompt: prompt })
    });

    if (!sunoResponse.ok) {
      const errorText = await sunoResponse.text();
      console.error("Erreur de l'API Suno:", errorText);
      return response.status(sunoResponse.status).json({ error: "L'API de Suno a retourné une erreur." });
    }

    const musicData = await sunoResponse.json();
    response.status(200).json(musicData);

  } catch (error) {
    console.error('Erreur interne du proxy:', error);
    response.status(500).json({ error: 'Erreur lors de la communication avec l\'API Suno.' });
  }
}
  const { prompt } = request.body;

  if (!prompt) {
    return response.status(400).json({ error: 'La description (prompt) est manquante.' });
  }

  const sunoApiUrl = 'https://api.suno.ai/v1/generate'; 

  try {
    const sunoResponse = await fetch(sunoApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUNO_API_KEY}` 
      },
      body: JSON.stringify({
        prompt: prompt,
      })
    });

    if (!sunoResponse.ok) {
      console.error("Erreur de l'API Suno:", await sunoResponse.text());
      return response.status(sunoResponse.status).json({ error: "L'API de Suno a retourné une erreur." });
    }

    const musicData = await sunoResponse.json();
    response.status(200).json(musicData);

  } catch (error) {
    console.error('Erreur interne du proxy:', error);
    response.status(500).json({ error: 'Erreur lors de la communication avec l\'API Suno.' });
  }
}
