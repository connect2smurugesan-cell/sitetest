/* ============================================================
   XplurData — docs.js
   Dynamically renders all documentation from docs.json.
   No page content is hardcoded in HTML.
   ============================================================ */

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────
  let DATA = null;
  let currentPage = 'introduction';

  // ── Theme sync with main site ──────────────────────────────
  const html = document.documentElement;

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('xd-theme', theme);
    const sun  = document.getElementById('docs-icon-sun');
    const moon = document.getElementById('docs-icon-moon');
    if (sun)  sun.style.display  = theme === 'dark' ? 'block' : 'none';
    if (moon) moon.style.display = theme === 'dark' ? 'none'  : 'block';
  }

  const savedTheme = localStorage.getItem('xd-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);

  document.getElementById('docs-theme-btn')?.addEventListener('click', () => {
    applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // ── Mobile sidebar toggle ──────────────────────────────────
  document.getElementById('docs-mobile-menu-btn')?.addEventListener('click', () => {
    document.getElementById('docs-sidebar')?.classList.toggle('open');
  });

  // ── Helpers ────────────────────────────────────────────────
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // ── Section renderers ──────────────────────────────────────

  function renderCode(section, idx) {
    const id = slugify(section.title || `code-${idx}`);
    return `
      <div class="docs-section" id="${id}">
        ${section.title ? `<h3 class="docs-section-title">${esc(section.title)}</h3>` : ''}
        <div class="docs-code-block">
          <div class="docs-code-header">
            <span class="docs-code-lang">${esc(section.lang || 'bash')}</span>
            <button class="docs-copy-btn" data-code="${esc(section.code)}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy
            </button>
          </div>
          <pre class="docs-pre"><code class="docs-code lang-${esc(section.lang || 'bash')}">${esc(section.code)}</code></pre>
        </div>
      </div>`;
  }

  function renderProse(section, idx) {
    const id = slugify(section.title || `prose-${idx}`);
    return `
      <div class="docs-section" id="${id}">
        ${section.title ? `<h3 class="docs-section-title">${esc(section.title)}</h3>` : ''}
        <p class="docs-prose">${esc(section.text)}</p>
      </div>`;
  }

  function renderNote(section, idx) {
    const styleMap = { info: 'ℹ️', success: '✅', warn: '⚠️', error: '🚫' };
    const icon = styleMap[section.style] || 'ℹ️';
    return `
      <div class="docs-note docs-note--${esc(section.style || 'info')}">
        <span class="docs-note-icon">${icon}</span>
        <span>${esc(section.text)}</span>
      </div>`;
  }

  function renderTable(section, idx) {
    const id = slugify(section.title || `table-${idx}`);
    const headers = section.headers.map(h => `<th>${esc(h)}</th>`).join('');
    const rows = section.rows.map(row =>
      `<tr>${row.map(cell => `<td>${esc(cell)}</td>`).join('')}</tr>`
    ).join('');
    return `
      <div class="docs-section" id="${id}">
        ${section.title ? `<h3 class="docs-section-title">${esc(section.title)}</h3>` : ''}
        <div class="docs-table-wrap">
          <table class="docs-table">
            <thead><tr>${headers}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  }

  function renderRequirements(section, idx) {
    const id = slugify(section.title || `req-${idx}`);
    const items = section.items.map(item => `
      <div class="docs-req-item">
        <span class="docs-req-label">${esc(item.label)}</span>
        <span class="docs-req-value">${esc(item.value)}</span>
      </div>`).join('');
    return `
      <div class="docs-section" id="${id}">
        ${section.title ? `<h3 class="docs-section-title">${esc(section.title)}</h3>` : ''}
        <div class="docs-requirements">${items}</div>
      </div>`;
  }

  function renderTabs(section, idx) {
    const id = slugify(section.title || `tabs-${idx}`);
    const tabBtns = section.tabs.map((tab, i) =>
      `<button class="docs-tab-btn${i === 0 ? ' active' : ''}" data-tab-idx="${i}">${esc(tab.label)}</button>`
    ).join('');
    const tabPanels = section.tabs.map((tab, i) => `
      <div class="docs-tab-panel${i === 0 ? ' active' : ''}" data-panel-idx="${i}">
        <div class="docs-code-block">
          <div class="docs-code-header">
            <span class="docs-code-lang">${esc(tab.lang)}</span>
            <button class="docs-copy-btn" data-code="${esc(tab.code)}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy
            </button>
          </div>
          <pre class="docs-pre"><code class="docs-code lang-${esc(tab.lang)}">${esc(tab.code)}</code></pre>
        </div>
      </div>`).join('');
    return `
      <div class="docs-section" id="${id}">
        ${section.title ? `<h3 class="docs-section-title">${esc(section.title)}</h3>` : ''}
        <div class="docs-tabs-wrap" data-tabs-group="${id}">
          <div class="docs-tabs-header">${tabBtns}</div>
          <div class="docs-tabs-body">${tabPanels}</div>
        </div>
      </div>`;
  }

  function renderFaq(section, idx) {
    const id = `faq-${idx}`;
    const items = section.items.map((item, i) => `
      <details class="docs-faq-item" id="faq-${i}">
        <summary class="docs-faq-q">
          <span>${esc(item.q)}</span>
          <svg class="docs-faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </summary>
        <div class="docs-faq-a">${esc(item.a)}</div>
      </details>`).join('');
    return `<div class="docs-section docs-faq" id="${id}">${items}</div>`;
  }

  function renderDiagram(section, idx) {
    const id = slugify(section.title || `diagram-${idx}`);
    const nodes = section.nodes.map(node => `
      <div class="docs-diagram-layer">
        <div class="docs-diagram-layer-label">${esc(node.layer)}</div>
        <div class="docs-diagram-layer-items">
          ${node.items.map(item => `<div class="docs-diagram-node">${esc(item)}</div>`).join('')}
        </div>
      </div>
      <div class="docs-diagram-arrow">↓</div>`
    ).join('');
    return `
      <div class="docs-section" id="${id}">
        ${section.title ? `<h3 class="docs-section-title">${esc(section.title)}</h3>` : ''}
        <div class="docs-diagram">
          ${nodes.replace(/<div class="docs-diagram-arrow">↓<\/div>$/, '')}
        </div>
      </div>`;
  }

  function renderImage(section, idx) {
    const id = slugify(section.title || `image-${idx}`);
    const caption = section.caption ? `<figcaption class="docs-img-caption">${esc(section.caption)}</figcaption>` : '';
    const widthAttr = section.width ? `style="max-width:${esc(String(section.width))}"` : '';
    const borderClass = section.border === false ? '' : ' docs-img--bordered';
    return `
      <div class="docs-section" id="${id}">
        ${section.title ? `<h3 class="docs-section-title">${esc(section.title)}</h3>` : ''}
        <figure class="docs-img-figure${borderClass}" ${widthAttr}>
          <img
            src="${esc(section.src)}"
            alt="${esc(section.alt || section.caption || section.title || '')}"
            class="docs-img"
            loading="lazy"
          />
          ${caption}
        </figure>
      </div>`;
  }

  function renderImageGrid(section, idx) {
    const id = slugify(section.title || `imagegrid-${idx}`);
    const cols = section.cols || 2;
    const imgs = (section.images || []).map(img => `
      <figure class="docs-img-figure docs-img--bordered" style="margin:0">
        <img src="${esc(img.src)}" alt="${esc(img.alt || img.caption || '')}" class="docs-img" loading="lazy"/>
        ${img.caption ? `<figcaption class="docs-img-caption">${esc(img.caption)}</figcaption>` : ''}
      </figure>`).join('');
    return `
      <div class="docs-section" id="${id}">
        ${section.title ? `<h3 class="docs-section-title">${esc(section.title)}</h3>` : ''}
        <div class="docs-img-grid" style="grid-template-columns:repeat(${cols},1fr)">${imgs}</div>
      </div>`;
  }

  function renderSection(section, idx) {
    switch (section.type) {
      case 'code':         return renderCode(section, idx);
      case 'prose':        return renderProse(section, idx);
      case 'note':         return renderNote(section, idx);
      case 'table':        return renderTable(section, idx);
      case 'requirements': return renderRequirements(section, idx);
      case 'tabs':         return renderTabs(section, idx);
      case 'faq':          return renderFaq(section, idx);
      case 'diagram':      return renderDiagram(section, idx);
      case 'image':        return renderImage(section, idx);
      case 'image-grid':   return renderImageGrid(section, idx);
      default:             return '';
    }
  }

  // ── Page renderers ─────────────────────────────────────────

  function renderIntroPage(page) {
    const { hero, install_preview, pillars, explore_cards, access_table, badge } = page;

    // hero CTAs
    const ctas = hero.ctas.map(cta =>
      `<a href="${esc(cta.href)}" class="docs-hero-cta${cta.primary ? ' docs-hero-cta--primary' : ''}">${esc(cta.label)}</a>`
    ).join('');

    // pillars
    const pillarHtml = pillars.map(p => `
      <div class="docs-pillar">
        <div class="docs-pillar-icon">${p.icon}</div>
        <h3 class="docs-pillar-title">${esc(p.title)}</h3>
        <p class="docs-pillar-desc">${esc(p.desc)}</p>
      </div>`).join('');

    // explore cards
    const cardHtml = explore_cards.map(c => `
      <a class="docs-explore-card" href="${esc(c.href)}" data-nav="${esc(c.href.replace('#', ''))}">
        <span class="docs-explore-num">${esc(c.num)}</span>
        <div>
          <div class="docs-explore-title">${esc(c.title)}</div>
          <div class="docs-explore-desc">${esc(c.desc)}</div>
        </div>
        <span class="docs-explore-arrow">→</span>
      </a>`).join('');

    // access table
    const accessRows = access_table.rows.map(row => `
      <tr>
        <td><strong>${esc(row.service)}</strong></td>
        <td><code class="docs-inline-code">${esc(row.url)}</code></td>
        <td>${row.credentials !== '—' ? `<code class="docs-inline-code">${esc(row.credentials)}</code>` : '—'}</td>
      </tr>`).join('');

    return `
      <div class="docs-breadcrumb">
        <a href="index.html">Docs</a>
        <span>/</span>
        <span>Introduction</span>
        <a href="#quick-install" class="docs-breadcrumb-cta">Quick Install →</a>
      </div>

      <div class="docs-intro-badge">${esc(badge)}</div>

      <div class="docs-intro-hero">
        <h1 class="docs-intro-headline">${esc(hero.headline)}<br/><span class="docs-gradient-text">${esc(hero.headline2)}</span></h1>
        <p class="docs-intro-desc">${esc(hero.description)}</p>
        <div class="docs-hero-ctas">${ctas}</div>
      </div>

      <div class="docs-install-preview" id="install-preview">
        <div class="docs-code-block">
          <div class="docs-code-header">
            <span class="docs-code-lang">bash — install</span>
            <button class="docs-copy-btn" data-code="${esc(install_preview.code)}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy
            </button>
          </div>
          <pre class="docs-pre"><code class="docs-code lang-bash"><span class="dc-comment"># ${esc(install_preview.comment)}</span>\n${esc(install_preview.code)}</code></pre>
          <pre class="docs-pre docs-pre--output"><code class="docs-code">${esc(install_preview.output)}</code></pre>
        </div>
      </div>

      <div class="docs-pillars" id="pillars">${pillarHtml}</div>

      <div class="docs-explore-section" id="explore-docs">
        <h2 class="docs-section-h2">Explore the Docs</h2>
        <p class="docs-section-sub">Everything you need to get up and running quickly.</p>
        <div class="docs-explore-grid">${cardHtml}</div>
      </div>

      <div class="docs-access-section" id="access-after-install">
        <h2 class="docs-section-h2">${esc(access_table.title)}</h2>
        <p class="docs-section-sub">${esc(access_table.subtitle)}</p>
        <div class="docs-table-wrap">
          <table class="docs-table">
            <thead><tr><th>Service</th><th>URL</th><th>Credentials</th></tr></thead>
            <tbody>${accessRows}</tbody>
          </table>
        </div>
      </div>`;
  }

  function renderGenericPage(page) {
    const titleSlug = slugify(page.title);
    const sections = (page.sections || []).map((s, i) => renderSection(s, i)).join('');
    return `
      <div class="docs-breadcrumb">
        <a href="index.html">Docs</a>
        <span>/</span>
        <span>${esc(page.title)}</span>
      </div>
      <div class="docs-page-header" id="${titleSlug}">
        <h1 class="docs-page-title">${esc(page.title)}</h1>
        ${page.subtitle ? `<p class="docs-page-subtitle">${esc(page.subtitle)}</p>` : ''}
      </div>
      ${sections}`;
  }

  // ── TOC builder ────────────────────────────────────────────
  function buildTOC() {
    const toc = document.getElementById('docs-toc-nav');
    if (!toc) return;
    const headings = document.querySelectorAll('.docs-main h2[id], .docs-main h3[id], .docs-section[id]');
    if (headings.length === 0) { toc.innerHTML = '<span class="docs-toc-empty">—</span>'; return; }

    toc.innerHTML = Array.from(headings).map(el => {
      const text = el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40);
      const isH3 = el.tagName === 'H3' || el.classList.contains('docs-section');
      return `<a href="#${el.id}" class="docs-toc-link${isH3 ? ' docs-toc-link--sub' : ''}">${esc(text)}</a>`;
    }).join('');
  }

  // ── Sidebar builder ────────────────────────────────────────
  function buildSidebar() {
    const nav = document.getElementById('docs-sidenav');
    if (!nav || !DATA) return;
    nav.innerHTML = DATA.nav.map(item => `
      <a class="docs-sidenav-link${item.id === currentPage ? ' active' : ''}"
         href="#" data-page="${esc(item.id)}">
        <span class="docs-sidenav-icon">${item.icon}</span>
        ${esc(item.label)}
      </a>`).join('');

    nav.querySelectorAll('.docs-sidenav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        navigateTo(link.dataset.page);
        document.getElementById('docs-sidebar')?.classList.remove('open');
      });
    });
  }

  // ── Navigation ─────────────────────────────────────────────
  function navigateTo(pageId) {
    if (!DATA || !DATA.pages[pageId]) return;
    currentPage = pageId;

    // Update URL hash without reload
    history.pushState({ page: pageId }, '', `#${pageId}`);

    // Update sidebar active state
    document.querySelectorAll('.docs-sidenav-link').forEach(l => {
      l.classList.toggle('active', l.dataset.page === pageId);
    });

    // Render content
    const main = document.getElementById('docs-main');
    const page = DATA.pages[pageId];

    let html;
    if (pageId === 'introduction') {
      html = renderIntroPage(page);
    } else {
      html = renderGenericPage(page);
    }

    main.innerHTML = `<article class="docs-article">${html}</article>`;

    // Wire up tabs
    main.querySelectorAll('[data-tabs-group]').forEach(wrap => {
      const btns   = wrap.querySelectorAll('.docs-tab-btn');
      const panels = wrap.querySelectorAll('.docs-tab-panel');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = btn.dataset.tabIdx;
          btns.forEach(b => b.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          wrap.querySelector(`[data-panel-idx="${idx}"]`)?.classList.add('active');
        });
      });
    });

    // Wire up copy buttons
    main.querySelectorAll('.docs-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        navigator.clipboard.writeText(code).then(() => {
          btn.innerHTML = '✓ Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy';
            btn.classList.remove('copied');
          }, 2000);
        });
      });
    });

    // Wire up explore cards (navigate within docs)
    main.querySelectorAll('.docs-explore-card[data-nav]').forEach(card => {
      card.addEventListener('click', e => {
        e.preventDefault();
        navigateTo(card.dataset.nav);
      });
    });

    // Build TOC after render
    setTimeout(buildTOC, 50);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Hash routing ───────────────────────────────────────────
  function resolveHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash && DATA?.pages[hash]) {
      navigateTo(hash);
    } else {
      navigateTo('introduction');
    }
  }

  window.addEventListener('popstate', resolveHash);

  // ── Bootstrap — fetch docs.json ────────────────────────────
  fetch('docs.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      DATA = data;
      document.getElementById('docs-loading')?.remove();
      buildSidebar();
      resolveHash();
    })
    .catch(err => {
      const main = document.getElementById('docs-main');
      if (main) {
        main.innerHTML = `
          <div class="docs-error">
            <h2>Failed to load documentation</h2>
            <p>Could not fetch <code>docs.json</code>. Make sure you're serving these files via a web server (not file://).</p>
            <code style="font-size:12px;opacity:0.7">${esc(err.message)}</code>
          </div>`;
      }
      console.error('Docs load error:', err);
    });

})();
