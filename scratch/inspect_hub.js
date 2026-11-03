const fs = require('fs');
const path = require('path');
const c = fs.readFileSync(path.join(__dirname, '..', 'FrontPage', 'Frontend', 'Practice-hub.html'), 'utf8');
const lines = c.split(/\r?\n/);
console.log('lines', lines.length);
lines.forEach((l, i) => {
  if (/writing|skill/i.test(l) && !/nav-dd|sb-dd|<svg|href="\/blog|cat=/.test(l)) console.log(i + 1, l.slice(0, 200));
});
