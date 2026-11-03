const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const files = `FrontPage/Frontend/about.html
FrontPage/Frontend/band-calculator.html
FrontPage/Frontend/blog.html
FrontPage/Frontend/contact.html
FrontPage/Frontend/cookie-policy.html
FrontPage/Frontend/disclaimer.html
FrontPage/Frontend/forgot.html
FrontPage/Frontend/home.html
FrontPage/Frontend/institutes.html
FrontPage/Frontend/learn.html
FrontPage/Frontend/login.html
FrontPage/Frontend/mocks.html
FrontPage/Frontend/navbar.html
FrontPage/Frontend/Practice-hub.html
FrontPage/Frontend/privacy-policy.html
FrontPage/Frontend/register.html
FrontPage/Frontend/speaking.html
FrontPage/Frontend/terms-of-service.html
FrontPage/Frontend/writing-samples.html
public/cambridge-listening.html
public/cambridge-reading.html
public/cambridge-writing.html
public/listening-exercises.html
public/navbar.html
public/reading-exercises.html
views/blog.html
views/faq.html
views/learn.html
views/single-blog.html
views/single-lesson.html`.split(/\r?\n/);

const MIC_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>';
const CARET = '<svg class="nav-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
const CHEV = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

const PARTS = [
  ['Part 1 · Interview', 'Part-1'],
  ['Part 2 · Cue Card', 'Part-2'],
  ['Part 3 · Discussion', 'Part-3']
];

function desktopSpeaking(indent) {
  const i = indent;
  const items = PARTS.map(([label, key]) =>
`${i}      <a href="/practice-hub?skill=speaking#sp-${key}" class="nav-dd-item">
${i}        <span class="nav-dd-ico" aria-hidden="true">${MIC_SVG}</span>
${i}        <span>${label}</span>
${i}      </a>`).join('\n');
  return `${i}<div class="nav-dd">
${i}  <a href="/speaking.html" class="nav-dd-trigger">Speaking${CARET}</a>
${i}  <div class="nav-dd-menu">
${i}    <div class="nav-dd-card">
${items}
${i}    </div>
${i}  </div>
${i}</div>`;
}

function sidebarSpeaking(indent) {
  const i = indent;
  const subs = PARTS.map(([label, key]) => `${i}    <a href="/practice-hub?skill=speaking#sp-${key}">${label}</a>`).join('\n');
  return `${i}<div class="sb-dd">
${i}  <div class="sb-dd-head">
${i}    <a href="/speaking.html" class="sb-dd-link">Speaking</a>
${i}    <button type="button" class="sb-dd-btn" aria-expanded="false" aria-label="Toggle Speaking options">
${i}      ${CHEV}
${i}    </button>
${i}  </div>
${i}  <div class="sb-dd-sub">
${subs}
${i}  </div>
${i}</div>`;
}

const report = [];
for (const rel of files) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) { report.push(`${rel}: MISSING`); continue; }
  let c = fs.readFileSync(p, 'utf8');
  const orig = c;
  let n = { desk: 0, side: 0, hubD: 0, hubS: 0 };

  if (!c.includes('nav-dd-trigger">Speaking')) {
    c = c.replace(/([ \t]*)<a href="\/speaking\.html">Speaking<\/a>(\r?\n\s*<div class="nav-dd">\s*<a href="\/practice-hub" class="nav-dd-trigger">)/,
      (m, ind, rest) => { n.desk++; return desktopSpeaking(ind) + rest; });
  }
  if (!c.includes('sb-dd-link">Speaking')) {
    c = c.replace(/([ \t]*)<a href="\/speaking\.html">Speaking<\/a>(\r?\n\s*<div class="sb-dd">)/,
      (m, ind, rest) => { n.side++; return sidebarSpeaking(ind) + rest; });
  }

  // Practice Hub dropdown (desktop): add Speaking after Writing item
  if (!c.includes('practice-hub?skill=speaking#hub')) {
    const t = c.indexOf('class="nav-dd-trigger">Practice Hub');
    if (t > -1) {
      const w = c.indexOf('<span>Writing</span>', t);
      const endA = w > -1 ? c.indexOf('</a>', w) : -1;
      if (endA > -1 && endA - t < 3000) {
        const ins = `\n            <a href="/practice-hub?skill=speaking#hub" class="nav-dd-item">\n              <span class="nav-dd-ico" aria-hidden="true">${MIC_SVG}</span>\n              <span>Speaking</span>\n            </a>`;
        c = c.slice(0, endA + 4) + ins + c.slice(endA + 4);
        n.hubD++;
      }
    }
    // Practice Hub (sidebar)
    const s = c.indexOf('class="sb-dd-link">Practice Hub');
    if (s > -1) {
      const marker = '<a href="/practice-hub?skill=writing#hub">Writing</a>';
      const w = c.indexOf(marker, s);
      if (w > -1 && w - s < 2000) {
        const ins = `\n        <a href="/practice-hub?skill=speaking#hub">Speaking</a>`;
        c = c.slice(0, w + marker.length) + ins + c.slice(w + marker.length);
        n.hubS++;
      }
    }
  }

  if (c !== orig) fs.writeFileSync(p, c, 'utf8');
  report.push(`${rel}: desk=${n.desk} side=${n.side} hubDesk=${n.hubD} hubSide=${n.hubS}${c === orig ? ' (unchanged)' : ''}`);
}
console.log(report.join('\n'));
