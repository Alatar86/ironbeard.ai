/* ============================================
   IRONBEARD LANDING PAGE - INTERACTIONS
   ============================================ */

(function () {
  'use strict';

  // --- Nav scroll effect ---
  const nav = document.querySelector('.nav');
  let lastScroll = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // --- Mobile nav toggle ---
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Scroll reveal animations ---
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- Download counter simulation ---
  // In production, this would pull from a backend API.
  // For now, simulate a count that persists in localStorage.
  var TOTAL_SPOTS = 1000;
  var counterTextEl = document.getElementById('counter-text');
  var counterFillEl = document.getElementById('counter-fill');
  var counterTextFooterEl = document.getElementById('counter-text-footer');

  function getDownloadCount() {
    // Simulated: start at a base and add based on days since launch date
    var launchDate = new Date('2026-02-28T00:00:00');
    var now = new Date();
    var daysSinceLaunch = Math.max(0, Math.floor((now - launchDate) / (1000 * 60 * 60 * 24)));
    // Before launch, show a small "pre-registration" count
    if (now < launchDate) {
      return Math.min(47, TOTAL_SPOTS); // teaser count
    }
    // After launch, simulate gradual uptake
    var count = Math.min(47 + daysSinceLaunch * 12, TOTAL_SPOTS);
    return count;
  }

  function updateCounter() {
    var count = getDownloadCount();
    var remaining = Math.max(0, TOTAL_SPOTS - count);
    var percentage = (count / TOTAL_SPOTS) * 100;

    if (counterTextEl) {
      counterTextEl.innerHTML =
        '<strong>' + remaining + '</strong> of 1,000 spots remaining';
    }
    if (counterFillEl) {
      counterFillEl.style.width = percentage + '%';
    }
    if (counterTextFooterEl) {
      counterTextFooterEl.innerHTML =
        '<strong>' + remaining + '</strong> of 1,000 spots remaining';
    }
  }

  updateCounter();

  // --- Email capture form ---
  var emailForms = document.querySelectorAll('.email-form');

  emailForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var successMsg = form.parentElement.querySelector('.email-success');

      if (input && input.value && input.value.includes('@')) {
        // In production, POST to your backend here
        // For now, store in localStorage as a demo
        var emails = JSON.parse(localStorage.getItem('ironbeard_waitlist') || '[]');
        if (emails.indexOf(input.value) === -1) {
          emails.push(input.value);
          localStorage.setItem('ironbeard_waitlist', JSON.stringify(emails));
        }

        form.style.display = 'none';
        if (successMsg) {
          successMsg.style.display = 'block';
          successMsg.textContent = "You're on the list. We'll notify you when a spot opens up.";
        }
      }
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var navHeight = nav ? nav.offsetHeight : 0;
        var targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth',
        });
      }
    });
  });
})();
