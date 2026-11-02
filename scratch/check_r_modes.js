const fs = require('fs');

const r = fs.readFileSync('../views/cambridgetest/scripts-reading-practice-v2.js', 'utf8');
const lines = r.split('\n');
const idx = r.indexOf('function determinePracticeMode');
console.log(r.substring(idx, idx + 1500));
