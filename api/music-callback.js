// api/music-callback.js (NOUVEAU FICHIER — À AJOUTER)

export default async function handler(req, res) { if (req.method !== 'POST') { return res.status(405).json({ error: 'Méthode non autorisée' }); }

try { const body = req.body; console.log('[SUNO CALLBACK]', body);

if (!body || !body.title || !body.status) {
  return res.status(400).json({ error: 'Requête invalide — données manquantes' });
}

const { title, status, audio_url, duration } = body;
console.log(`🎵 Nouveau morceau généré : ${title} (${duration}) [${status}]`);
if (audio_url) {
  console.log(`🔗 Audio : ${audio_url}`);
}

return res.status(200).json({ success: true });

} catch (error) { console.error('[ERREUR CALLBACK SUNO]', error); return res.status(500).json({ error: 'Erreur serveur' }); } }

// 🎯 Ce fichier doit être dans le dossier /api/music-callback.js // 🧪 Test en appelant POST sur https://ton-projet.vercel.app/api/music-callback // avec un JSON comme celui-ci : // { //   "title": "Mystic Ceremony", //   "status": "complete", //   "audio_url": "https://example.com/test.mp3", //   "duration": "02:41" // }

// Ensuite, mets ce lien comme callbackUrl dans ta requête POST vers Suno

