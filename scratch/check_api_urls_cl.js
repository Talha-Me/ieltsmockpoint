const fs = require('fs');
const cl = fs.readFileSync('../public/cambridge-listening.html', 'utf8');

const lines = cl.split('\n');
lines.forEach(l => {
  if (l.includes('/api/')) console.log(l.trim());
});
