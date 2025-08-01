const fetch = require('node-fetch');

// L'URL de l'API a été corrigée pour pointer vers l'endpoint utilisé par la communauté.
const SUNO_API_URL = 'https://studio-api.suno.ai/api/generate'; 
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
    const { prompt } = request.body;
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return response.status(400).json({ error: 'Le paramètre "prompt" est manquant ou invalide.' });
    }

    const apiKey = process.env.SUNO_API_KEY;
    if (!apiKey) {
      console.error('Erreur critique : La variable d\'environnement SUNO_API_KEY est manquante.');
      throw new Error("Erreur de configuration du serveur.");
    }

    const sunoPayload = {
      prompt: prompt.trim(),
      is_custom: false,
      is_instrumental: false,
      wait_audio: true,
    };

    const sunoResponse = await fetch(SUNO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(sunoPayload),
    });

    const responseData = await sunoResponse.json();

    if (!sunoResponse.ok) {
      console.error("Réponse d'erreur de l'API Suno:", responseData);
      throw new Error(responseData.detail || `L'API de Suno a retourné une erreur ${sunoResponse.status}.`);
    }

    return response.status(200).json(responseData);

  } catch (error) {
    console.error('Erreur interne du proxy:', error.message);
    return response.status(500).json({ error: error.message || 'Une erreur inattendue est survenue.' });
  }
};
