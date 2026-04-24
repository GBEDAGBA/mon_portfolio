// ─────────────────────────────────────────────────────────────
//  routes/contact.js — Les "adresses" du formulaire
//
//  Une route, c'est comme une adresse postale pour votre API.
//  Ici on définit : POST /api/contact
//  Ça veut dire : "quand quelqu'un envoie le formulaire,
//  appelle la fonction submitContact"
// ─────────────────────────────────────────────────────────────

const express  = require('express');
const router   = express.Router();

// On importe la fonction qui gère la logique
const { submitContact } = require('../controllers/contactController');

// POST /api/contact → appelle submitContact
router.post('/', submitContact);

module.exports = router;