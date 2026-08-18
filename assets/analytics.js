// LYHA event tracking. Loads after the gtag.js snippet on every page.
// Events land in the GA4 property "LYHA Website" (G-7E8S3X0KH3).
(function () {
  if (typeof window.gtag !== 'function') return;

  // Program interest: one event per pageview on a program page, so
  // interest by program can be charted over time. Beginner programs
  // (Learn to Play, Mites 8U, Squirts 10U) vs travel (12U and up).
  var PROGRAMS = {
    '/learn-to-play/': ['learn_to_play', 'beginner'],
    '/mites/': ['mites_8u', 'beginner'],
    '/squirts/': ['squirts_10u', 'beginner'],
    '/peewee/': ['peewee_12u', 'travel'],
    '/bantams/': ['bantams_14u', 'travel'],
    '/u16/': ['u16', 'travel']
  };
  var path = location.pathname;
  if (PROGRAMS[path]) {
    gtag('event', 'program_interest', {
      program: PROGRAMS[path][0],
      program_group: PROGRAMS[path][1]
    });
  }

  // Contact form submissions: the embedded form at lyha-contact.netlify.app
  // posts a message to the parent page when a submission succeeds.
  window.addEventListener('message', function (e) {
    if (e.origin === 'https://lyha-contact.netlify.app' && e.data === 'lyha:contact-submitted') {
      gtag('event', 'generate_lead', { form_location: path });
    }
  });

  // Contact form engagement: the iframe is cross-origin, so a focus swap
  // into it is the best on-page signal that someone started the form.
  var formEngaged = false;
  window.addEventListener('blur', function () {
    if (formEngaged) return;
    var el = document.activeElement;
    if (el && el.tagName === 'IFRAME' && (el.src || '').indexOf('lyha-contact') !== -1) {
      formEngaged = true;
      gtag('event', 'contact_form_engaged', { form_location: path });
    }
  });

  // Register CTAs and email links.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('mailto:') === 0) {
      gtag('event', 'email_click', { link_url: href, page_location_path: path });
    } else if (href === '/#register' || href === '#sign-up' || a.classList.contains('nav-cta')) {
      gtag('event', 'register_cta_click', {
        cta_location: path,
        cta_text: (a.textContent || '').trim().slice(0, 60)
      });
    }
  });
})();
