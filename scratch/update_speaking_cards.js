const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'FrontPage', 'Frontend', 'speaking.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. CSS to inject
const cssRules = `
/* SPEAKING TEST CARDS (Matching Cambridge Listening & Reading Cards) */
.sp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 24px;
  perspective: 1200px;
}
.sp-card {
  --rx: 0deg;
  --ry: 0deg;
  --ty: 0px;
  --mx: 50%;
  --my: 50%;
  position: relative;
  background: #fff;
  border: 1.5px solid var(--line);
  border-radius: 20px;
  padding: 26px 22px 24px;
  display: flex;
  flex-direction: column;
  transform: rotateX(var(--rx)) rotateY(var(--ry)) translateY(var(--ty));
  transition: transform .2s ease-out, border-color .25s, box-shadow .25s;
  will-change: transform;
}
.sp-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 4px;
  width: 100%;
  background: linear-gradient(90deg, var(--blue), var(--red));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .35s;
  border-radius: 20px 20px 0 0;
}
.sp-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: radial-gradient(260px circle at var(--mx) var(--my), rgba(21,101,201,.10), transparent 60%);
  opacity: 0;
  transition: opacity .3s;
  pointer-events: none;
}
.sp-card:hover, .sp-card.open-card {
  --ty: -8px;
  border-color: var(--blue);
  box-shadow: 0 22px 44px rgba(21, 101, 201, .14);
}
.sp-card:hover::before { transform: scaleX(1); }
.sp-card:hover::after { opacity: 1; }
.sp-card.open-card { z-index: 40; }

.sp-card .bignum {
  position: absolute;
  right: 16px;
  top: -2px;
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: 4.8rem;
  color: var(--blue-light);
  line-height: 1;
  transition: color .3s, transform .4s;
  user-select: none;
  pointer-events: none;
}
.sp-card:hover .bignum {
  color: #fdecee;
  transform: scale(1.08) translateX(-4px);
}
.sp-card .pill {
  position: relative;
  align-self: flex-start;
  max-width: 85%;
  font-size: .68rem;
  font-weight: 800;
  letter-spacing: .06em;
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--blue-light);
  color: var(--blue);
  margin-bottom: 24px;
}
.sp-card h3 {
  position: relative;
  font-size: 1.24rem;
  margin-bottom: 12px;
  font-weight: 800;
  color: var(--navy);
}
.sp-topics {
  font-size: 0.82rem;
  color: var(--muted);
  line-height: 1.5;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.sp-topics span {
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.sp-topics b {
  color: var(--navy);
  font-weight: 700;
  font-size: 0.80rem;
  white-space: nowrap;
}
.sp-card .chips {
  position: relative;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 22px;
}
.sp-card .chips span {
  font-size: .76rem;
  font-weight: 600;
  color: var(--muted);
  background: var(--surface);
  border-radius: 8px;
  padding: 5px 10px;
}

.sp-card-actions {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 10px;
  position: relative;
  margin-top: auto;
}
.sp-card-actions .btn {
  width: 100%;
  font-size: .86rem;
  padding: 10px;
  text-align: center;
}
.practice-drop-wrap {
  position: relative;
}
.part-popover {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 0;
  right: 0;
  min-width: 180px;
  background: #fff;
  border: 1.5px solid var(--line);
  border-radius: 14px;
  box-shadow: 0 14px 30px rgba(11,43,82,.18);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 30;
  opacity: 0;
  transform: translateY(8px) scale(.96);
  transform-origin: bottom center;
  pointer-events: none;
  transition: opacity .2s, transform .2s;
}
.part-popover.open {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}
.part-popover a {
  padding: 9px 12px;
  border-radius: 8px;
  font-size: .82rem;
  font-weight: 600;
  color: var(--navy);
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--surface);
  transition: background .2s, color .2s, transform .2s;
}
.part-popover a:hover {
  background: var(--blue-light);
  color: var(--blue);
  transform: translateX(3px);
}
.part-popover a span {
  font-size: .72rem;
  color: var(--muted);
}
.btn .caret {
  display: inline-block;
  transition: transform .25s;
}
.btn[aria-expanded="true"] .caret {
  transform: rotate(180deg);
}
`;

if (!content.includes('.sp-grid {')) {
  content = content.replace('</style>', cssRules + '\n</style>');
}

// 2. New Section HTML
const newSectionHtml = `<section id="speaking-tests" style="background:#ffffff; border-bottom:1px solid var(--line); padding:60px 0;">
  <div class="wrap">
    <div class="section-head reveal">
      <div class="kicker">Official Full-Length Practice</div>
      <h2>Select an IELTS Speaking Mock Test</h2>
      <p>Sit an authentic 11–14 minute full speaking test with the 3D AI Examiner, or choose specific sections below for focused practice.</p>
    </div>

    <div class="sp-grid" id="spGrid">
      
      <!-- Test 1 -->
      <div class="sp-card reveal">
        <span class="bignum">01</span>
        <span class="pill">IELTS SPEAKING 1</span>
        <h3>Speaking Mock Test 1</h3>
        <div class="sp-topics">
          <span><b>Part 1:</b> Hometown &amp; Free Time</span>
          <span><b>Part 2:</b> Memorable Journey (Cue Card)</span>
          <span><b>Part 3:</b> Modern Tourism &amp; Travel Tech</span>
        </div>
        <div class="chips">
          <span>⏱ 11–14 min</span>
          <span>🎙 3 Parts</span>
          <span>🤖 3D AI Examiner</span>
        </div>
        <div class="sp-card-actions">
          <a href="/speaking-test?id=1" class="btn btn-red">Take Test →</a>
          <div class="practice-drop-wrap">
            <button type="button" class="btn btn-outline" aria-haspopup="true" aria-expanded="false" aria-controls="pop-sp-1">Practice <span class="caret">▾</span></button>
            <div class="part-popover" id="pop-sp-1" role="menu">
              <a role="menuitem" href="/speaking-test?id=1&part=1">Part 1 <span>Interview</span></a>
              <a role="menuitem" href="/speaking-test?id=1&part=2">Part 2 <span>Cue Card</span></a>
              <a role="menuitem" href="/speaking-test?id=1&part=3">Part 3 <span>Discussion</span></a>
            </div>
          </div>
        </div>
      </div>

      <!-- Test 2 -->
      <div class="sp-card reveal">
        <span class="bignum">02</span>
        <span class="pill">IELTS SPEAKING 2</span>
        <h3>Speaking Mock Test 2</h3>
        <div class="sp-topics">
          <span><b>Part 1:</b> Studies, Work &amp; Mobile Tech</span>
          <span><b>Part 2:</b> Ambitious Person (Cue Card)</span>
          <span><b>Part 3:</b> Ambition, Success &amp; Career</span>
        </div>
        <div class="chips">
          <span>⏱ 11–14 min</span>
          <span>🎙 3 Parts</span>
          <span>🤖 3D AI Examiner</span>
        </div>
        <div class="sp-card-actions">
          <a href="/speaking-test?id=2" class="btn btn-red">Take Test →</a>
          <div class="practice-drop-wrap">
            <button type="button" class="btn btn-outline" aria-haspopup="true" aria-expanded="false" aria-controls="pop-sp-2">Practice <span class="caret">▾</span></button>
            <div class="part-popover" id="pop-sp-2" role="menu">
              <a role="menuitem" href="/speaking-test?id=2&part=1">Part 1 <span>Interview</span></a>
              <a role="menuitem" href="/speaking-test?id=2&part=2">Part 2 <span>Cue Card</span></a>
              <a role="menuitem" href="/speaking-test?id=2&part=3">Part 3 <span>Discussion</span></a>
            </div>
          </div>
        </div>
      </div>

      <!-- Test 3 -->
      <div class="sp-card reveal">
        <span class="bignum">03</span>
        <span class="pill">IELTS SPEAKING 3</span>
        <h3>Speaking Mock Test 3</h3>
        <div class="sp-topics">
          <span><b>Part 1:</b> Food, Cooking &amp; Daily Routine</span>
          <span><b>Part 2:</b> Challenging Problem Solved</span>
          <span><b>Part 3:</b> Problem Solving, Education &amp; AI</span>
        </div>
        <div class="chips">
          <span>⏱ 11–14 min</span>
          <span>🎙 3 Parts</span>
          <span>🤖 3D AI Examiner</span>
        </div>
        <div class="sp-card-actions">
          <a href="/speaking-test?id=3" class="btn btn-red">Take Test →</a>
          <div class="practice-drop-wrap">
            <button type="button" class="btn btn-outline" aria-haspopup="true" aria-expanded="false" aria-controls="pop-sp-3">Practice <span class="caret">▾</span></button>
            <div class="part-popover" id="pop-sp-3" role="menu">
              <a role="menuitem" href="/speaking-test?id=3&part=1">Part 1 <span>Interview</span></a>
              <a role="menuitem" href="/speaking-test?id=3&part=2">Part 2 <span>Cue Card</span></a>
              <a role="menuitem" href="/speaking-test?id=3&part=3">Part 3 <span>Discussion</span></a>
            </div>
          </div>
        </div>
      </div>

      <!-- Test 4 -->
      <div class="sp-card reveal">
        <span class="bignum">04</span>
        <span class="pill">IELTS SPEAKING 4</span>
        <h3>Speaking Mock Test 4</h3>
        <div class="sp-topics">
          <span><b>Part 1:</b> Friendships, Social Life &amp; Music</span>
          <span><b>Part 2:</b> Traditional Celebration/Festival</span>
          <span><b>Part 3:</b> Cultural Heritage &amp; Globalization</span>
        </div>
        <div class="chips">
          <span>⏱ 11–14 min</span>
          <span>🎙 3 Parts</span>
          <span>🤖 3D AI Examiner</span>
        </div>
        <div class="sp-card-actions">
          <a href="/speaking-test?id=4" class="btn btn-red">Take Test →</a>
          <div class="practice-drop-wrap">
            <button type="button" class="btn btn-outline" aria-haspopup="true" aria-expanded="false" aria-controls="pop-sp-4">Practice <span class="caret">▾</span></button>
            <div class="part-popover" id="pop-sp-4" role="menu">
              <a role="menuitem" href="/speaking-test?id=4&part=1">Part 1 <span>Interview</span></a>
              <a role="menuitem" href="/speaking-test?id=4&part=2">Part 2 <span>Cue Card</span></a>
              <a role="menuitem" href="/speaking-test?id=4&part=3">Part 3 <span>Discussion</span></a>
            </div>
          </div>
        </div>
      </div>

      <!-- Test 5 -->
      <div class="sp-card reveal">
        <span class="bignum">05</span>
        <span class="pill">IELTS SPEAKING 5</span>
        <h3>Speaking Mock Test 5</h3>
        <div class="sp-topics">
          <span><b>Part 1:</b> Shopping, Transport &amp; Daily Life</span>
          <span><b>Part 2:</b> Practical Skill You'd Like to Learn</span>
          <span><b>Part 3:</b> Lifelong Learning &amp; Employment</span>
        </div>
        <div class="chips">
          <span>⏱ 11–14 min</span>
          <span>🎙 3 Parts</span>
          <span>🤖 3D AI Examiner</span>
        </div>
        <div class="sp-card-actions">
          <a href="/speaking-test?id=5" class="btn btn-red">Take Test →</a>
          <div class="practice-drop-wrap">
            <button type="button" class="btn btn-outline" aria-haspopup="true" aria-expanded="false" aria-controls="pop-sp-5">Practice <span class="caret">▾</span></button>
            <div class="part-popover" id="pop-sp-5" role="menu">
              <a role="menuitem" href="/speaking-test?id=5&part=1">Part 1 <span>Interview</span></a>
              <a role="menuitem" href="/speaking-test?id=5&part=2">Part 2 <span>Cue Card</span></a>
              <a role="menuitem" href="/speaking-test?id=5&part=3">Part 3 <span>Discussion</span></a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>`;

const secRegex = /<section id="speaking-tests"[\s\S]*?<\/section>/;
content = content.replace(secRegex, newSectionHtml);

// 3. JavaScript to inject
const jsToAdd = `
/* ---------- Speaking Cards: Popover & 3D Tilt ---------- */
function closeSpeakingPops(except) {
  document.querySelectorAll('#spGrid .part-popover.open').forEach(p => {
    if (p === except) return;
    p.classList.remove('open');
    const btn = p.previousElementSibling;
    if (btn) btn.setAttribute('aria-expanded', 'false');
    p.closest('.sp-card').classList.remove('open-card');
  });
}

const spGrid = document.getElementById('spGrid');
if (spGrid) {
  spGrid.addEventListener('click', e => {
    const btn = e.target.closest('.practice-drop-wrap > button');
    if (!btn) return;
    e.stopPropagation();
    const pop = btn.nextElementSibling;
    const willOpen = !pop.classList.contains('open');
    closeSpeakingPops(willOpen ? pop : null);
    pop.classList.toggle('open', willOpen);
    btn.setAttribute('aria-expanded', willOpen);
    btn.closest('.sp-card').classList.toggle('open-card', willOpen);
  });

  spGrid.querySelectorAll('.sp-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      if (matchMedia('(hover:none)').matches) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', (x * 100) + '%');
      card.style.setProperty('--my', (y * 100) + '%');
      card.style.setProperty('--ry', ((x - 0.5) * 6) + 'deg');
      card.style.setProperty('--rx', ((0.5 - y) * 6) + 'deg');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

addEventListener('click', e => {
  if (!e.target.closest('.practice-drop-wrap')) closeSpeakingPops();
});
addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSpeakingPops();
});
`;

if (!content.includes('closeSpeakingPops')) {
  if (content.includes('</script>\r\n</body>')) {
    content = content.replace('</script>\r\n</body>', jsToAdd + '\n</script>\r\n</body>');
  } else {
    content = content.replace('</script>\n</body>', jsToAdd + '\n</script>\n</body>');
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('SUCCESSFULLY_UPDATED_SPEAKING_PAGE');
