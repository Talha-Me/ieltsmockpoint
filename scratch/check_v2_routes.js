const fs = require('fs');
const app = fs.readFileSync('../app.js', 'utf8');

const lines = app.split('\n');
lines.forEach((l, i) => {
  if (l.includes('cambridge-listening-v2') || l.includes('cambridge-reading-v2')) {
    console.log(`Line ${i+1}: ${l}`);
  }
});
