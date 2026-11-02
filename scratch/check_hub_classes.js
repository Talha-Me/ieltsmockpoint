const fs = require('fs');
const hub = fs.readFileSync('../FrontPage/Frontend/Practice-hub.html', 'utf8');

const matches = [];
const lines = hub.split('\n');
lines.forEach(l => {
  if (l.includes('.btn-card-reading') || l.includes('.reading-card-cta') || l.includes('.rf-chips') || l.includes('.rf-badge')) {
    matches.push(l);
  }
});
console.log(matches.slice(0, 30).join('\n'));
