/* ══════════════════════════════════════════════════
   ZEN | Outtamane Dental Clinic — script.js
   Navbar · Scroll Reveal · Ticker · WhatsApp
   Premium Background: Canvas Particles + Orbs + Motifs
══════════════════════════════════════════════════ */

/* ─── PAGE LOADER — never gets stuck ─── */
(function() {
  function hideLoader() {
    var loader = document.getElementById('pageLoader');
    if (loader) loader.classList.add('hide');
  }
  var maxTimer = setTimeout(hideLoader, 2200);
  window.addEventListener('load', function() {
    clearTimeout(maxTimer);
    setTimeout(hideLoader, 400);
  });
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. NAVBAR ─── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  hamburger?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger?.classList.remove('open');
      const spans = hamburger?.querySelectorAll('span');
      if (spans) {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });
  });

  /* ─── 2. SCROLL REVEAL ─── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.10 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => revealObserver.observe(el));

  /* ─── 3. TICKER ─── */
  const services = [
    'General Dentistry', 'Teeth Cleaning & Whitening', 'Root Canal Treatment',
    'Dental Implants', 'Braces & Aligners', 'Smile Makeover & Cosmetic Dentistry',
    'Pediatric Dentistry', 'Tooth Extraction', 'Crowns & Bridges', 'Emergency Dental Care',
  ];
  const track = document.getElementById('ticker');
  if (track) {
    const starSVG = `<svg class="ticker-icon" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>`;
    track.innerHTML = [...services, ...services].map(s =>
      `<span class="ticker-item">${starSVG}${s}<span class="ticker-dot"></span></span>`
    ).join('');
  }

  /* ─── 4. SERVICES CAROUSEL ─── */
  (function initServiceCarousel() {
    const track    = document.getElementById('svcTrack');
    const viewport = document.getElementById('svcViewport');
    const prevBtn  = document.getElementById('svcPrev');
    const nextBtn  = document.getElementById('svcNext');
    const dotsWrap = document.getElementById('svcDots');
    if (!track || !viewport) return;

    const cards      = Array.from(track.children);
    const totalCards = cards.length;
    let currentIndex = 0;
    let autoTimer    = null;

    function visibleCount() {
      const vw = window.innerWidth;
      if (vw <= 480)  return 1;
      if (vw <= 768)  return 2;
      if (vw <= 1100) return 3;
      return 4;
    }

    function maxIndex() { return Math.max(0, totalCards - visibleCount()); }

    function buildDots() {
      dotsWrap.innerHTML = '';
      const count = maxIndex() + 1;
      for (let i = 0; i < count; i++) {
        const d = document.createElement('button');
        d.className = 'svc-dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
      }
    }

    function updateDots() {
      Array.from(dotsWrap.children).forEach((d, i) =>
        d.classList.toggle('active', i === currentIndex));
    }

    function goTo(index) {
      currentIndex = Math.max(0, Math.min(index, maxIndex()));
      const gap  = 14;
      const cardW = cards[0] ? cards[0].offsetWidth : 0;
      track.style.transform = `translateX(-${currentIndex * (cardW + gap)}px)`;
      updateDots();
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex();
    }

    function next() { goTo(currentIndex < maxIndex() ? currentIndex + 1 : 0); }
    function prev() { goTo(currentIndex > 0 ? currentIndex - 1 : maxIndex()); }

    function startAuto() { stopAuto(); autoTimer = setInterval(next, 3000); }
    function stopAuto()  { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }

    viewport.addEventListener('mouseenter', stopAuto);
    viewport.addEventListener('mouseleave', startAuto);

    let touchStartX = 0;
    viewport.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopAuto(); }, { passive: true });
    viewport.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
      startAuto();
    }, { passive: true });

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });

    window.addEventListener('resize', () => {
      buildDots();
      goTo(Math.min(currentIndex, maxIndex()));
    }, { passive: true });

    buildDots();
    goTo(0);
    startAuto();
  })();

  /* ─── 5. GALLERY FILTERS ─── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ─── 6. DOT NAV ─── */
  document.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => {
      document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });

  /* ─── 7. ACTIVE NAV ON SCROLL ─── */
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  /* ─── 8. STAGGER CARDS ─── */
  document.querySelectorAll('.svc-card, .why-card, .t-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.07}s`;
  });

  /* ─── 9. COUNTER ANIMATION ─── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600, step = 16;
    const increment = target / (duration / step);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, step);
  }
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  /* ─── 10. MOUSE PARALLAX ON HERO BADGE ─── */
  const badge = document.querySelector('.hero-badge-float');
  if (badge) {
    document.addEventListener('mousemove', e => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 8;
      const my = (e.clientY / window.innerHeight - 0.5) * 8;
      badge.style.transform = `translateY(${-8 + my * 0.4}px) rotateX(${my * 0.25}deg) rotateY(${mx * 0.25}deg)`;
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════
     PREMIUM BACKGROUND SYSTEM
  ══════════════════════════════════════════════════════ */

  /* A. Ambient drifting orbs */
  ['ambient-orb-1', 'ambient-orb-2', 'ambient-orb-3'].forEach(cls => {
    const orb = document.createElement('div');
    orb.className = `ambient-orb ${cls}`;
    document.body.appendChild(orb);
  });

  /* B. Floating decorative motifs */
  const motifs = [
    {
      svg: `<svg viewBox="0 0 24 24"><path d="M12 2C9 2 6.5 3.5 6.5 6.5c0 1.8.6 3.2 1 4.5.5 1.5.5 3 .5 4.5 0 2 .7 4.5 2 4.5s1.5-2 2-3.5c.5 1.5.7 3.5 2 3.5s2-2.5 2-4.5c0-1.5 0-3 .5-4.5.4-1.3 1-2.7 1-4.5C17.5 3.5 15 2 12 2z" fill="#C9A96E"/></svg>`,
      size: 70, top: '10%', left: '4%', dur: '18s', delay: '0s', opacity: 0.06
    },
    {
      svg: `<svg viewBox="0 0 24 24"><path d="M12 2C9 2 6.5 3.5 6.5 6.5c0 1.8.6 3.2 1 4.5.5 1.5.5 3 .5 4.5 0 2 .7 4.5 2 4.5s1.5-2 2-3.5c.5 1.5.7 3.5 2 3.5s2-2.5 2-4.5c0-1.5 0-3 .5-4.5.4-1.3 1-2.7 1-4.5C17.5 3.5 15 2 12 2z" fill="#8B9A7B"/></svg>`,
      size: 48, top: '56%', left: '88%', dur: '23s', delay: '3s', opacity: 0.055
    },
    {
      svg: `<svg viewBox="0 0 60 60"><rect x="26" y="6" width="8" height="48" rx="4" fill="#C9A96E"/><rect x="6" y="26" width="48" height="8" rx="4" fill="#C9A96E"/></svg>`,
      size: 56, top: '33%', left: '92%', dur: '16s', delay: '1s', opacity: 0.05
    },
    {
      svg: `<svg viewBox="0 0 60 60"><rect x="26" y="6" width="8" height="48" rx="4" fill="#8B9A7B"/><rect x="6" y="26" width="48" height="8" rx="4" fill="#8B9A7B"/></svg>`,
      size: 40, top: '76%', left: '3%', dur: '21s', delay: '5s', opacity: 0.045
    },
    {
      svg: `<svg viewBox="0 0 24 24"><path d="M12 2C9 2 6.5 3.5 6.5 6.5c0 1.8.6 3.2 1 4.5.5 1.5.5 3 .5 4.5 0 2 .7 4.5 2 4.5s1.5-2 2-3.5c.5 1.5.7 3.5 2 3.5s2-2.5 2-4.5c0-1.5 0-3 .5-4.5.4-1.3 1-2.7 1-4.5C17.5 3.5 15 2 12 2z" fill="#C9A96E"/></svg>`,
      size: 34, top: '88%', left: '52%', dur: '25s', delay: '7s', opacity: 0.04
    },
  ];

  motifs.forEach(({ svg, size, top, left, dur, delay, opacity }) => {
    const el = document.createElement('div');
    el.className = 'bg-motif';
    el.style.cssText = `width:${size}px;height:${size}px;top:${top};left:${left};--dur:${dur};--delay:${delay};--final-opacity:${opacity};animation-delay:${delay};`;
    el.innerHTML = svg;
    document.body.appendChild(el);
  });

  /* C. Canvas particle system */
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const PALETTE = [
    'rgba(201,169,110,VAL)',
    'rgba(168,128,58,VAL)',
    'rgba(139,154,123,VAL)',
    'rgba(232,213,176,VAL)',
    'rgba(74,138,138,VAL)',
  ];

  const particles = Array.from({ length: 38 }, (_, i) => ({
    x:            Math.random() * window.innerWidth,
    y:            Math.random() * window.innerHeight,
    r:            Math.random() * 1.6 + 0.4,
    alpha:        Math.random() * 0.14 + 0.03,
    vx:           (Math.random() - 0.5) * 0.20,
    vy:           -(Math.random() * 0.16 + 0.07),
    color:        PALETTE[Math.floor(Math.random() * PALETTE.length)],
    twinkleSpeed: Math.random() * 0.009 + 0.004,
    twinkleDir:   Math.random() > 0.5 ? 1 : -1,
    diamond:      i % 5 === 0,
    size2:        Math.random() * 2.0 + 0.9,
  }));

  const glows = Array.from({ length: 5 }, () => ({
    x:     Math.random() * window.innerWidth,
    y:     Math.random() * window.innerHeight,
    r:     Math.random() * 52 + 26,
    alpha: Math.random() * 0.035 + 0.01,
    vx:    (Math.random() - 0.5) * 0.11,
    vy:    (Math.random() - 0.5) * 0.09,
    color: Math.random() > 0.5 ? '201,169,110' : '139,154,123',
  }));

  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    glows.forEach(g => {
      g.x += g.vx; g.y += g.vy;
      if (g.x < -g.r) g.x = canvas.width + g.r;
      if (g.x > canvas.width + g.r) g.x = -g.r;
      if (g.y < -g.r) g.y = canvas.height + g.r;
      if (g.y > canvas.height + g.r) g.y = -g.r;
      const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
      grad.addColorStop(0, `rgba(${g.color},${g.alpha})`);
      grad.addColorStop(1, `rgba(${g.color},0)`);
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    particles.forEach(p => {
      p.alpha += p.twinkleSpeed * p.twinkleDir;
      if (p.alpha > 0.18 || p.alpha < 0.02) p.twinkleDir *= -1;
      p.x += p.vx; p.y += p.vy;
      if (p.y < -6) { p.y = canvas.height + 6; p.x = Math.random() * canvas.width; }
      if (p.x < -6) p.x = canvas.width + 6;
      if (p.x > canvas.width + 6) p.x = -6;
      const col = p.color.replace('VAL', p.alpha.toFixed(3));
      if (p.diamond) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = col;
        const s = p.size2;
        ctx.fillRect(-s / 2, -s / 2, s, s);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
      }
    });

    requestAnimationFrame(drawFrame);
  }
  drawFrame();

}); // end DOMContentLoaded

/* ─── WHATSAPP BOOKING (global — called by onclick) ─── */
function sendWhatsApp() {
  const firstName = document.getElementById('f_fname')?.value.trim() || '';
  const lastName  = document.getElementById('f_lname')?.value.trim() || '';
  const phone     = document.getElementById('f_phone')?.value.trim() || '';
  const email     = document.getElementById('f_email')?.value.trim() || '';
  const service   = document.getElementById('f_service')?.value || '';
  const date      = document.getElementById('f_date')?.value || '';
  const notes     = document.getElementById('f_notes')?.value.trim() || '';

  if (!firstName) {
    alert('Please enter your First Name.');
    document.getElementById('f_fname')?.focus();
    return;
  }
  if (!phone) {
    alert('Please enter your Phone Number.');
    document.getElementById('f_phone')?.focus();
    return;
  }

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Not selected';

  const message =
    `🦷 *New Appointment – ZEN | Outtamane Dental Clinic*\n\n` +
    `👤 *Name:* ${firstName} ${lastName}\n` +
    `📞 *Phone:* ${phone}\n` +
    `📧 *Email:* ${email || 'Not provided'}\n` +
    `🦷 *Service:* ${service || 'Not selected'}\n` +
    `📅 *Date:* ${formattedDate}\n` +
    `📝 *Notes:* ${notes || 'None'}\n\n` +
    `_Sent from ZEN | Outtamane website_ 😊`;

  const encoded = encodeURIComponent(message);
  window.open('https://wa.me/919486669903?text=' + encoded, '_blank');
}