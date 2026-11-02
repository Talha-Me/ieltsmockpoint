const fs = require('fs');

const l = fs.readFileSync('../views/cambridgetest/scripts-listening-practice-v2.js', 'utf8');
const r = fs.readFileSync('../views/cambridgetest/scripts-reading-practice-v2.js', 'utf8');

console.log('--- Listening phase / quota check in test page ---');
console.log(l.includes('current_phase') || l.includes('phase') || l.includes('quota') || l.includes('candidate'));

console.log('--- Reading phase / quota check in test page ---');
console.log(r.includes('current_phase') || r.includes('phase') || r.includes('quota') || r.includes('candidate'));
