const fs = require('fs');

const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/reading/scripts-reading.js', 'utf8');
const lines = content.split('\n');

console.log('--- Lines 100 to 160 ---');
console.log(lines.slice(100, 160).join('\n'));

console.log('--- Lines 2550 to 2680 ---');
console.log(lines.slice(2550, 2680).join('\n'));
