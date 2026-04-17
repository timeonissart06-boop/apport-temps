// =====================
// SPLASH SCREEN
// Plein écran au chargement, disparaît au scroll ou après délai max
// =====================
(function () {
  const splash = document.getElementById('splash');
  if (!splash) return;

  // Empêche le scroll pendant l'affichage du splash
  document.body.style.overflow = 'hidden';

  let dismissed = false;

  function dismissSplash() {
    if (dismissed) return;
    dismissed = true;

    splash.classList.add('is-leaving');
    document.body.style.overflow = '';

    // Retire du DOM après la transition pour libérer les ressources
    splash.addEventListener('transitionend', () => {
      splash.remove();
    }, { once: true });

    // Nettoyage des listeners
    window.removeEventListener('wheel',     onInteract, { passive: true });
    window.removeEventListener('touchmove', onInteract, { passive: true });
    window.removeEventListener('keydown',   onInteract);
  }

  function onInteract() { dismissSplash(); }

  // Écoute le scroll / swipe / touche clavier après 1.2s
  // (laisse le temps à l'animation d'entrée du logo de se jouer)
  setTimeout(() => {
    window.addEventListener('wheel',     onInteract, { passive: true });
    window.addEventListener('touchmove', onInteract, { passive: true });
    window.addEventListener('keydown',   onInteract);
  }, 1200);

  // Dismiss automatique après 3.5s maximum (non bloquant)
  setTimeout(dismissSplash, 3500);
})();

// =====================
// NAVBAR SCROLL
// =====================
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// =====================
// MOBILE MENU
// =====================
const hamburger = document.querySelector('.navbar__hamburger');
const mobileNav = document.querySelector('.mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileNav.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// =====================
// ACTIVE NAV LINK
// =====================
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.navbar__links a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// =====================
// FADE-UP ANIMATIONS
// =====================
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));
}

// =====================
// FORM SUBMIT FEEDBACK
// =====================
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    const original = btn.textContent;
    btn.textContent = '✓ Message envoyé !';
    btn.style.background = '#4BA86B';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3500);
  });
});

// =====================
// SMOOTH SCROLL for anchors
// =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
