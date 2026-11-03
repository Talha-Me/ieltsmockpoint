// build_writing_exercises_page.js
const fs = require('fs');
const path = require('path');

const readingHtml = fs.readFileSync(path.join(__dirname, '..', 'public', 'reading-exercises.html'), 'utf8');

// 1. Extract Head up to </style>
const headStart = readingHtml.indexOf('<!DOCTYPE html>');
const styleEnd = readingHtml.indexOf('</style>') + '</style>'.length;
let headPart = readingHtml.substring(headStart, styleEnd);

// Replace title & description in headPart
headPart = headPart.replace(
  /<title>.*?<\/title>/,
  '<title>IELTS Academic Writing Practice Exercises | IELTS Mockpoint</title>'
);
headPart = headPart.replace(
  /<meta name="description" content=".*?">/,
  '<meta name="description" content="Practice IELTS Academic Writing questions by task type with authentic tasks taken from Cambridge IELTS tests in the modern exam interface.">'
);
headPart = headPart.replace(
  /<link rel="canonical" href=".*?">/,
  '<link rel="canonical" href="https://www.ieltsmockpoint.com/writing-exercises">'
);

// Add custom style for Task 1 thumbnail and pill task2 if needed
const extraCss = `
    /* Task 1 Visual Thumbnail */
    .card-thumb {
      width: 100%;
      height: 110px;
      object-fit: cover;
      border-radius: 12px;
      margin-bottom: 14px;
      border: 1.5px solid var(--line);
      background: var(--surface);
      display: block;
    }
    .card .pill.pill-task2 {
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
    }
`;
headPart = headPart.replace('</style>', extraCss + '\n  </style>');

// 2. Extract shared header & mobile sidebar
const bodyStart = readingHtml.indexOf('<body>');
const mainStart = readingHtml.indexOf('<main');
let navAndSidebar = readingHtml.substring(styleEnd, mainStart);

// 3. Extract shared footer & modal
const mainEnd = readingHtml.indexOf('</main>') + '</main>'.length;
const scriptStart = readingHtml.indexOf('<script>', mainEnd);
let footerAndModal = readingHtml.substring(mainEnd, scriptStart);

// 4. Construct the Main content area
const mainContent = `
  <main class="wrap">
    <!-- Breadcrumbs -->
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/home.html">Home</a>
      <span class="sep">/</span>
      <a href="/practice-hub">Practice Hub</a>
      <span class="sep">/</span>
      <a href="/cambridge-writing.html">Writing</a>
      <span class="sep">/</span>
      <span class="current" id="bcType">Bar Chart</span>
    </nav>

    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title" id="pageTitle">IELTS Academic Writing Bar Chart Practice Exercises</h1>
      <p class="page-subtitle" id="pageSubtitle">
        Practice IELTS Academic Writing <strong id="typeBoldText">Bar Chart</strong> questions with authentic tasks taken from Cambridge IELTS tests in the modern exam interface. Timed interface, live word count, and instant AI band score evaluation.
      </p>
    </div>

    <!-- Question Types Switcher Pills -->
    <div class="type-switcher" id="typeSwitcher">
      <button class="type-pill active" data-type="Bar-Chart">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
        <span>Bar Chart</span>
        <em>0</em>
      </button>
      <button class="type-pill" data-type="Line-Graph">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        <span>Line Graph</span>
        <em>0</em>
      </button>
      <button class="type-pill" data-type="Pie-Chart">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
        <span>Pie Chart</span>
        <em>0</em>
      </button>
      <button class="type-pill" data-type="Table">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
        <span>Table</span>
        <em>0</em>
      </button>
      <button class="type-pill" data-type="Process-Diagram">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        <span>Process Diagram</span>
        <em>0</em>
      </button>
      <button class="type-pill" data-type="Map">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
        <span>Map Comparison</span>
        <em>0</em>
      </button>
      <button class="type-pill" data-type="Mixed-Charts">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>
        <span>Mixed Charts</span>
        <em>0</em>
      </button>
      <button class="type-pill" data-type="Opinion-Essay">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span>Opinion Essay</span>
        <em>0</em>
      </button>
      <button class="type-pill" data-type="Discussion-Essay">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v4l-4-4H9a2 2 0 0 1-2-2v-1"/><path d="M3 13V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7l-4 4v-4H5a2 2 0 0 1-2-2z"/></svg>
        <span>Discussion Essay</span>
        <em>0</em>
      </button>
      <button class="type-pill" data-type="Advantages-Disadvantages">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"/><polyline points="18 8 22 12 18 16"/><line x1="6" y1="12" x2="22" y2="12"/></svg>
        <span>Advantages & Disadvantages</span>
        <em>0</em>
      </button>
      <button class="type-pill" data-type="Two-Part-Question">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span>Two-Part Question</span>
        <em>0</em>
      </button>
      <button class="type-pill" data-type="Problem-Solution">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        <span>Problem & Solution</span>
        <em>0</em>
      </button>
      <button class="type-pill" data-type="Positive-Negative">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        <span>Positive or Negative</span>
        <em>0</em>
      </button>
    </div>

    <!-- Section Bar with Criteria Switcher -->
    <div class="section-bar">
      <div class="sec-left">
        <div class="sec-h">
          <h2>Practice Exercises</h2>
          <span class="count-badge" id="badgeCount">— exercises</span>
        </div>
      </div>
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
        <input type="search" id="searchExercises" placeholder="Search test, set, prompt..." aria-label="Search exercises">
      </div>
    </div>

    <!-- Exercises Cards Grid -->
    <div class="grid" id="exercisesGrid">
      <div class="sk-card"></div>
      <div class="sk-card"></div>
      <div class="sk-card"></div>
      <div class="sk-card"></div>
      <div class="sk-card"></div>
      <div class="sk-card"></div>
    </div>
  </main>
`;

// 5. Client Script
const scriptPart = `
  <script>
    let currentType = 'Bar-Chart';
    let allExercises = [];
    let doneStore = {};
    try {
      doneStore = JSON.parse(localStorage.getItem('mp_done') || '{}');
    } catch(e) {}

    const grid = document.getElementById('exercisesGrid');
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');
    const typeBoldText = document.getElementById('typeBoldText');
    const badgeCount = document.getElementById('badgeCount');
    const bcType = document.getElementById('bcType');
    const searchInput = document.getElementById('searchExercises');
    const typeSwitcher = document.getElementById('typeSwitcher');

    // Parse URL param if provided (e.g. ?type=Line-Graph)
    const urlParams = new URLSearchParams(window.location.search);
    const initialType = urlParams.get('type');
    if (initialType) {
      const decoded = decodeURIComponent(initialType).replace(/[-_\\s]+/g, '').toLowerCase();
      const matchedBtn = Array.from(typeSwitcher.querySelectorAll('.type-pill')).find(btn => {
        const t = btn.dataset.type.replace(/[-_\\s]+/g, '').toLowerCase();
        return t === decoded || t.includes(decoded) || decoded.includes(t);
      });
      if (matchedBtn) {
        currentType = matchedBtn.dataset.type;
        typeSwitcher.querySelectorAll('.type-pill').forEach(b => b.classList.remove('active'));
        matchedBtn.classList.add('active');
      }
    }

    const typeDisplayNames = {
      'Bar-Chart': 'Bar Chart', 'Line-Graph': 'Line Graph', 'Pie-Chart': 'Pie Chart',
      'Table': 'Table', 'Process-Diagram': 'Process Diagram', 'Map': 'Map Comparison',
      'Mixed-Charts': 'Mixed Charts', 'Opinion-Essay': 'Opinion Essay',
      'Discussion-Essay': 'Discussion Essay', 'Advantages-Disadvantages': 'Advantages & Disadvantages',
      'Two-Part-Question': 'Two-Part Question', 'Problem-Solution': 'Problem & Solution',
      'Positive-Negative': 'Positive or Negative'
    };

    let exPhase = 1;
    let exFreeQuota = 2;

    fetch('/api/system-settings')
      .then(r => r.json())
      .then(d => {
        if (d && d.success && d.settings) {
          exPhase = Number(d.settings.currentPhase) || 1;
          exFreeQuota = d.settings.freePracticeHubSets !== undefined ? Number(d.settings.freePracticeHubSets) : 2;
          applyFilterAndSearch();
        }
      }).catch(() => {});

    function isExerciseLocked(idx) {
      if (exPhase === 1) return false;
      let user = null;
      try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch(e) {}
      const isLoggedIn = !!(user && (user.email || user.name));
      const isPremium = !!(user && (user.isPremium || user.role === 'admin' || user.plan === 'premium'));
      if (exPhase === 2 && isLoggedIn) return false;
      if (exPhase === 3 && isPremium) return false;
      return idx >= exFreeQuota;
    }

    function openExUnlockModal(phaseOverride) {
      const phase = phaseOverride || exPhase;
      const modal = document.getElementById('ex-unlock-modal');
      if (!modal) return;
      const iconWrap = document.getElementById('exUnlockIconWrap');
      const tagBadge = document.getElementById('exUnlockBadge');
      const titleEl = document.getElementById('exUnlockTitle');
      const descEl = document.getElementById('exUnlockDesc');
      const primaryBtn = document.getElementById('exUnlockPrimaryBtn');

      if (phase === 3) {
        if (iconWrap) {
          iconWrap.style.background = 'rgba(224, 32, 45, 0.08)';
          iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
          iconWrap.style.color = '#e0202d';
          iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>';
        }
        if (tagBadge) {
          tagBadge.style.background = '#fee2e2';
          tagBadge.style.color = '#b91c1c';
          tagBadge.textContent = 'PREMIUM PLAN REQUIRED';
        }
        if (titleEl) titleEl.textContent = 'Unlock with Premium Access';
        if (descEl) descEl.textContent = 'Upgrade to IELTS Mockpoint Premium or purchase a test pass to unlock all Writing exercises without limits.';
        if (primaryBtn) {
          primaryBtn.style.background = '#e0202d';
          primaryBtn.href = '/pricing';
          primaryBtn.innerHTML = '<span>Upgrade to Premium / Buy Pass</span> &rarr;';
        }
      } else {
        if (iconWrap) {
          iconWrap.style.background = '#fdecee';
          iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
          iconWrap.style.color = '#e0202d';
          iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e0202d" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
        }
        if (tagBadge) {
          tagBadge.style.background = '#fdecee';
          tagBadge.style.color = '#e0202d';
          tagBadge.style.border = '1px solid rgba(224, 32, 45, 0.25)';
          tagBadge.textContent = 'FREE CANDIDATE ACCOUNT';
        }
        if (titleEl) titleEl.textContent = 'Sign In Required to Unlock';
        if (descEl) descEl.textContent = 'Please log in or create a free candidate account to practice all Writing exercises for every question type and save your progress to your personal dashboard.';
        if (primaryBtn) {
          primaryBtn.style.background = '#e0202d';
          primaryBtn.style.boxShadow = '0 8px 20px rgba(224, 32, 45, 0.28)';
          primaryBtn.href = '/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
          primaryBtn.innerHTML = '<span>Sign In / Register Free</span> &rarr;';
        }
      }

      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeExUnlockModal() {
      const modal = document.getElementById('ex-unlock-modal');
      if (modal) modal.style.display = 'none';
      document.body.style.overflow = '';
    }
    window.openExUnlockModal = openExUnlockModal;
    window.closeExUnlockModal = closeExUnlockModal;

    async function loadExercises(type) {
      currentType = type;
      grid.innerHTML = '<div class="sk-card"></div>'.repeat(6);

      try {
        const res = await fetch(\`/api/writing-exercises?type=\${encodeURIComponent(type)}\`);
        const data = await res.json();

        if (data.success && Array.isArray(data.exercises)) {
          allExercises = data.exercises;
          applyFilterAndSearch();
          updateHeaderInfo(data.typeName || typeDisplayNames[type] || type, data.totalExercises || allExercises.length);

          if (data.categoryCounts) {
            typeSwitcher.querySelectorAll('.type-pill').forEach(btn => {
              const t = btn.dataset.type;
              const count = data.categoryCounts[t];
              if (count !== undefined) {
                const em = btn.querySelector('em');
                if (em) em.textContent = count;
              }
            });
          }
        } else {
          grid.innerHTML = \`
            <div class="empty-state">
              <h3>No exercises found</h3>
              <p>No practice exercises currently available for this question type.</p>
            </div>
          \`;
        }
      } catch (err) {
        console.error('Fetch error:', err);
        grid.innerHTML = \`
          <div class="empty-state">
            <h3>Unable to load exercises</h3>
            <p>Please check your connection and try again.</p>
          </div>
        \`;
      }
    }

    function updateHeaderInfo(typeName, count) {
      document.title = \`IELTS Academic Writing \${typeName} Practice Exercises | IELTS Mockpoint\`;
      pageTitle.textContent = \`IELTS Academic Writing \${typeName} Practice Exercises\`;
      typeBoldText.textContent = typeName;
      badgeCount.textContent = \`\${count} exercise\${count === 1 ? '' : 's'}\`;
      bcType.textContent = typeName;
    }

    function applyFilterAndSearch() {
      const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
      let list = allExercises;

      if (q) {
        list = list.filter(ex =>
          ex.title.toLowerCase().includes(q) ||
          ex.source.toLowerCase().includes(q) ||
          String(ex.setNumber || '') === q
        );
      }

      renderExercises(list);
      badgeCount.textContent = \`\${list.length} exercise\${list.length === 1 ? '' : 's'}\`;
    }

    function renderExercises(items) {
      if (!items.length) {
        grid.innerHTML = \`
          <div class="empty-state">
            <h3>No matching exercises</h3>
            <p>Try searching for a different keyword or selecting another task type.</p>
          </div>
        \`;
        return;
      }

      const isTask2 = ['Opinion-Essay','Discussion-Essay','Problem-Solution','Advantages-Disadvantages','Two-Part-Question','Positive-Negative'].includes(currentType);

      grid.innerHTML = items.map((ex, idx) => {
        const storageKey = \`cw|\${ex.type}|\${ex.pracNumber}\`;
        const isDone = !!doneStore[storageKey];
        const numStr = String(ex.setNumber || idx + 1).padStart(2, '0');
        const pillClass = isTask2 ? 'pill pill-task2' : 'pill pill-cambridge';
        const pillText = ex.source.toUpperCase().includes('CAMBRIDGE')
          ? ex.source.toUpperCase()
          : \`CAMBRIDGE • \${isTask2 ? 'TASK 2' : 'TASK 1'} • SET \${ex.setNumber}\`;
        const titleText = ex.title || \`\${typeDisplayNames[ex.type] || ex.type} \${ex.setNumber}\`;
        const sourceText = ex.source ? \`from \${ex.source} Academic Writing\` : 'from Cambridge IELTS Tests';
        const isLocked = isExerciseLocked(idx);

        const btnHtml = isLocked
          ? '<button type="button" class="btn btn-red btn-locked" onclick="openExUnlockModal()">Start practice &rarr;</button>'
          : \`<a href="\${ex.link}" target="_blank" rel="noopener noreferrer" class="btn btn-red" onclick="markDone('\${storageKey}')">Start practice &rarr;</a>\`;

        return \`
          <article class="card \${isDone ? 'done' : ''} \${isLocked ? 'is-locked' : ''}" data-k="\${storageKey}" onclick="\${isLocked ? 'openExUnlockModal()' : ''}">
            \${isLocked ? \`
              <div class="card-center-lock" aria-hidden="true">
                <div class="center-lock-circle">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                </div>
              </div>
            \` : ''}
            <span class="bignum">\${numStr}</span>
            <span class="\${pillClass}">\${escapeHtml(pillText)}</span>
            \${ex.image ? \`<img class="card-thumb" src="\${ex.image}" alt="Task 1 Visual" loading="lazy" onerror="this.style.display='none'">\` : ''}
            <h3>\${escapeHtml(titleText)}</h3>
            <div class="sub-source">\${escapeHtml(sourceText)}</div>
            <div class="chips">
              <span class="q-range-chip">\${isTask2 ? 'Task 2 · Essay' : 'Task 1 · Visual'}</span>
              <span>\${isTask2 ? '40 min • 250+ words' : '20 min • 150+ words'}</span>
              \${isDone ? '<span class="done">Completed ✓</span>' : ''}
            </div>
            <div class="card-actions">
              \${btnHtml}
            </div>
            \${isLocked ? \`
              <div class="card-bottom-unlock">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Unlock Exercise &rsaquo;</span>
              </div>
            \` : ''}
          </article>
        \`;
      }).join('');

      wireTilt();
    }

    function wireTilt() {
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        card.addEventListener('mousemove', e => {
          if (matchMedia('(hover:none)').matches) return;
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          card.style.setProperty('--mx', (x * 100) + '%');
          card.style.setProperty('--my', (y * 100) + '%');
          card.style.setProperty('--ry', ((x - 0.5) * 8) + 'deg');
          card.style.setProperty('--rx', ((0.5 - y) * 8) + 'deg');
        });
        card.addEventListener('mouseleave', () => {
          card.style.setProperty('--rx', '0deg');
          card.style.setProperty('--ry', '0deg');
          card.style.setProperty('--mx', '50%');
          card.style.setProperty('--my', '50%');
        });
      });
    }

    window.markDone = function(key) {
      doneStore[key] = 1;
      try {
        localStorage.setItem('mp_done', JSON.stringify(doneStore));
      } catch(e) {}
    };

    function escapeHtml(str) {
      return String(str || '').replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[m]));
    }

    typeSwitcher.addEventListener('click', (e) => {
      const btn = e.target.closest('.type-pill');
      if (!btn) return;
      typeSwitcher.querySelectorAll('.type-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const newType = btn.dataset.type;
      history.pushState(null, '', \`?type=\${encodeURIComponent(newType)}\`);
      loadExercises(newType);
    });

    searchInput.addEventListener('input', applyFilterAndSearch);

    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - h.clientHeight || 1)) * 100;
      document.getElementById('prog').style.width = pct + '%';
      document.getElementById('hd').classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    loadExercises(currentType);
  </script>

  <!-- Exercise Unlock Modal -->
  <div id="ex-unlock-modal" style="position:fixed; inset:0; z-index:99999; background:rgba(11,43,82,0.58); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); display:none; align-items:center; justify-content:center; padding:16px;" onclick="if(event.target===this)closeExUnlockModal();">
    <div style="background:#fff; border-radius:24px; max-width:440px; width:100%; text-align:center; padding:36px 30px; position:relative; box-shadow:0 24px 60px rgba(11,43,82,0.24); border:1.5px solid #dbeafe; overflow:hidden;">
      <div style="position:absolute; top:0; left:0; width:100%; height:4px; background:linear-gradient(90deg, #0b2b52 0%, #1565c9 50%, #e0202d 100%);"></div>
      <button type="button" onclick="closeExUnlockModal()" style="position:absolute; right:16px; top:16px; width:34px; height:34px; border-radius:50%; border:1px solid #e2e8f0; background:#f8fafc; color:#0b2b52; font-size:18px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;">&times;</button>
      <div id="exUnlockIconWrap" style="width:58px; height:58px; border-radius:16px; background:#fdecee; border:1.5px solid rgba(224, 32, 45, 0.28); display:inline-flex; align-items:center; justify-content:center; color:#e0202d; margin:0 auto 16px;">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e0202d" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
      </div>
      <div id="exUnlockBadge" style="display:inline-block; font-size:0.75rem; font-weight:800; letter-spacing:0.06em; padding:4px 12px; border-radius:999px; margin-bottom:12px; background:#fdecee; color:#e0202d; border:1px solid rgba(224, 32, 45, 0.25);">FREE CANDIDATE ACCOUNT</div>
      <h3 id="exUnlockTitle" style="font-family:'Sora',sans-serif; font-size:1.35rem; font-weight:800; color:#0b2b52; margin-bottom:10px; line-height:1.3;">Sign In Required to Unlock</h3>
      <p id="exUnlockDesc" style="font-size:0.89rem; color:#475569; line-height:1.6; margin-bottom:24px;">
        Please log in or create a free candidate account to practice all Writing exercises for every task type and save your progress to your personal dashboard.
      </p>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <a href="/login?redirect=" id="exUnlockPrimaryBtn" style="padding:13px 22px; border-radius:12px; background:#e0202d; color:#fff; text-decoration:none; font-weight:700; font-size:0.95rem; font-family:'Sora',sans-serif; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 8px 20px rgba(224, 32, 45, 0.28); transition:all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);">
          <span>Sign In / Register Free</span> &rarr;
        </a>
        <button type="button" onclick="closeExUnlockModal()" style="padding:11px 18px; border-radius:12px; background:#f8fafc; border:1.5px solid #dbeafe; color:#0b2b52; font-weight:700; font-size:0.88rem; font-family:'Sora',sans-serif; cursor:pointer; transition:all 0.2s;">
          Maybe Later
        </button>
      </div>
    </div>
  </div>

  <!-- Reset modal on pageshow -->
  <script>
    window.addEventListener('pageshow', () => {
      try { closeExUnlockModal(); } catch(e) {}
      document.body.style.overflow = '';
    });
  </script>
</body>
</html>
`;

const finalHtml = headPart + navAndSidebar + mainContent + footerAndModal + scriptPart;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'writing-exercises.html'), finalHtml, 'utf8');
console.log('✅ Generated public/writing-exercises.html successfully! Size:', finalHtml.length);
