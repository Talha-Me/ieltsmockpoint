const fs = require('fs');

function checkFileStructure(filePath) {
  console.log('=== File:', filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  console.log('Total lines:', lines.length);

  // find first non-comment line that looks like real code
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*')) {
      console.log(`First active line is at line ${i + 1}: ${trimmed.substring(0, 80)}`);
      break;
    }
  }
}

checkFileStructure('D:/personal websites/ieltsmockpoint/views/test_pages/reading/scripts-reading.js');
checkFileStructure('D:/personal websites/ieltsmockpoint/views/test_pages/listening/scripts-listening.js');
checkFileStructure('D:/personal websites/ieltsmockpoint/views/test_pages/writing/scripts-writing.js');
