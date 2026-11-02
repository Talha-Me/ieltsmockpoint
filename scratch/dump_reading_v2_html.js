const fs = require('fs');

console.log('=== reading-practice-v2.html ===');
console.log(fs.readFileSync('../views/cambridgetest/reading-practice-v2.html', 'utf8'));
