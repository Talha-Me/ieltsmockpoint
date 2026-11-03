const fs = require('fs');
const content = fs.readFileSync('../views/client.js', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('localStorage.setItem("data"') && !l.trim().startsWith('//')) {
    console.log((idx+1) + ': ' + l.trim());
    console.log(lines.slice(Math.max(0, idx - 10), Math.min(lines.length, idx + 15)).join('\n'));
  }
});
