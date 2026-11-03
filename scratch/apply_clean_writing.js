const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'cambridge-writing.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove the dead commented out block if present
const commentEndMarker = '</html> -->';
const commentEndIdx = content.indexOf(commentEndMarker);
if (commentEndIdx !== -1) {
  content = content.substring(commentEndIdx + commentEndMarker.length).trimStart();
  console.log('Removed dead commented-out HTML header');
}

// 2. Update .btn and add .ripple in real CSS
const oldBtn = `.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 22px;border-radius:9px;font-size:.92rem;font-weight:700;text-decoration:none;border:1.5px solid transparent;cursor:pointer;font-family:inherit;transition:transform .15s,box-shadow .2s,background .2s,color .2s,border-color .2s;}
.btn-red{background:var(--red);color:#fff;}
.btn-red:hover{background:var(--red-dark);transform:translateY(-2px);box-shadow:0 10px 22px rgba(224,32,45,.28);}
.btn-outline{color:var(--navy);border-color:var(--line);background:#fff;}
.btn-outline:hover{border-color:var(--blue);color:var(--blue);}
.btn-blue{background:var(--blue);color:#fff;}
.btn-blue:hover{background:var(--navy);transform:translateY(-2px);}`;

const newBtn = `.btn{position:relative;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 22px;border-radius:9px;font-size:.92rem;font-weight:700;text-decoration:none;border:1.5px solid transparent;cursor:pointer;font-family:inherit;transition:transform .15s,box-shadow .2s,background .2s,color .2s,border-color .2s;}
.btn-red{background:var(--red);color:#fff;}
.btn-red:hover{background:var(--red-dark);transform:translateY(-2px);box-shadow:0 10px 22px rgba(224,32,45,.28);}
.btn-outline{color:var(--navy);border-color:var(--line);background:#fff;}
.btn-outline:hover{border-color:var(--blue);color:var(--blue);}
.btn-blue{background:var(--blue);color:#fff;}
.btn-blue:hover{background:var(--navy);transform:translateY(-2px);}
.ripple{position:absolute;border-radius:50%;background:rgba(255,255,255,.45);transform:scale(0);animation:rip .6s ease-out forwards;pointer-events:none;}
.btn-outline .ripple{background:rgba(21,101,201,.18);}
@keyframes rip{to{transform:scale(4);opacity:0;}}`;

if (content.includes(oldBtn)) {
  content = content.replace(oldBtn, newBtn);
  console.log('Updated .btn and .ripple');
} else {
  // Regex replacement
  content = content.replace(/\.btn\{display:inline-flex[\s\S]*?\.btn-blue:hover\{background:var\(--navy\);transform:translateY\(-2px\);\}/, newBtn);
  console.log('Updated .btn and .ripple via regex');
}

// 3. Replace .bar to .acts CSS block with toolbar, popover, and card CSS
const oldCssBlockRegex = /\.bar\{display:flex;align-items:center[\s\S]*?\.acts \.sub \.btn\{flex:1;padding:8px 4px;font-size:\.78rem;\}/;

const newCssBlock = `/* TOOLBAR */
.tabs{display:flex;justify-content:center;gap:10px;margin:36px 0 22px;flex-wrap:wrap;}
.tab{display:inline-flex;align-items:center;gap:10px;padding:11px 20px;border-radius:999px;border:1.5px solid var(--line);background:#fff;color:var(--muted);font-family:inherit;font-weight:700;font-size:.9rem;cursor:pointer;transition:all .25s;}
.tab em{font-style:normal;font-size:.72rem;background:var(--surface);color:var(--muted);padding:2px 9px;border-radius:999px;transition:all .25s;}
.tab:hover{border-color:var(--blue);color:var(--blue);transform:translateY(-2px);}
.tab.active{background:var(--navy);border-color:var(--navy);color:#fff;box-shadow:0 12px 24px rgba(11,43,82,.22);}
.tab.active em{background:var(--red);color:#fff;}
.toolbar{display:flex;justify-content:center;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:38px;}
.search{position:relative;flex:1 1 280px;max-width:380px;}
.search svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:18px;height:18px;color:var(--muted);pointer-events:none;transition:color .2s;}
.search input{width:100%;padding:12px 16px 12px 42px;border-radius:12px;border:1.5px solid var(--line);background:#fff;font-family:inherit;font-size:.92rem;color:var(--text);transition:border-color .2s,box-shadow .2s;}
.search input:focus{outline:none;border-color:var(--blue);box-shadow:0 0 0 4px var(--blue-light);}
.search:focus-within svg{color:var(--blue);}
.seg{display:inline-flex;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:4px;}
.seg button{border:none;background:none;font-family:inherit;font-weight:700;font-size:.82rem;color:var(--muted);padding:8px 14px;border-radius:9px;cursor:pointer;transition:all .2s;}
.seg button.on{background:#fff;color:var(--navy);box-shadow:0 2px 8px rgba(11,43,82,.12);}
.seg button:hover:not(.on){color:var(--blue);}
.resultcount{text-align:center;color:var(--muted);font-size:.85rem;margin:-18px 0 26px;min-height:1.2em;}

/* GRID & CARDS */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:24px;padding-bottom:70px;min-height:320px;perspective:1200px;}
.card{--rx:0deg;--ry:0deg;--ty:0px;--mx:50%;--my:50%;position:relative;background:#fff;border:1.5px solid var(--line);border-radius:20px;padding:26px 22px 24px;display:flex;flex-direction:column;opacity:0;translate:0 16px;animation:rise .5s ease forwards;transform:rotateX(var(--rx)) rotateY(var(--ry)) translateY(var(--ty));transition:transform .2s ease-out,border-color .25s,box-shadow .25s;will-change:transform;}
@keyframes rise{to{opacity:1;translate:0 0;}}
.card::before{content:'';position:absolute;left:0;top:0;height:4px;width:100%;background:linear-gradient(90deg,var(--blue),var(--red));transform:scaleX(0);transform-origin:left;transition:transform .35s;border-radius:20px 20px 0 0;}
.card::after{content:'';position:absolute;inset:0;border-radius:20px;background:radial-gradient(260px circle at var(--mx) var(--my),rgba(21,101,201,.10),transparent 60%);opacity:0;transition:opacity .3s;pointer-events:none;}
.card:hover,.card.open-card{--ty:-8px;border-color:var(--blue);box-shadow:0 22px 44px rgba(21,101,201,.14);}
.card:hover::before{transform:scaleX(1);}
.card:hover::after{opacity:1;}
.card.open-card{z-index:40;}
.card .bignum{position:absolute;right:16px;top:-2px;font-family:'Sora',sans-serif;font-weight:800;font-size:4.8rem;color:var(--blue-light);line-height:1;transition:color .3s,transform .4s;user-select:none;pointer-events:none;}
.card:hover .bignum{color:#fdecee;transform:scale(1.08) translateX(-4px);}
.card .pill{position:relative;align-self:flex-start;max-width:85%;font-size:.68rem;font-weight:800;letter-spacing:.06em;padding:5px 12px;border-radius:999px;background:var(--blue-light);color:var(--blue);margin-bottom:38px;}
.card h3{position:relative;font-size:1.24rem;margin-bottom:14px;}
.card p.card-desc{position:relative;color:var(--muted);font-size:.86rem;margin-bottom:14px;line-height:1.5;}
.card .chips{position:relative;display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px;}
.card .chips span{font-size:.76rem;font-weight:600;color:var(--muted);background:var(--surface);border-radius:8px;padding:5px 10px;}
.card .chips span.done{background:#e6f7ee;color:#137a3f;font-weight:700;}

.card-actions{display:grid;grid-template-columns:1.1fr 1fr;gap:10px;position:relative;margin-top:auto;}
.card-actions .btn{width:100%;font-size:.84rem;padding:10px 6px;text-align:center;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;}
.practice-drop-wrap{position:relative;}
.part-popover{position:absolute;bottom:calc(100% + 10px);left:0;right:0;min-width:180px;background:#fff;border:1.5px solid var(--line);border-radius:14px;box-shadow:0 14px 30px rgba(11,43,82,.18);padding:10px;display:flex;flex-direction:column;gap:6px;z-index:30;opacity:0;transform:translateY(8px) scale(.96);transform-origin:bottom center;pointer-events:none;transition:opacity .2s,transform .2s;}
.part-popover.open{opacity:1;transform:none;pointer-events:auto;}
.part-popover a{padding:9px 12px;border-radius:8px;font-size:.82rem;font-weight:600;color:var(--navy);text-decoration:none;display:flex;justify-content:space-between;align-items:center;background:var(--surface);transition:background .2s,color .2s,transform .2s;}
.part-popover a:hover{background:var(--blue-light);color:var(--blue);transform:translateX(3px);}
.part-popover a span{font-size:.72rem;color:var(--muted);}
.btn .caret{display:inline-block;transition:transform .25s;}
.btn[aria-expanded="true"] .caret{transform:rotate(180deg);}

.empty{grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);}
.empty strong{display:block;font-family:'Sora',sans-serif;color:var(--navy);font-size:1.2rem;margin-bottom:8px;}`;

if (oldCssBlockRegex.test(content)) {
  content = content.replace(oldCssBlockRegex, newCssBlock);
  console.log('Updated CSS block for toolbar and cards');
} else {
  console.warn('oldCssBlockRegex did not match');
}

// 4. Update Stats numbers (40 tests, 80 tasks)
content = content.replace('<div class="stat"><b data-n="28">0</b><span>Writing tests</span></div>', '<div class="stat"><b data-n="40">0</b><span>Writing tests</span></div>');
content = content.replace('<div class="stat"><b data-n="56">0</b><span>Tasks to practise</span></div>', '<div class="stat"><b data-n="80">0</b><span>Tasks to practise</span></div>');

// 5. Update Tests Section HTML
const oldHtmlSectionRegex = /<h2 class="reveal" style="text-align:center;font-size:clamp\(1\.6rem,2\.8vw,2\.1rem\);">Cambridge IELTS Writing Tests – Free Online Practice<\/h2>[\s\S]*?<div class="grid" id="testGrid"><\/div>/;

const newHtmlSection = `<h2 id="tests" style="scroll-margin-top:94px;text-align:center;font-size:clamp(1.6rem,2.8vw,2.1rem);margin-top:44px;" class="reveal">Cambridge IELTS Writing Tests – Free Online Practice</h2>
  <p class="reveal" style="text-align:center;color:var(--muted);max-width:64ch;margin:10px auto 0;font-size:.98rem;">Choose any book from Cambridge IELTS 12 to 21 and start your free IELTS writing practice test. Hit <strong style="color:var(--navy)">Take Test</strong> for the full 60-minute test or open <strong style="color:var(--navy)">Practice</strong> to work on Task 1 or Task 2 individually.</p>

  <div class="tabs" role="tablist" id="tabs"></div>

  <div class="toolbar">
    <label class="search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input id="q" type="search" placeholder="Search e.g. 19 test 2" aria-label="Search IELTS writing practice tests" autocomplete="off">
    </label>
    <div class="seg" id="sort" role="group" aria-label="Sort order">
      <button class="on" data-sort="new" type="button">Newest first</button>
      <button data-sort="old" type="button">Oldest first</button>
    </div>
  </div>

  <p class="resultcount" id="rc"></p>

  <div class="grid" id="grid"></div>`;

if (oldHtmlSectionRegex.test(content)) {
  content = content.replace(oldHtmlSectionRegex, newHtmlSection);
  console.log('Updated HTML section for tests, toolbar and grid');
} else {
  console.warn('oldHtmlSectionRegex did not match');
}

// 6. Update Script Section
const oldScriptRegex = /\/\/ Redirect functions for Cambridge Writing[\s\S]*?<\/script>/;

const newScript = `/* Button ripple effect */
document.addEventListener('click', e => {
  const b = e.target.closest('.btn');
  if (!b) return;
  const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) / 3, d = document.createElement('span');
  d.className = 'ripple';
  d.style.cssText = \`width:\${s}px;height:\${s}px;left:\${e.clientX - r.left - s / 2}px;top:\${e.clientY - r.top - s / 2}px\`;
  b.appendChild(d);
  setTimeout(() => d.remove(), 600);
});

/* ---------- Cambridge Tests Dataset (Books 12 to 21) ---------- */
const cambridgeTests = [];
for (let book = 21; book >= 12; book--) {
  for (let t = 1; t <= 4; t++) {
    cambridgeTests.push({
      book,
      testNo: t,
      title: \`Cambridge \${book} Writing Test \${String(t).padStart(2, '0')}\`,
      questions: 2,
      status: "Active"
    });
  }
}

const books = [...new Set(cambridgeTests.map(t => t.book))].sort((a, b) => b - a);

/* ---------- State ---------- */
let filter = 'ALL', query = '', order = 'new';
const grid = document.getElementById('grid'),
      tabsEl = document.getElementById('tabs'),
      rc = document.getElementById('rc');

const done = (() => {
  try {
    return JSON.parse(localStorage.getItem('mp_writing_done') || '{}');
  } catch (e) {
    return {};
  }
})();
const saveDone = () => {
  try {
    localStorage.setItem('mp_writing_done', JSON.stringify(done));
  } catch (e) {}
};

function setupTabs() {
  tabsEl.innerHTML = \`<button class="tab active" data-filter="ALL">All Tests <em>\${cambridgeTests.length}</em></button>\` +
    books.map(b => \`<button class="tab" data-filter="\${b}">Cambridge \${b} <em>\${cambridgeTests.filter(t => t.book === b).length}</em></button>\`).join('');
}

tabsEl.addEventListener('click', e => {
  const b = e.target.closest('.tab');
  if (!b) return;
  tabsEl.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  filter = b.dataset.filter;
  render();
});

document.getElementById('q').addEventListener('input', e => {
  query = e.target.value.trim().toLowerCase();
  render();
});

document.getElementById('sort').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  document.querySelectorAll('#sort button').forEach(x => x.classList.remove('on'));
  b.classList.add('on');
  order = b.dataset.sort;
  render();
});

/* ---------- Filtering & Rendering ---------- */
function matches(t) {
  if (filter !== 'ALL' && String(t.book) !== filter) return false;
  if (!query) return true;
  const hay = \`cambridge \${t.book} test \${t.testNo} \${t.book} \${t.testNo} writing\`.toLowerCase();
  return query.split(/\\s+/).every(w => hay.includes(w));
}

function render() {
  const list = cambridgeTests.filter(matches).sort((a, b) => {
    if (order === 'new') {
      return (b.book - a.book) || (a.testNo - b.testNo);
    } else {
      return (a.book - b.book) || (a.testNo - b.testNo);
    }
  });

  grid.innerHTML = '';
  rc.textContent = list.length ? \`Showing \${list.length} of \${cambridgeTests.length} tests\` : '';
  if (!list.length) {
    grid.innerHTML = \`<div class="empty"><strong>No tests found</strong>Try a different search, like "19" or "test 2", or pick All Tests.</div>\`;
    return;
  }

  list.forEach((t, i) => {
    const pad = String(t.testNo).padStart(2, '0');
    const key = \`cw|\${t.book}|\${t.testNo}\`;
    const fullTestUrl = \`/cambridge/writing/\${t.book}/\${t.testNo}\`;
    const id = \`pop-w-\${t.book}-\${t.testNo}\`;
    const isDone = done[key] || done[\`\${key}|1\`] || done[\`\${key}|2\`];

    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = Math.min(i * 40, 600) + 'ms';
    card.innerHTML = \`
      <span class="bignum">\${pad}</span>
      <span class="pill">CAMBRIDGE \${t.book}</span>
      <h3>Cambridge \${t.book} Writing Test \${pad}</h3>
      <p class="card-desc">Free IELTS Academic Writing practice with authentic Cambridge Task 1 and Task 2 questions.</p>
      <div class="chips">
        <span>⏱ 60 Min Timer</span>
        <span>2 Tasks</span>
        <span>150+ & 250+ Words</span>
        \${isDone ? '<span class="done">✓ Attempted</span>' : ''}
      </div>
      <div class="card-actions">
        <a href="\${fullTestUrl}" class="btn btn-red" data-key="\${key}" title="Free IELTS Writing practice test – Cambridge \${t.book} Test \${pad}">Take Test →</a>
        <div class="practice-drop-wrap">
          <button type="button" class="btn btn-outline" aria-haspopup="true" aria-expanded="false" aria-controls="\${id}">Practice <span class="caret">▾</span></button>
          <div class="part-popover" id="\${id}" role="menu">
            <a role="menuitem" href="\${fullTestUrl}?task=1" data-key="\${key}|1">Part 1 <span>Task 1 · 20 min</span></a>
            <a role="menuitem" href="\${fullTestUrl}?task=2" data-key="\${key}|2">Part 2 <span>Task 2 · 40 min</span></a>
          </div>
        </div>
      </div>\`;

    /* 3D tilt + spotlight */
    card.addEventListener('mousemove', e => {
      if (matchMedia('(hover:none)').matches) return;
      const r = card.getBoundingClientRect(),
            x = (e.clientX - r.left) / r.width,
            y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', x * 100 + '%');
      card.style.setProperty('--my', y * 100 + '%');
      card.style.setProperty('--ry', ((x - .5) * 6) + 'deg');
      card.style.setProperty('--rx', ((.5 - y) * 6) + 'deg');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });

    grid.appendChild(card);
  });
}

/* ---------- Popover Controller ---------- */
function closePops(except) {
  document.querySelectorAll('.part-popover.open').forEach(p => {
    if (p === except) return;
    p.classList.remove('open');
    const btn = p.previousElementSibling;
    if (btn) btn.setAttribute('aria-expanded', 'false');
    const card = p.closest('.card');
    if (card) card.classList.remove('open-card');
  });
}

grid.addEventListener('click', e => {
  const link = e.target.closest('a[data-key]');
  if (link) {
    done[link.dataset.key] = 1;
    saveDone();
    return;
  }
  const btn = e.target.closest('.practice-drop-wrap > button');
  if (!btn) return;
  e.stopPropagation();
  const pop = btn.nextElementSibling,
        willOpen = !pop.classList.contains('open');
  closePops(willOpen ? pop : null);
  pop.classList.toggle('open', willOpen);
  btn.setAttribute('aria-expanded', willOpen);
  const card = btn.closest('.card');
  if (card) card.classList.toggle('open-card', willOpen);
});

addEventListener('click', e => {
  if (!e.target.closest('.practice-drop-wrap')) closePops();
});
addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closePops();
    setMenu(false);
  }
});

setupTabs();
render();

function applyWritingHash() {
  const h = location.hash.toLowerCase();
  if (h === '#tests' || h === '#part') {
    const bar = document.getElementById('tests');
    if (bar) setTimeout(() => bar.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }
}
addEventListener('hashchange', applyWritingHash);
applyWritingHash();
</script>`;

if (oldScriptRegex.test(content)) {
  content = content.replace(oldScriptRegex, newScript);
  console.log('Updated script section');
} else {
  console.warn('oldScriptRegex did not match');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Finished updating clean cambridge-writing.html');
