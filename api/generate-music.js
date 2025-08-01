// Fichier : api/generate-music.js
// Version finale utilisant la syntaxe CommonJS pour une compatibilité maximale.

module.exports = async (request, response) => {
  // Gérer la requête de vérification CORS (pre-flight)
  // Cela autorise votre page Shopify à communiquer avec ce proxy.
  response.setHeader('Access-Control-Allow-Origin', '*'); // Autorise toutes les origines
  response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  // S'assurer que la méthode est POST
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Méthode non autorisée. Seule la méthode POST est acceptée.' });
    return;
  }

  try {
    const { prompt } = request.body;

    if (!prompt) {
      response.status(400).json({ error: 'La description (prompt) est manquante.' });
      return;
    }

    // NOTE : Vérifiez la documentation officielle de Suno pour l'URL exacte de l'API.
    const sunoApiUrl = 'https://api.suno.ai/v1/generate';
    const apiKey = process.env.SUNO_API_KEY;

    if (!apiKey) {
      // Cette erreur est levée si la clé API n'est pas configurée dans Vercel
      throw new Error("La clé API Suno (SUNO_API_KEY) n'est pas configurée sur Vercel.");
    }

    const sunoResponse = await fetch(sunoApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        // Autres paramètres éventuels ici
      }),
    });

    if (!sunoResponse.ok) {
      const errorText = await sunoResponse.text();
      console.error("Erreur de l'API Suno:", errorText);
      // Transférer l'erreur de Suno au client
      throw new Error(`L'API de Suno a retourné une erreur: ${sunoResponse.statusText}`);
    }

    const musicData = await sunoResponse.json();

    // Renvoyer la réponse de Suno au client (Shopify)
    response.status(200).json(musicData);

  } catch (error) {
    console.error('Erreur interne du proxy:', error.message);
    // Renvoyer un message d'erreur clair à Shopify
    response.status(500).json({ error: error.message });
  }
};
