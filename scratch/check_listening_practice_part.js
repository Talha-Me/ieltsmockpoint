const fs = require('fs');

const cl = fs.readFileSync('../public/cambridge-listening.html', 'utf8');

const idx = cl.indexOf('practiceModal') !== -1 ? cl.indexOf('practiceModal') : cl.indexOf('Practice');
console.log('--- Searching in cambridge-listening.html ---');
const lines = cl.split('\n');
lines.forEach((l, i) => {
  if (l.includes('Practice by Part') || l.includes('openPracticeModal') || l.includes('Practice this part') || l.includes('part-btn') || l.includes('cambridge-listening-v2?book=')) {
    console.log(`Line ${i+1}: ${l.trim().substring(0, 120)}`);
  }
});
