const fs = require('fs');

const s = fs.readFileSync('../FrontPage/Frontend/speaking.html', 'utf8');
console.log('Total characters:', s.length);
// print first 1500 chars and sections
const lines = s.split('\n');
console.log('--- Lines 1 to 50 ---');
console.log(lines.slice(0, 50).join('\n'));
