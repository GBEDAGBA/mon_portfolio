// ─────────────────────────────────────────────────────────────
//  controllers/contactController.js — La logique du formulaire
//
//  Le contrôleur, c'est le "chef d'orchestre" :
//    1. Il vérifie que les données sont correctes (validation)
//    2. Il sauvegarde le message en base de données
//    3. Il envoie les emails
//    4. Il répond au frontend (succès ou erreur)
// ─────────────────────────────────────────────────────────────

const { envoyerEmail } = require('../services/emailService');
const { sauvegarderMessage } = require('../services/dbService');

// ── Validation des champs ──────────────────────────────────────
// Cette fonction vérifie que le formulaire est bien rempli.
// Elle retourne un message d'erreur, ou null si tout est OK.
function valider({ nom, email, message }) {
  if (!nom    || nom.trim().length < 2)
    return 'Le nom doit contenir au moins 2 caractères.';
  if (!email  || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return 'Adresse email invalide.';
  if (!message || message.trim().length < 10)
    return 'Le message doit contenir au moins 10 caractères.';
  return null; // null = pas d'erreur
}

// ── Fonction principale ────────────────────────────────────────
// Cette fonction est appelée quand le formulaire est soumis.
async function submitContact(req, res, next) {
  try {
    // 1. On récupère les données envoyées par le formulaire
    const { nom, email, message } = req.body;

    // 2. On valide les données
    const erreur = valider({ nom, email, message });
    if (erreur) {
      // Si erreur → on renvoie le message d'erreur au frontend
      return res.status(400).json({ success: false, message: erreur });
    }

    // 3. On nettoie les données (supprime les espaces inutiles)
    const donnees = {
      nom:     nom.trim(),
      email:   email.trim().toLowerCase(),
      message: message.trim(),
    };

    // 4. On sauvegarde en base de données
    const sauvegarde = await sauvegarderMessage(donnees);
    console.log(`✅ Message #${sauvegarde.id} enregistré (${donnees.email})`);

    // 5. On envoie les emails
    await envoyerEmail(donnees);
    console.log(`✅ Email envoyé à ${donnees.email}`);

    // 6. On répond au frontend : succès !
    return res.status(200).json({
      success: true,
      message: 'Message envoyé ! Je vous répondrai sous 24h. 😊',
    });

  } catch (err) {
    // En cas d'erreur inattendue, on la transmet au gestionnaire d'erreurs
    next(err);
  }
}

module.exports = { submitContact };