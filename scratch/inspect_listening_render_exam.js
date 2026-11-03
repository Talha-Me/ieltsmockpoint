const fs = require('fs');

const js = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/listening/scripts-listening.js', 'utf8');

const renderIdx = js.indexOf('function renderExam(');
console.log('renderExam at:', renderIdx);
if (renderIdx !== -1) {
  console.log(js.substring(renderIdx, renderIdx + 600));
}
