const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const skip = new Set(['node_modules', 'mocks', 'scratch', '.git', 'audio', 'uploads']);
const hits = [];
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!skip.has(e.name)) walk(path.join(d, e.name)); continue; }
    if (!/\.(html|js|ejs)$/.test(e.name)) continue;
    const p = path.join(d, e.name);
    let c; try { c = fs.readFileSync(p, 'utf8'); } catch (x) { continue; }
    const a = c.includes('practice-hub?skill=writing');
    const b = c.includes('<a href="/speaking.html">Speaking</a>');
    if (a || b) hits.push(`${path.relative(root, p)} | writingLink=${a} speakingNav=${b}`);
  }
}
walk(root);
console.log(hits.join('\n'));
