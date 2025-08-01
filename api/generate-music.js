const fetch = require('node-fetch');

const SUNO_API_URL = 'https://api.sunoapi.org/api/v1/generate';
const ALLOWED_SHOPIFY_ORIGIN = 'https://s164ub-mw.myshopify.com';

module.exports = async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', ALLOWED_SHOPIFY_ORIGIN);
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Méthode non autorisée.' });
  }

  try {
    const apiKey = process.env.SUNO_API_KEY;
    if (!apiKey) {
      throw new Error("Erreur de configuration: Clé API SUNO_API_KEY manquante sur Vercel.");
    }

    const sunoResponse = await fetch(SUNO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(request.body),
    });

    const responseData = await sunoResponse.json();

    if (!sunoResponse.ok) {
      const errorMessage = responseData.message || responseData.detail || `L'API de Suno a retourné une erreur ${sunoResponse.status}.`;
      throw new Error(errorMessage);
    }

    return response.status(200).json(responseData);

  } catch (error) {
    if (error instanceof SyntaxError) {
        return response.status(500).json({ error: "L'API de Suno a renvoyé une réponse invalide (non-JSON)." });
    }
    return response.status(500).json({ error: error.message });
  }
};
