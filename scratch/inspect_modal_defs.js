const fs = require('fs');

const readingJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/reading/scripts-reading.js', 'utf8');

let idx = -1;
while ((idx = readingJs.indexOf('showMockConfirmationModal', idx + 1)) !== -1) {
  console.log('Match at index', idx, ':\n', readingJs.substring(idx - 60, idx + 160));
}
