const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'FrontPage', 'Frontend', 'speaking.html');
let c = fs.readFileSync(p, 'utf8');
if (c.includes('__spPartMode')) { console.log('already'); process.exit(0); }
const js = `
/* ---------- Part focus mode (from Practice Hub: /speaking.html?part=N) ---------- */
(function __spPartMode(){
  const part = new URLSearchParams(location.search).get('part');
  if (!['1','2','3'].includes(part) || !spGrid) return;
  const names = {'1':'Part 1 · Interview','2':'Part 2 · Cue Card','3':'Part 3 · Discussion'};
  spGrid.querySelectorAll('.sp-card').forEach(card => {
    const main = card.querySelector('.sp-card-actions > a.btn-red');
    if (main) {
      const u = new URL(main.getAttribute('href'), location.origin);
      u.searchParams.set('part', part);
      main.setAttribute('href', u.pathname + u.search);
      main.textContent = 'Start Part ' + part + ' →';
    }
  });
  const note = document.createElement('div');
  note.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;background:var(--blue-light);border:1.5px solid #bcd9fb;border-radius:14px;padding:12px 18px;margin-bottom:22px;font-weight:600;color:var(--navy);font-size:.92rem;';
  note.innerHTML = '<span>Practising <b>' + names[part] + '</b> only. Pick any test below to start.</span><a href="/speaking.html#speaking-tests" style="color:var(--red);text-decoration:none;font-weight:700;">Show full tests</a>';
  spGrid.parentNode.insertBefore(note, spGrid);
})();
`;
const marker = "addEventListener('keydown', e => {\n  if (e.key === 'Escape') closeSpeakingPops();\n});";
const idx = c.indexOf(marker);
if (idx < 0) { console.log('marker not found'); process.exit(1); }
c = c.slice(0, idx + marker.length) + '\n' + js + c.slice(idx + marker.length);
fs.writeFileSync(p, c, 'utf8');
console.log('added');
