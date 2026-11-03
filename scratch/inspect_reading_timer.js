const fs = require('fs');

const readingJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/reading/scripts-reading.js', 'utf8');

const tIdx = readingJs.indexOf('readingMinuteInterval');
console.log('--- readingMinuteInterval occurrences ---');
let idx = -1;
while ((idx = readingJs.indexOf('readingMinuteInterval', idx + 1)) !== -1) {
  console.log('Match at', idx, ':\n', readingJs.substring(idx - 100, idx + 300));
}
