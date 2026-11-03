const fs = require('fs');

const ev = fs.readFileSync('../routes/evaluate.js', 'utf8');
const lines = ev.split('\n');
console.log('Total lines:', lines.length);

// Print from line 100 onwards
console.log(lines.slice(100, 220).join('\n'));
