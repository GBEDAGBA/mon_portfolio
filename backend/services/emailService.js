const nodemailer = require('nodemailer');

async function envoyerEmail({ nom, email, message }) {
  console.log('📧 Tentative envoi email à :', email);
  console.log('📧 Config SMTP :', process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USER);

  const transporteur = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Test de connexion SMTP
  try {
    await transporteur.verify();
    console.log('✅ Connexion SMTP OK');
  } catch (err) {
    console.error('❌ Connexion SMTP échouée :', err.message);
    return;
  }

  // Email de notification vers vous
  const emailNotification = {
    from:    `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to:      process.env.OWNER_EMAIL,
    subject: `📬 Nouveau message de ${nom}`,
    html: `<p><strong>Nom :</strong> ${nom}</p>
           <p><strong>Email :</strong> ${email}</p>
           <p><strong>Message :</strong> ${message}</p>`,
  };

  // Email de confirmation vers l'expéditeur
  const emailConfirmation = {
    from:    `"Portfolio" <${process.env.SMTP_USER}>`,
    to:      email,
    subject: `✅ Votre message a bien été reçu !`,
    html: `<p>Bonjour ${nom}, merci pour votre message ! Je vous répondrai sous 24h.</p>`,
  };

  try {
    await Promise.all([
      transporteur.sendMail(emailNotification),
      transporteur.sendMail(emailConfirmation),
    ]);
    console.log('✅ Emails envoyés avec succès !');
  } catch (erreur) {
    console.error('❌ Erreur envoi email :', erreur.message);
  }
}

module.exports = { envoyerEmail };