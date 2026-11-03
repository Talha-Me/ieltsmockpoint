const fs = require('fs');

const listeningJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/listening/scripts-listening.js', 'utf8');
const lines = listeningJs.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('function submitTest(') || line.includes('function submitTest()')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
