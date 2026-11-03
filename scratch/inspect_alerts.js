const fs = require('fs');

const readingJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/reading/scripts-reading.js', 'utf8');
const readingHtml = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/reading/reading.html', 'utf8');

console.log('--- alert calls in scripts-reading.js ---');
let idx = -1;
while ((idx = readingJs.indexOf('alert(', idx + 1)) !== -1) {
  console.log(readingJs.substring(idx - 50, idx + 150));
}

console.log('--- alert calls in reading.html ---');
idx = -1;
while ((idx = readingHtml.indexOf('alert(', idx + 1)) !== -1) {
  console.log(readingHtml.substring(idx - 50, idx + 150));
}
