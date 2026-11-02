const fs = require('fs');

const cl = fs.readFileSync('../public/cambridge-listening.html', 'utf8');

const idx = cl.indexOf('function getUserAccessState');
console.log(cl.substring(idx, idx + 1000));
