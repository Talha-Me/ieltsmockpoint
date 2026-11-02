const fs = require('fs');

const cl = fs.readFileSync('../public/cambridge-listening.html', 'utf8');

const idx = cl.indexOf('id="psUnlockModal"');
console.log(cl.substring(idx - 50, idx + 1200));

const fnIdx = cl.indexOf('function openUnlockModal');
console.log(cl.substring(fnIdx - 50, fnIdx + 1200));
