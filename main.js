/* ── Portfolio — main.js ────────────────────────────────────────────── */

// ─── Navbar scroll effect ─────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ─── Mobile menu toggle ───────────────────────────────────────────────
const navToggle  = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));

  // Animate hamburger → X
  const spans = navToggle.querySelectorAll('span');
  if (open) {
    spans[0].style.cssText = 'transform:translateY(7px) rotate(45deg)';
    spans[1].style.cssText = 'opacity:0;transform:scaleX(0)';
    spans[2].style.cssText = 'transform:translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => (s.style.cssText = ''));
  }
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => (s.style.cssText = ''));
  });
});

// ─── Scroll-based fade-up animation ──────────────────────────────────
const animTargets = [
  '.section-header',
  '.project-card',
  '.contact-form',
  '.contact-card',
  '.hero-content',
];

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

// Apply .fade-up and observe after a tiny delay so initial paint isn't affected
requestAnimationFrame(() => {
  animTargets.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('fade-up');
      el.style.transitionDelay = `${i * 60}ms`;
      fadeObserver.observe(el);
    });
  });
});

// ─── Contact form ──────────────────────────────────────────────────────
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

const fields = {
  name:    { el: document.getElementById('name'),    err: document.getElementById('nameError') },
  email:   { el: document.getElementById('email'),   err: document.getElementById('emailError') },
  message: { el: document.getElementById('message'), err: document.getElementById('messageError') },
};

function validate() {
  let ok = true;

  // Name
  if (fields.name.el.value.trim().length < 2) {
    fields.name.err.textContent  = 'Please enter your name.';
    fields.name.el.classList.add('invalid');
    ok = false;
  } else {
    fields.name.err.textContent  = '';
    fields.name.el.classList.remove('invalid');
  }

  // Email
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRx.test(fields.email.el.value.trim())) {
    fields.email.err.textContent  = 'Please enter a valid email.';
    fields.email.el.classList.add('invalid');
    ok = false;
  } else {
    fields.email.err.textContent  = '';
    fields.email.el.classList.remove('invalid');
  }

  // Message
  if (fields.message.el.value.trim().length < 10) {
    fields.message.err.textContent  = 'Message must be at least 10 characters.';
    fields.message.el.classList.add('invalid');
    ok = false;
  } else {
    fields.message.err.textContent  = '';
    fields.message.el.classList.remove('invalid');
  }

  return ok;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validate()) return;

  // Simulate async send
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').textContent = 'Sending…';

  await new Promise((res) => setTimeout(res, 1200));

  form.reset();
  submitBtn.disabled = false;
  submitBtn.querySelector('.btn-text').textContent = 'Send Message';
  formSuccess.hidden = false;

  setTimeout(() => {
    formSuccess.hidden = true;
  }, 5000);
});

// Live validation — clear error as soon as user fixes the field
Object.values(fields).forEach(({ el, err }) => {
  el.addEventListener('input', () => {
    if (el.classList.contains('invalid')) {
      err.textContent = '';
      el.classList.remove('invalid');
    }
  });
});
