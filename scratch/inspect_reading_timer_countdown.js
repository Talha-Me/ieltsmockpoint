const fs = require('fs');

const readingJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/reading/scripts-reading.js', 'utf8');

const tIdx = readingJs.indexOf('readingMinuteInterval = interval;');
console.log(readingJs.substring(tIdx - 400, tIdx + 1200));
