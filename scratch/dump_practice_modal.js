const fs = require('fs');

const cl = fs.readFileSync('../public/cambridge-listening.html', 'utf8');
const lines = cl.split('\n');
console.log(lines.slice(2498, 2580).join('\n'));
