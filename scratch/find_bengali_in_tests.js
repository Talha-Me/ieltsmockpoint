const fs = require('fs');

const bengaliRegex = /[\u0980-\u09FF]/;

function checkFile(filePath) {
  console.log('=== Checking:', filePath);
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  lines.forEach((line, idx) => {
    if (bengaliRegex.test(line)) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
}

checkFile('D:/personal websites/ieltsmockpoint/views/test_pages/reading/scripts-reading.js');
checkFile('D:/personal websites/ieltsmockpoint/views/test_pages/listening/scripts-listening.js');
checkFile('D:/personal websites/ieltsmockpoint/views/test_pages/writing/scripts-writing.js');
