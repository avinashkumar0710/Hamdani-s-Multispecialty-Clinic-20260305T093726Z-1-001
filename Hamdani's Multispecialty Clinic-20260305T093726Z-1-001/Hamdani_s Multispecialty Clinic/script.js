// ============================================================
// HAMDANI'S MULTISPECIALTY CLINIC — JAVASCRIPT
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ── NAVBAR SCROLL EFFECT ── */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* ── ACTIVE NAV LINK ON SCROLL ── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ── HAMBURGER MOBILE MENU ── */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('is-open');
  });

  document.querySelectorAll('.mob-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('is-open');
    });
  });

  /* ── SCROLL REVEAL ── */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

  /* ── REVIEWS CAROUSEL ── */
  var track = document.getElementById('reviewsTrack');
  var dotsContainer = document.getElementById('carouselDots');

  if (track) {
    var cards = track.querySelectorAll('.review-card');
    var cardWidth = 340 + 24;
    var current = 0;
    var autoSlide;

    cards.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', 'Review ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () { goTo(i); });
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      current = index;
      track.style.transform = 'translateX(-' + (current * cardWidth) + 'px)';
      document.querySelectorAll('.dot').forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function next() { goTo((current + 1) % cards.length); }

    autoSlide = setInterval(next, 4500);
    track.addEventListener('mouseenter', function () { clearInterval(autoSlide); });
    track.addEventListener('mouseleave', function () { autoSlide = setInterval(next, 4500); });

    var touchStartX = 0;
    track.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 50) {
        goTo(delta > 0 ? (current + 1) % cards.length : (current - 1 + cards.length) % cards.length);
      }
    });
  }

  /* ── SMOOTH SCROLL FOR ALL # LINKS ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });

  /* ── FLOATING CTA – HIDE ON HERO ── */
  var floatingCta = document.getElementById('floatingCta');
  var heroSection = document.getElementById('home');

  if (floatingCta && heroSection) {
    var heroObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        floatingCta.style.opacity = entry.isIntersecting ? '0' : '1';
        floatingCta.style.pointerEvents = entry.isIntersecting ? 'none' : 'all';
      });
    }, { threshold: 0.3 });
    heroObs.observe(heroSection);
  }

  /* ── COUNTER ANIMATION FOR STATS ── */
  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var raw = el.textContent;
        var num = parseFloat(raw.replace(/[^0-9.]/g, ''));
        var suffix = raw.replace(/[0-9.]/g, '').trim();
        if (!isNaN(num)) {
          animateCount(el, num, suffix);
          countObserver.unobserve(el);
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num').forEach(function (el) { countObserver.observe(el); });

  function animateCount(el, target, suffix) {
    var duration = 1800;
    var start = performance.now();
    var isDecimal = target % 1 !== 0;
    function update(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (isDecimal ? (eased * target).toFixed(1) : Math.round(eased * target)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ── GOOGLE MAPS EMBED ── */
  var mapFrame = document.getElementById('clinic-map');
  if (mapFrame) {
    var q = encodeURIComponent("Hamdani's Multispeciality Clinic, Nehru Nagar East, Bhilai, Chhattisgarh 490020");
    mapFrame.src = 'https://maps.google.com/maps?q=' + q + '&output=embed&z=16';
  }

  /* ============================================================
     APPOINTMENT MODAL — event listeners
     (openModal / closeModal are global, below DOMContentLoaded)
     ============================================================ */

  var modal = document.getElementById('appointmentModal');
  var form = document.getElementById('appointmentForm');
  var success = document.getElementById('apptSuccess');

  /* Close on backdrop click */
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  /* Close on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* Form live-validation */
  if (form) {
    form.querySelectorAll('input, select').forEach(function (el) {
      el.addEventListener('blur', function () { _validateField(el); });
      el.addEventListener('input', function () { el.classList.remove('invalid'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      _clearFormErrors();

      var valid = true;
      form.querySelectorAll('[required]').forEach(function (el) {
        if (!_validateField(el)) valid = false;
      });

      if (!valid) {
        var btn = document.getElementById('apptSubmitBtn');
        if (btn) {
          btn.style.animation = 'none';
          // Force reflow then re-add animation
          void btn.offsetWidth;
          btn.style.animation = 'shake 0.45s ease';
          btn.addEventListener('animationend', function () { btn.style.animation = ''; }, { once: true });
        }
        return;
      }

      var btn = document.getElementById('apptSubmitBtn');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      setTimeout(function () {
        if (form) { form.style.display = 'none'; }
        if (success) { success.classList.add('show'); }
        if (btn) { btn.disabled = false; btn.textContent = 'Confirm Appointment →'; }
      }, 1200);
    });
  }

}); // END DOMContentLoaded

/* ============================================================
   GLOBAL MODAL FUNCTIONS
   Must be global so onclick="openModal()" attributes work.
   ============================================================ */

function openModal() {
  var modal = document.getElementById('appointmentModal');
  var form = document.getElementById('appointmentForm');
  var success = document.getElementById('apptSuccess');

  if (!modal) { console.warn('Modal element not found'); return; }

  // Show modal
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Set minimum date to today
  var dateInput = document.getElementById('apptDate');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  // Reset form to initial state
  if (form) { form.style.display = ''; form.reset(); }
  if (success) { success.classList.remove('show'); }
  _clearFormErrors();

  // Auto-focus first field
  setTimeout(function () {
    var first = document.getElementById('apptName');
    if (first) first.focus();
  }, 400);
}

function closeModal() {
  var modal = document.getElementById('appointmentModal');
  if (modal) { modal.classList.remove('open'); }
  document.body.style.overflow = '';
}

function _clearFormErrors() {
  document.querySelectorAll('.form-group input, .form-group select').forEach(function (el) {
    el.classList.remove('invalid');
  });
}

function _validateField(el) {
  if (el.hasAttribute('required') && !el.value.trim()) {
    el.classList.add('invalid'); return false;
  }
  if (el.type === 'tel' && el.value.trim()) {
    if (!/^[6-9]\d{9}$/.test(el.value.replace(/\s/g, ''))) {
      el.classList.add('invalid'); return false;
    }
  }
  el.classList.remove('invalid'); return true;
}

/* Inject shake keyframe once */
(function () {
  var s = document.createElement('style');
  s.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}';
  document.head.appendChild(s);
})();
