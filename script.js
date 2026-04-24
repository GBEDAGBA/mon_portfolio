/* ════════════════════════════════════════════
   script.js — Portfolio Sophie Martin v2
   Bien commenté pour faciliter la compréhension
   ════════════════════════════════════════════ */


// ── 1. MENU HAMBURGER (mobile) ─────────────────────────────────────────────
const navBurger = document.getElementById('navBurger');
const navLinks  = document.getElementById('navLinks');

navBurger.addEventListener('click', function() {
  navBurger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Ferme le menu quand on clique sur un lien
navLinks.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function() {
    navBurger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});


// ── 2. NAVBAR AU SCROLL ────────────────────────────────────────────────────
// Ajoute une ombre à la navbar dès qu'on commence à défiler.
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function() {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


// ── 3. LIEN ACTIF AU SCROLL ────────────────────────────────────────────────
// Met en surbrillance le lien de nav correspondant à la section visible.
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', function() {
  let courant = '';

  sections.forEach(function(section) {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      courant = section.getAttribute('id');
    }
  });

  navAnchors.forEach(function(lien) {
    lien.classList.remove('active');
    if (lien.getAttribute('href') === '#' + courant) {
      lien.classList.add('active');
    }
  });
});


// ── 4. ANIMATION AU SCROLL (Scroll Reveal) ────────────────────────────────
// Les éléments avec la classe "reveal" apparaissent en douceur
// quand ils entrent dans la fenêtre de l'utilisateur.
const observer = new IntersectionObserver(
  function(entries) {
    entries.forEach(function(entry, index) {
      if (entry.isIntersecting) {
        // Délai décalé pour un effet de cascade
        setTimeout(function() {
          entry.target.classList.add('visible');
        }, index * 90);
        // Une fois visible, on arrête de surveiller l'élément
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(function(el) {
  observer.observe(el);
});


// ── 5. FORMULAIRE DE CONTACT ───────────────────────────────────────────────
// Envoie les données au backend (server.js dans le dossier backend/).
// ⚠️  Le backend doit être lancé pour que ça fonctionne.
//     Commande : cd backend && npm run dev

async function handleSubmit(event) {
  event.preventDefault();

  const form    = event.target;
  const button  = form.querySelector('.btn-submit');
  const inputs  = form.querySelectorAll('input, textarea');

  button.disabled = true;
  button.textContent = 'Envoi en cours...';
  inputs.forEach(function(i) { i.disabled = true; });

  const donnees = {
    nom:     form.querySelector('input[type="text"]').value,
    email:   form.querySelector('input[type="email"]').value,
    message: form.querySelector('textarea').value,
  };

  try {
    const reponse = await fetch('http://localhost:3001/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(donnees),
    });

    const resultat = await reponse.json();

    if (resultat.success) {
      afficherNotification('✅ Message envoyé ! Je vous répondrai sous 24h 😊', 'succes');
      form.reset();
    } else {
      afficherNotification('⚠️ ' + (resultat.message || 'Vérifiez vos informations'), 'erreur');
    }

  } catch (erreur) {
    console.error('Erreur réseau :', erreur);
    afficherNotification('❌ Serveur inaccessible — réessayez', 'erreur');
  }

  setTimeout(function() {
    button.textContent = 'Envoyer le message';
    button.disabled    = false;
    inputs.forEach(function(i) { i.disabled = false; });
  }, 4000);
}

// ── Notification ───────────────────────────────────────────────
function afficherNotification(texte, type) {
  // Supprimer une notification existante
  const existante = document.querySelector('.notif');
  if (existante) existante.remove();

  // Créer la notification
  const notif = document.createElement('div');
  notif.className = 'notif notif-' + type;
  notif.textContent = texte;

  // Style
  notif.style.cssText = `
    position: fixed;
    top: 90px;
    right: 24px;
    z-index: 9999;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    animation: slideIn 0.4s ease;
    max-width: 360px;
    background: ${type === 'succes' ? '#D1FAE5' : '#FEE2E2'};
    color:      ${type === 'succes' ? '#065F46' : '#991B1B'};
    border:     1px solid ${type === 'succes' ? '#6EE7B7' : '#FECACA'};
  `;

  document.body.appendChild(notif);

  // Disparaît après 5 secondes
  setTimeout(function() {
    notif.style.opacity = '0';
    notif.style.transition = 'opacity 0.5s ease';
    setTimeout(function() { notif.remove(); }, 500);
  }, 5000);
}