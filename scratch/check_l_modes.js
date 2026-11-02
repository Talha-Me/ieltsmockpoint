const fs = require('fs');

const l = fs.readFileSync('../views/cambridgetest/scripts-listening-practice-v2.js', 'utf8');
const lines = l.split('\n');
console.log(lines.slice(90, 230).join('\n'));
