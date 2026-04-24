// ─────────────────────────────────────────────────────────────
//  services/dbService.js — Stockage des messages
//
//  On remplace SQLite par un simple fichier JSON.
//  C'est plus simple, aucune compilation nécessaire !
//
//  Les messages sont sauvegardés dans : db/messages.json
//  Vous pouvez l'ouvrir dans VS Code pour voir les messages reçus.
// ─────────────────────────────────────────────────────────────

const fs   = require('fs');
const path = require('path');

// Chemin vers le fichier de stockage
const DOSSIER_DB = path.join(__dirname, '..', 'db');
const FICHIER_DB = path.join(DOSSIER_DB, 'messages.json');

// ── Initialisation ─────────────────────────────────────────────
function initDB() {
  if (!fs.existsSync(DOSSIER_DB)) {
    fs.mkdirSync(DOSSIER_DB, { recursive: true });
  }
  if (!fs.existsSync(FICHIER_DB)) {
    fs.writeFileSync(FICHIER_DB, JSON.stringify([], null, 2), 'utf8');
  }
  console.log('✅ Stockage prêt → db/messages.json');
  return Promise.resolve();
}

// ── Lire tous les messages ─────────────────────────────────────
function lireTousLesMessages() {
  const contenu = fs.readFileSync(FICHIER_DB, 'utf8');
  return JSON.parse(contenu);
}

// ── Sauvegarder un message ─────────────────────────────────────
function sauvegarderMessage({ nom, email, message }) {
  const messages = lireTousLesMessages();

  const nouveau = {
    id:         messages.length + 1,
    nom,
    email,
    message,
    statut:     'non_lu',
    date_envoi: new Date().toLocaleString('fr-FR'),
  };

  messages.push(nouveau);
  fs.writeFileSync(FICHIER_DB, JSON.stringify(messages, null, 2), 'utf8');

  return Promise.resolve(nouveau);
}

module.exports = { initDB, sauvegarderMessage, lireTousLesMessages };