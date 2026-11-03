const fs = require('fs');

const bengaliRegex = /[\u0980-\u09FF]/;
const lines = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/reading/scripts-reading.js', 'utf8').split('\n');

console.log('Bengali in lines 1660 - end:');
for (let i = 1659; i < lines.length; i++) {
  if (bengaliRegex.test(lines[i])) {
    console.log(`Line ${i + 1}: ${lines[i].trim()}`);
  }
}
