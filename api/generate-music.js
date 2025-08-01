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
      throw new Error("Erreur de configuration: Clé API SUNO_API_KEY manquante.");
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
      throw new Error(responseData.message || `Erreur de l'API Suno.`);
    }
    return response.status(200).json(responseData);

  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};
