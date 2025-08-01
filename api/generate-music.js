// Fichier : api/generate-music.js
// Version finale avec autorisation CORS spécifique pour votre boutique.

// Importation nécessaire pour utiliser fetch dans cet environnement
const fetch = require('node-fetch');

module.exports = async (request, response) => {
  // --- DÉBUT DE LA CONFIGURATION CORS ---
  // On définit précisément quel site a le droit de nous appeler.
  // D'après votre screenshot, l'adresse est : https://s164ub-mw.myshopify.com
  const allowedOrigin = 'https://s164ub-mw.myshopify.com';

  response.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Si le navigateur envoie une requête de vérification (OPTIONS), on répond OK.
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }
  // --- FIN DE LA CONFIGURATION CORS ---


  // On s'assure que c'est bien une requête POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Méthode non autorisée.' });
  }

  try {
    // On récupère le prompt envoyé depuis Shopify
    const { prompt } = request.body;

    if (!prompt) {
      return response.status(400).json({ error: 'La description (prompt) est manquante.' });
    }

    // On récupère la clé API secrète depuis les variables d'environnement de Vercel
    const apiKey = process.env.SUNO_API_KEY;

    if (!apiKey) {
      // Cette erreur ne sera visible que dans les logs Vercel, c'est une sécurité.
      throw new Error("La clé API Suno (SUNO_API_KEY) n'est pas configurée sur Vercel.");
    }

    // On appelle l'API de Suno
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

    // On renvoie la réponse de Suno à la page Shopify
    return response.status(200).json(musicData);

  } catch (error) {
    console.error('Erreur interne du proxy:', error.message);
    // On renvoie un message d'erreur clair à Shopify
    return response.status(500).json({ error: error.message });
  }
};
