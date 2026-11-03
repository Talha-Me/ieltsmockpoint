const fs = require('fs');

const ev = fs.readFileSync('../routes/evaluate.js', 'utf8');
console.log('Size of evaluate.js:', ev.length);
console.log('--- evaluate.js (First 1500 chars) ---');
console.log(ev.substring(0, 1500));
