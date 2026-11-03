const fs = require('fs');

const writingJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/writing/scripts-writing.js', 'utf8');

const sIdx = writingJs.indexOf('async function submitTest');
console.log(writingJs.substring(sIdx, sIdx + 1500));
