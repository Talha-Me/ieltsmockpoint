const fs = require('fs');

const ev = fs.readFileSync('../routes/evaluate.js', 'utf8');
console.log('Ends with:\n', ev.substring(ev.length - 400));
