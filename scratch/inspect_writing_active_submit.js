const fs = require('fs');

const writingJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/writing/scripts-writing.js', 'utf8');
const lines = writingJs.split('\n');

lines.forEach((l, idx) => {
  if ((l.includes('function submitTest') || l.includes('async function submitTest')) && !l.trim().startsWith('//')) {
    console.log(`Line ${idx + 1}: ${l.trim()}`);
    console.log(lines.slice(idx, idx + 40).join('\n'));
  }
});
