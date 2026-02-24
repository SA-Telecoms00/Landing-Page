/* ============================================================
   SA TELECOMS — COSMIC COMIC SUPERHERO SCRIPT
   ============================================================ */

/* ===== STAR CANVAS ===== */
(function initStars() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    const count = Math.floor((W * H) / 4000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.2,
        alpha: Math.random(),
        speed: Math.random() * 0.4 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        color: ['#ffffff', '#38bdf8', '#a78bfa', '#fbbf24', '#f472b6'][Math.floor(Math.random() * 5)]
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha >= 1) { s.alpha = 1; s.twinkleDir = -1; }
      if (s.alpha <= 0.1) { s.alpha = 0.1; s.twinkleDir = 1; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha * 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(drawStars);
  }

  resize();
  createStars();
  drawStars();
  window.addEventListener('resize', () => { resize(); createStars(); });
})();

/* ===== LIGHTNING CANVAS ===== */
(function initLightning() {
  const canvas = document.getElementById('lightningCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function drawBolt(x1, y1, x2, y2, roughness, depth) {
    if (depth <= 0) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      return;
    }
    const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * roughness;
    const my = (y1 + y2) / 2 + (Math.random() - 0.5) * roughness;
    drawBolt(x1, y1, mx, my, roughness / 2, depth - 1);
    drawBolt(mx, my, x2, y2, roughness / 2, depth - 1);
  }

  function flashLightning() {
    const colors = ['rgba(167,139,250,', 'rgba(56,189,248,', 'rgba(236,72,153,', 'rgba(251,191,36,'];
    const col = colors[Math.floor(Math.random() * colors.length)];
    const x = Math.random() * W;
    const flashes = Math.floor(Math.random() * 3) + 1;
    let count = 0;

    function doFlash() {
      if (count >= flashes) return;
      count++;
      const alpha = Math.random() * 0.3 + 0.1;
      ctx.strokeStyle = col + alpha + ')';
      ctx.lineWidth = Math.random() * 1.5 + 0.5;
      ctx.shadowColor = col + '0.8)';
      ctx.shadowBlur = 12;
      drawBolt(x, 0, x + (Math.random() - 0.5) * 200, H * (Math.random() * 0.5 + 0.3), 80, 5);
      setTimeout(() => {
        ctx.clearRect(0, 0, W, H);
        setTimeout(doFlash, Math.random() * 80 + 30);
      }, Math.random() * 60 + 20);
    }
    doFlash();
    setTimeout(flashLightning, Math.random() * 6000 + 3000);
  }

  resize();
  window.addEventListener('resize', resize);
  setTimeout(flashLightning, 2000);
})();

/* ===== NAVBAR ===== */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navbar = document.querySelector('.navbar');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.style.boxShadow = window.scrollY > 20
      ? '0 4px 40px rgba(251,191,36,0.3)'
      : '0 4px 30px rgba(251,191,36,0.2)';
  }
});

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.delay) || 0;
      setTimeout(() => el.classList.add('revealed'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ===== POWER BAR ANIMATION ===== */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.power-fill').forEach(fill => {
        const target = fill.style.width;
        fill.style.width = '0';
        setTimeout(() => { fill.style.width = target; }, 300);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const powersSection = document.querySelector('.powers');
if (powersSection) barObserver.observe(powersSection);

/* ===== STAT COUNTERS ===== */
function animateCounter(el, target, isDecimal) {
  const duration = 1800;
  const start = performance.now();
  const from = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = from + (target - from) * eased;
    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const isDecimal = el.dataset.decimal === 'true';
        animateCounter(el, target, isDecimal);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const whySection = document.querySelector('.why-us');
if (whySection) counterObserver.observe(whySection);

/* ===== BUTTON BOUNCE ON HOVER ===== */
document.querySelectorAll('.btn-comic, .btn-plan, .btn-plan-featured, .promo-cta-btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.animation = 'btnBounce 0.3s ease';
  });
  btn.addEventListener('animationend', () => {
    btn.style.animation = '';
  });
});

const bounceStyle = document.createElement('style');
bounceStyle.textContent = '@keyframes btnBounce{0%{transform:scale(1)}40%{transform:scale(1.08)}70%{transform:scale(0.96)}100%{transform:scale(1)}}';
document.head.appendChild(bounceStyle);

/* ===== FLYING ROCKETS ACROSS SCREEN ===== */
function launchFlyingRocket() {
  const rocket = document.createElement('div');
  const goRight = Math.random() > 0.5;
  const colors = ['#fbbf24', '#38bdf8', '#ec4899', '#a78bfa'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  rocket.style.cssText = `
    position:fixed;
    top:${Math.random() * 60 + 10}%;
    ${goRight ? 'left:-60px' : 'right:-60px'};
    font-size:${Math.random() * 20 + 20}px;
    color:${color};
    filter:drop-shadow(0 0 8px ${color});
    z-index:50;
    pointer-events:none;
    transform:rotate(${goRight ? '-45deg' : '135deg'});
    transition:none;
  `;
  rocket.innerHTML = '<i class="fas fa-rocket"></i>';
  document.body.appendChild(rocket);

  const duration = Math.random() * 2500 + 2000;
  const distance = window.innerWidth + 120;

  rocket.animate(
    [{ transform: `translateX(0) rotate(${goRight ? '-45deg' : '135deg'})` },
     { transform: `translateX(${goRight ? distance : -distance}px) rotate(${goRight ? '-45deg' : '135deg'})` }],
    { duration, easing: 'linear', fill: 'forwards' }
  ).onfinish = () => rocket.remove();

  const nextDelay = Math.random() * 8000 + 5000;
  setTimeout(launchFlyingRocket, nextDelay);
}

setTimeout(launchFlyingRocket, 3000);

/* ===== FLOATING COMIC WORD CLICK BURST ===== */
document.querySelectorAll('.comic-word').forEach(word => {
  word.style.cursor = 'pointer';
  word.addEventListener('click', () => {
    word.style.transform = 'scale(1.4)';
    word.style.transition = 'transform 0.15s ease';
    setTimeout(() => {
      word.style.transform = '';
      word.style.transition = '';
    }, 200);
  });
});

/* ===== PROMO EXPLOSION CLICK EFFECT ===== */
const explosionShape = document.querySelector('.explosion-shape');
if (explosionShape) {
  explosionShape.addEventListener('click', () => {
    explosionShape.style.transform = 'scale(1.1) rotate(5deg)';
    explosionShape.style.transition = 'transform 0.2s ease';
    setTimeout(() => {
      explosionShape.style.transform = '';
      setTimeout(() => { explosionShape.style.transition = ''; }, 300);
    }, 200);
    showNotification('🔥 Limited offer! Only R299/mo — grab it now!', 'success');
  });
}

/* ===== AGENT CARD RIPPLE ===== */
document.querySelectorAll('.agent-card, .agent-hero').forEach(card => {
  card.addEventListener('click', function(e) {
    const ripple = document.createElement('div');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute;
      border-radius:50%;
      background:rgba(255,255,255,0.2);
      width:10px;height:10px;
      left:${e.clientX - rect.left - 5}px;
      top:${e.clientY - rect.top - 5}px;
      transform:scale(0);
      animation:rippleAnim 0.5s ease-out forwards;
      pointer-events:none;z-index:10;
    `;
    this.style.position = 'relative';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes rippleAnim{to{transform:scale(30);opacity:0}}';
document.head.appendChild(rippleStyle);

/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name) { showNotification('⚠️ Please enter your name, hero!', 'error'); return; }
    if (!email || !email.includes('@')) { showNotification('⚠️ Enter a valid email address!', 'error'); return; }
    if (!message) { showNotification('⚠️ Tell us about your project!', 'error'); return; }

    const btn = contactForm.querySelector('.btn-submit-comic');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> LAUNCHING...';
    btn.disabled = true;

    setTimeout(() => {
      showNotification('🚀 Mission received! We\'ll contact you within 24 hours.', 'success');
      contactForm.reset();
      btn.innerHTML = '<i class="fas fa-rocket"></i> LAUNCH MY PROJECT!';
      btn.disabled = false;
    }, 1800);
  });
}

/* ===== NOTIFICATION SYSTEM ===== */
function showNotification(msg, type = 'success') {
  let notif = document.querySelector('.notification');
  if (!notif) {
    notif = document.createElement('div');
    notif.className = 'notification';
    document.body.appendChild(notif);
  }
  notif.className = `notification ${type}`;
  notif.textContent = msg;
  notif.classList.add('show');
  clearTimeout(notif._timeout);
  notif._timeout = setTimeout(() => notif.classList.remove('show'), 4000);
}

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== POWER PANEL COMIC EFFECT ===== */
document.querySelectorAll('.power-panel').forEach(panel => {
  panel.addEventListener('mouseenter', () => {
    const num = panel.querySelector('.panel-number');
    if (num) num.style.opacity = '0.15';
  });
  panel.addEventListener('mouseleave', () => {
    const num = panel.querySelector('.panel-number');
    if (num) num.style.opacity = '';
  });
});

/* ===== HERO AGENT LINEUP — SHOW SPEECH BUBBLE ON SCROLL ===== */
const agentLineup = document.querySelector('.hero-agents');
if (agentLineup) {
  const lineupObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.agent-hero').forEach((agent, i) => {
        setTimeout(() => {
          agent.classList.add('revealed');
          const speech = agent.querySelector('.agent-speech');
          if (speech) {
            speech.style.opacity = '1';
            setTimeout(() => { speech.style.opacity = ''; }, 2500);
          }
        }, i * 150);
      });
      lineupObserver.unobserve(agentLineup);
    }
  }, { threshold: 0.3 });
  lineupObserver.observe(agentLineup);
}

/* ===== TEAM CARD GLOW PULSE ON SCROLL ===== */
const teamObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.agent-card').forEach((card, i) => {
        setTimeout(() => {
          card.style.animation = 'cardPop 0.4s ease forwards';
        }, i * 120);
      });
      teamObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const cardPopStyle = document.createElement('style');
cardPopStyle.textContent = '@keyframes cardPop{0%{transform:scale(0.92) translateY(16px);opacity:0}60%{transform:scale(1.04) translateY(-4px)}100%{transform:scale(1) translateY(0);opacity:1}}';
document.head.appendChild(cardPopStyle);

const teamSection = document.querySelector('.team-section');
if (teamSection) teamObserver.observe(teamSection);

/* ===== NAVBAR ACTIVE LINK ON SCROLL ===== */
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) current = section.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? 'var(--yellow)'
      : '';
  });
}, { passive: true });
