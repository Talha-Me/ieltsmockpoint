const fs = require('fs');

const s = fs.readFileSync('../FrontPage/Frontend/speaking.html', 'utf8');
const lines = s.split('\n');
console.log(lines.slice(500, 680).join('\n'));
