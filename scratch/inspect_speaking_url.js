const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/speaking_engine/speaking-test.html', 'utf8');

const urlIdx = content.indexOf('URLSearchParams');
if (urlIdx !== -1) {
  console.log('--- URLSearchParams ---');
  console.log(content.substring(urlIdx - 50, urlIdx + 800));
}
