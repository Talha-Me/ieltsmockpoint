const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/speaking_engine/speaking-test.html', 'utf8');

const loadIdx = content.indexOf('loadSpeakingTest');
if (loadIdx !== -1) {
  console.log(content.substring(loadIdx - 50, loadIdx + 800));
} else {
  const fetchIdx = content.indexOf('fetch(');
  console.log('fetch occurrences:');
  let idx = -1;
  while ((idx = content.indexOf('fetch(', idx + 1)) !== -1) {
    console.log(content.substring(idx, idx + 100));
  }
}
