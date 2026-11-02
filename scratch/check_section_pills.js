const fs = require('fs');

const l = fs.readFileSync('../views/cambridgetest/scripts-listening-practice-v2.js', 'utf8');
const r = fs.readFileSync('../views/cambridgetest/scripts-reading-practice-v2.js', 'utf8');

console.log('--- Listening Practice-v2 around 546 ---');
const lIdx = l.indexOf('Practice this section only');
console.log(l.substring(lIdx - 300, lIdx + 400));

console.log('--- Reading Practice-v2 around 727 ---');
const rIdx = r.indexOf('Practice this section only');
console.log(r.substring(rIdx - 300, rIdx + 400));
