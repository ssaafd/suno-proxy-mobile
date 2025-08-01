// Fichier : api/generate-music.js

// Définir la configuration pour Vercel pour qu'il gère bien la requête
export const config = {
  runtime: 'edge',
};

export default async function handler(request) {

  // Gérer la requête de vérification CORS (pre-flight)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*', // Autorise toutes les origines pour la simplicité
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // S'assurer que la méthode est POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Méthode non autorisée' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'La description (prompt) est manquante.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // NOTE : Vérifiez la documentation officielle de Suno pour l'URL exacte de l'API.
    const sunoApiUrl = 'https://api.suno.ai/v1/generate';
    const apiKey = process.env.SUNO_API_KEY;

    if (!apiKey) {
      throw new Error("La clé API Suno n'est pas configurée sur Vercel.");
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
      throw new Error("L'API de Suno a retourné une erreur.");
    }

    const musicData = await sunoResponse.json();

    // Renvoyer la réponse de Suno au client (Shopify)
    return new Response(JSON.stringify(musicData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Autorise toutes les origines
      },
    });

  } catch (error) {
    console.error('Erreur interne du proxy:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, // Erreur interne du serveur
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Autorise toutes les origines
      },
    });
  }
}

