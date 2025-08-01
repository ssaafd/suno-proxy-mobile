// Fichier : api/generate-music.js

const fetch = require('node-fetch');

module.exports = async (request, response) => {
  // On autorise explicitement votre boutique Shopify.
  const allowedOrigin = 'https://s164ub-mw.myshopify.com';

  response.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Si le navigateur envoie une requête de vérification (OPTIONS), on répond OK.
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // On s'assure que la méthode est POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Méthode non autorisée.' });
  }

  try {
    const { prompt } = request.body;
    if (!prompt) {
      return response.status(400).json({ error: 'La description (prompt) est manquante.' });
    }

    const apiKey = process.env.SUNO_API_KEY;
    if (!apiKey) {
      throw new Error("La clé API Suno (SUNO_API_KEY) n'est pas configurée sur Vercel.");
    }

    const sunoResponse = await fetch('https://api.suno.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    if (!sunoResponse.ok) {
      const errorText = await sunoResponse.text();
      console.error("Erreur de l'API Suno:", errorText);
      throw new Error(`L'API de Suno a retourné une erreur: ${sunoResponse.statusText}`);
    }

    const musicData = await sunoResponse.json();
    return response.status(200).json(musicData);

  } catch (error) {
    console.error('Erreur interne du proxy:', error.message);
    return response.status(500).json({ error: error.message });
  }
};
