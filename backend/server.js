// ─────────────────────────────────────────────────────────────
//  server.js — Le cœur du backend
// ─────────────────────────────────────────────────────────────

require('dotenv').config();

const express       = require('express');
const cors          = require('cors');
const rateLimit     = require('express-rate-limit');
const contactRoutes = require('./routes/contact');
const { initDB }    = require('./services/dbService');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── CORS : ouvert pour le développement local ─────────────────
// Accepte TOUTES les origines en local
app.use(cors());
app.options('*', cors());

// ── Middlewares ────────────────────────────────────────────────
app.use(express.json());

// Rate limiter : max 10 messages / 15 min
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Trop de tentatives. Réessayez dans 15 minutes.' },
});
app.use('/api/contact', limiter);

// ── Routes ─────────────────────────────────────────────────────
app.use('/api/contact', contactRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Le serveur fonctionne !' });
});

// ── Gestion des erreurs ────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Page introuvable.' });
});

app.use((err, req, res, next) => {
  console.error('Erreur :', err.message);
  res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
});

// ── Démarrage ──────────────────────────────────────────────────
async function demarrer() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`✅ Serveur démarré → http://localhost:${PORT}`);
    console.log(`   Testez : http://localhost:${PORT}/api/health`);
  });
}

demarrer();