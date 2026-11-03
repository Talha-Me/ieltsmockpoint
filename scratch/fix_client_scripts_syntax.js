const fs = require('fs');
const path = require('path');
const vm = require('vm');

function fixFile(filePath, modName) {
  let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  const lines = content.split('\n');
  const newLines = [];
  let inCommentedSubmit = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect if we are inside the dead commented submit at the top
    if (i < 1200) {
      if (line.includes('// async function submitTest()')) {
        inCommentedSubmit = true;
      }
      if (inCommentedSubmit) {
        if (line.includes('score: scoreToSend,') ||
            line.includes('mistakes: mistakesToSend,') ||
            line.includes(`mod: "${modName}",`) ||
            line.includes('answers: answerArrayUpdated,') ||
            line.includes('testId: (typeof mockID') ||
            line.includes('localStorage.removeItem') ||
            line.trim() === '})') {
          // Comment out this line
          newLines.push('// ' + line.trim());
          if (line.trim() === '})') {
            inCommentedSubmit = false;
          }
          continue;
        }
      }
    }

    newLines.push(line);
  }

  const fixedCode = newLines.join('\n');
  new vm.Script(fixedCode);
  fs.writeFileSync(filePath, fixedCode, 'utf8');
  console.log(path.basename(filePath) + ': Syntax 100% OK and saved!');
}

fixFile(path.join(__dirname, '../views/test_pages/listening/scripts-listening.js'), 'listening');
fixFile(path.join(__dirname, '../views/test_pages/reading/scripts-reading.js'), 'reading');
