const fs = require('fs');

const readingJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/reading/scripts-reading.js', 'utf8');
const lines = readingJs.split('\n');

console.log(lines.slice(2660, 2730).join('\n'));
