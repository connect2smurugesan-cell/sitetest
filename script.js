/* ============================================================
   XplurData — script.js
   ============================================================ */

// ── Theme Toggle ─────────────────────────────────────────────
const themeToggle = document.getElementById('theme-toggle');
const iconSun  = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');
const html     = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('xd-theme', theme);
  if (theme === 'dark') {
    iconSun.style.display  = 'none';
    iconMoon.style.display = 'block';
  } else {
    iconSun.style.display  = 'block';
    iconMoon.style.display = 'none';
  }
}
const savedTheme = localStorage.getItem('xd-theme') || 'light';
// const savedTheme = localStorage.getItem('xd-theme') ||
//   (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ── Navbar scroll effect ─────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 20
    ? '0 2px 20px rgba(0,0,0,0.1)'
    : 'none';
}, { passive: true });

// ── Hamburger menu ───────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ── Screenshot Tabs ──────────────────────────────────────────
const tabBtns = document.querySelectorAll('.tab-btn');
const scPanels = document.querySelectorAll('.screenshot-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    scPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('sc-panels-' + target);
   //console.log(panel, target);
    if (panel) panel.classList.add('active');
  });
});

// ── Copy Buttons ─────────────────────────────────────────────
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.dataset.copy;
    navigator.clipboard.writeText(text).then(() => {
      const original = btn.innerHTML;
      btn.classList.add('copied');
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
      setTimeout(() => {
        btn.innerHTML = original;
        btn.classList.remove('copied');
      }, 2000);
    });
  });
});

// ── Intersection Observer (reveal on scroll) ─────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Add reveal class to elements
const revealTargets = [
  '.feature-card',
  '.stack-card',
  '.value-card',
  '.deploy-step',
  '.arch-layer',
  '.arch-arrow',
  '.screenshot-wrap',
  '.screenshot-caption',
];

revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
    revealObserver.observe(el);
  });
});

// ── Terminal animation ───────────────────────────────────────
function animateTerminal() {
  const lines = [
    document.getElementById('tl-1'),
    document.getElementById('tl-2'),
    document.getElementById('tl-3'),
    document.getElementById('tl-4'),
    document.getElementById('tl-5'),
    document.getElementById('tl-6'),
    document.getElementById('tl-7'),
  ];
  const cursor = document.getElementById('terminal-cursor');

  // Reset
  lines.forEach(l => { if(l) l.classList.remove('show'); });
  if (cursor) cursor.style.opacity = '0';

  lines.forEach((line, i) => {
    if (!line) return;
    setTimeout(() => {
      line.classList.add('show');
    }, 400 + i * 350);
  });

  setTimeout(() => {
    if (cursor) cursor.style.opacity = '1';
  }, 400 + lines.length * 350);
}

// Trigger terminal animation when CTA section enters view
const ctaSection = document.getElementById('cta');
if (ctaSection) {
  const ctaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateTerminal();
      }
    });
  }, { threshold: 0.3 });
  ctaObserver.observe(ctaSection);
}

// ── Smooth active nav link highlight ─────────────────────────
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => {
        link.style.color = '';
        link.style.fontWeight = '';
      });
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) {
        active.style.color = 'var(--primary)';
        active.style.fontWeight = '600';
      }
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── Service items stagger ─────────────────────────────────────
const serviceItems = document.querySelectorAll('.service-item');
const servicesCard = document.getElementById('services-card');
if (servicesCard) {
  const svcObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        serviceItems.forEach((item, i) => {
          item.style.opacity = '0';
          item.style.transform = 'translateX(-10px)';
          item.style.transition = `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`;
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, 100 + i * 100);
        });
        svcObserver.unobserve(servicesCard);
      }
    });
  }, { threshold: 0.3 });
  svcObserver.observe(servicesCard);
}

// ── Hero badge counter animation ─────────────────────────────
// Small ASCII loading animation on load
window.addEventListener('load', () => {
  animateTerminal();
});

// ============================================================
// ENHANCED FEATURES — OSS Banner, Sandbox, Roadmap, Particles
// ============================================================

// ── Top Banner Dismissal ─────────────────────────────────────
(function() {
  const banner = document.getElementById('top-banner');
  const closeBtn = document.getElementById('banner-close');
  if (!banner) return;

  if (localStorage.getItem('xd-banner-dismissed') === '1') {
    banner.style.display = 'none';
  } else {
    document.body.classList.add('has-top-banner');
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      banner.classList.add('hide');
      document.body.classList.remove('has-top-banner');
      localStorage.setItem('xd-banner-dismissed', '1');
    });
  }
})();

// ── Scroll Progress Bar ──────────────────────────────────────
(function() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = Math.min(100, (scrollTop / docHeight) * 100) + '%';
  }, { passive: true });
})();

// ── Canvas Particles ─────────────────────────────────────────
(function() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [], mouse = { x: -9999, y: -9999 };
  const COUNT = 55, CONNECTION_DIST = 130;

  function resize() {
    const hero = document.getElementById('hero');
  //  w = canvas.width = hero.offsetWidth;
 //   h = canvas.height = hero.offsetHeight;   
 // // Clamp to viewport width to prevent horizontal overflow
    w = canvas.width  = Math.min(hero.offsetWidth, window.innerWidth);
    h = canvas.height = hero.offsetHeight;
    // Reset canvas style to prevent stretching
    canvas.style.width  = '100%';
    canvas.style.height = '100%';  
  }

  function Particle() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r = Math.random() * 2 + 1;
  }

  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
    // Mouse repel
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80) {
      this.x += dx / dist * 1.5;
      this.y += dy / dist * 1.5;
    }
  };

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const pColor = isDark ? '6, 200, 120' : '6, 128, 95';

    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${pColor}, 0.6)`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${pColor}, ${(1 - dist / CONNECTION_DIST) * 0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  draw();
  window.addEventListener('resize', () => { resize(); });

  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  }
})();

// ── Spotlight Cursor Effect ──────────────────────────────────
document.querySelectorAll('.spotlight-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
    card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
  });
});

// ── Hero Live Preview Tab Switcher ───────────────────────────
(function() {
  const navBtns = document.querySelectorAll('.hlp-nav-item');
  const panels  = document.querySelectorAll('.hlp-panel');
  const pageNameEl = document.getElementById('hlp-page-name');

  const pageNames = { logs: 'logs', traces: 'traces', metrics: 'metrics', users: 'users' };

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.panel;
      navBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('panel-' + target);
      if (panel) panel.classList.add('active');
     // console.log(pageNames[target]);
      if (pageNameEl) pageNameEl.textContent = pageNames[target] || target;
    });
  });
})();

// ── Live Log Stream (product-accurate rows) ──────────────────
(function() {
  const logsStream = document.getElementById('logs-stream');
  if (!logsStream) return;

  const svcData = [
    { name: 'Api-Gateway',           cls: 'hlp-svc-blue',   inst: 'Api-Gateway-Pod-2' },
    { name: 'Auth-Service',          cls: 'hlp-svc-green',  inst: 'Auth-Service-Pod-1' },
    { name: 'Inventory-Service',     cls: 'hlp-svc-green',  inst: 'Inventory-Service-Pod-1' },
    { name: 'Payment-Service',       cls: 'hlp-svc-yellow', inst: 'Payment-Service-Pod-2' },
    { name: 'Notification-Service',  cls: 'hlp-svc-green',  inst: 'Notification-Service-Pod-1' },
  ];
  const messages = [
    'Response Sent 200 OK In 1427ms',
    'Login Successful For User User_73779',
    'Payment Initiated Order_id=Ord_316883 Amount=9408.10',
    'Reservation Created SKU SKU-81278 Qty=725',
    'Stock Checked SKU SKU-95795 663 Units Available',
    'Warehouse Sync Completed 75 SKUs Updated',
    'SMS Sent Order Status Update',
    'Cache Refresh SKU SKU-32612',
    'Login Failed User User_28466 Not Found',
    'Invalid Token For User User_58981',
    'Warehouse Sync Failed Connection Refused',
    'Health Check Passed',
    'Push Notification Failed Device 942724ce Retrying',
    'Request Received GET /V1/Products',
  ];
  const traceIds = ['A2058886d794...','C585982b7a22...','70a65ea3a140...','6aecbdee592a...','Unknown'];
  let rowCount = 0;

  function formatTime() {
    const d = new Date();
    return `May 29, 2026, ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
  }
  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function appendLog() {
    const svc = rand(svcData);
    const msg = rand(messages);
    const trace = rand(traceIds);
    const traceClass = trace === 'Unknown' ? 'hlp-log-trace' : 'hlp-log-trace hlp-log-trace-id';

    const row = document.createElement('div');
    row.className = 'hlp-log-row';
    row.innerHTML =
      `<span class="hlp-log-ts">${formatTime()}</span>` +
      `<span class="hlp-log-body">${msg}</span>` +
      `<span class="hlp-log-svc ${svc.cls}">${svc.name}</span>` +
      `<span class="hlp-log-inst">${svc.inst}</span>` +
      `<span class="${traceClass}">${trace}</span>`;

    logsStream.insertBefore(row, logsStream.firstChild);
    rowCount++;
    if (rowCount > 9) logsStream.removeChild(logsStream.lastChild);
  }

  // Seed
  for (let i = 0; i < 8; i++) appendLog();
  setInterval(appendLog, 1000);

  // SVG Chart updater
  const linePath = document.getElementById('logs-line-path');
  const areaPath = document.getElementById('logs-area-path');
  if (!linePath || !areaPath) return;

  let chartData = Array.from({ length: 20 }, () => 5 + Math.random() * 40);
  // spike at the right like the real product
  chartData[17] = 85; chartData[18] = 95; chartData[19] = 100;

  function updateChart() {
    chartData.shift();
    const next = Math.random() < 0.15 ? 70 + Math.random() * 30 : 5 + Math.random() * 45;
    chartData.push(next);
    const W = 600, H = 68;
    const max = Math.max(...chartData, 1);
    const pts = chartData.map((v, i) => {
      const x = (i / (chartData.length - 1)) * W;
      const y = H - (v / max) * (H - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const linePts = 'M ' + pts.join(' L ');
    const firstX = pts[0].split(',')[0];
    const lastX  = pts[pts.length-1].split(',')[0];
    const areaPts = linePts + ` L ${lastX},${H} L ${firstX},${H} Z`;
    linePath.setAttribute('d', linePts);
    areaPath.setAttribute('d', areaPts);
  }

  updateChart();
  setInterval(updateChart, 1200);
})();

// (metrics panel shows coming-soon state — no live updater needed)

// ── Roadmap Upvote System ────────────────────────────────────
(function() {
  const STORAGE_KEY = 'xd-upvotes';
  let votes = {};
  try { votes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch(e) {}

  function saveVotes() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(votes)); } catch(e) {}
  }

  function renderVotes() {
    document.querySelectorAll('.btn-upvote').forEach(btn => {
      const feat = btn.dataset.feature;
      const count = votes[feat] || 0;
      btn.querySelector('.upvote-count').textContent = count;
      if (count > 0) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }

  renderVotes();

  document.querySelectorAll('.btn-upvote').forEach(btn => {
    btn.addEventListener('click', () => {
      const feat = btn.dataset.feature;
      if (votes[feat]) {
        votes[feat]++;
      } else {
        votes[feat] = 1;
      }
      saveVotes();
      btn.classList.add('animate-pop');
      setTimeout(() => btn.classList.remove('animate-pop'), 350);
      renderVotes();
    });
  });
})();

// ── Feature Suggester ────────────────────────────────────────
(function() {
  const input = document.getElementById('suggest-input');
  const submitBtn = document.getElementById('suggest-submit');
  const list = document.getElementById('suggestions-list');
  if (!input || !submitBtn || !list) return;

  function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.innerHTML = `<span class="toast-icon">✅</span> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 350);
    }, 3000);
  }

  function submitSuggestion() {
    const val = input.value.trim();
    if (!val || val.length < 5) {
      input.style.borderColor = 'var(--destructive)';
      setTimeout(() => input.style.borderColor = '', 1500);
      return;
    }
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.innerHTML = `<span class="suggestion-text">${val}</span><span class="suggestion-badge">Community</span>`;
    list.insertBefore(item, list.firstChild);
    input.value = '';
    showToast('Feature idea submitted! Thanks for contributing 🎉');
  }

  submitBtn.addEventListener('click', submitSuggestion);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') submitSuggestion(); });
})();

// ── Instrument Tabs (Step 3) ──────────────────────────────────
(function() {
  const instTabs   = document.querySelectorAll('.inst-tab');
  const instPanels = document.querySelectorAll('.inst-panel');
  instTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const lang = tab.dataset.lang;
      instTabs.forEach(t => t.classList.remove('active'));
      instPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('inst-' + lang);
      if (panel) panel.classList.add('active');
    });
  });
})();

// ── Live GitHub Stars ─────────────────────────────────────────
// Fetches the live star count from the GitHub API.
// Results are cached in localStorage for 1 hour to avoid rate-limiting.
// Falls back gracefully if the network is unavailable or the API rate-limits.
(function () {
  const REPO    = 'xplurdata/oss-stack';           // ← change if repo name changes
  const API_URL = `https://api.github.com/repos/${REPO}`;
  const CACHE_KEY = 'xd-gh-stars';
  const CACHE_TTL = 60 * 60 * 1000;                // 1 hour in ms

  // All elements that should display the star count
  const targets = [
    document.getElementById('github-stars'),        // nav button
    document.getElementById('hero-star-count'),     // hero CTA
    document.getElementById('contact-star-count'),  // contact section
  ].filter(Boolean);

  function formatStars(n) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  }

  function applyStars(count) {
    const label = formatStars(count);
    targets.forEach(el => {
      el.textContent = '★ ' + label;
      el.classList.add('stars-loaded');
    });
  }

  function fetchAndApply() {
    fetch(API_URL, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    })
      .then(r => {
        if (!r.ok) throw new Error('GitHub API ' + r.status);
        return r.json();
      })
      .then(data => {
        const count = data.stargazers_count;
        if (typeof count !== 'number') return;
        // Cache the result with a timestamp
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ count, ts: Date.now() }));
        } catch (_) {}
        applyStars(count);
      })
      .catch(() => {
        // Silent fail — keep showing "★ Star" placeholder
      });
  }

  // Check cache first; only hit the API if cache is stale
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && cached.count && (Date.now() - cached.ts) < CACHE_TTL) {
      applyStars(cached.count);   // instant render from cache
      return;                     // skip API call
    }
  } catch (_) {}

  fetchAndApply();
})();
