// Fichier : api/generate-music.js

export default async function handler(request, response) {
  // --- DÉBUT DE LA CONFIGURATION CORS ---

  // Liste des adresses qui ont le droit d'utiliser votre API
  const allowedOrigins = [
    // 1. L'adresse de prévisualisation que vous m'avez donnée
    'https://qj2ls3fvu8igkzlj-93046800727.shopifypreview.com',
    
    // 2. L'adresse finale de votre boutique (à modifier plus tard)
    // Exemple : 'https://nom-de-ma-boutique.myshopify.com'
    'https://VOTRE-NOM-DE-BOUTIQUE.myshopify.com',

    // 3. Votre nom de domaine personnalisé, si vous en avez un (facultatif)
    // Exemple : 'https://www.mav суперboutique.com'
  ];

  const origin = request.headers.origin;
  if (allowedOrigins.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Si la requête vient d'une adresse inconnue, on la bloque.
    return response.status(403).json({ error: 'Accès non autorisé' });
  }

  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }
  // --- FIN DE LA CONFIGURATION CORS ---


  // La suite du code ne change pas...
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
