const fs = require('fs');

const readingJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/reading/scripts-reading.js', 'utf8');

const sIdx = readingJs.indexOf('async function submitTest(reason)');
console.log(readingJs.substring(sIdx, sIdx + 2500));
