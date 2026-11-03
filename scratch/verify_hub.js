const fs = require('fs');
const http = require('http');
const path = require('path');
const c = fs.readFileSync(path.join(__dirname, '..', 'FrontPage', 'Frontend', 'Practice-hub.html'), 'utf8');
const scripts = [...c.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
scripts.forEach((s, i) => { try { new Function(s); console.log('script', i, 'syntax OK'); } catch (e) { console.log('script', i, 'SYNTAX ERROR', e.message); } });

function get(u) { return new Promise(r => http.get(u, res => { let d = ''; res.on('data', x => d += x); res.on('end', () => r({ s: res.statusCode, d })); }).on('error', e => r({ s: 'ERR ' + e.message, d: '' }))); }
(async () => {
  for (const u of ['/practice-hub', '/practice-hub?skill=speaking#hub', '/navbar', '/speaking', '/mocks.html', '/cambridge-listening.html']) {
    const r = await get('http://localhost:5001' + u);
    console.log(u, r.s, 'speakingDD=', r.d.includes('nav-dd-trigger">Speaking'), 'hubSpeaking=', r.d.includes('skill=speaking'));
  }
  const l = await get('http://localhost:5001/shared-layout.js');
  console.log('cache v10:', l.d.includes('mp_shared_nav_v10'));
})();
