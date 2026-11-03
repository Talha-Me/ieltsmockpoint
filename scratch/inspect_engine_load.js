const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/speaking_engine/speaking-test.html', 'utf8');

const idx = content.indexOf("fetch('/api/speaking-tests')");
console.log(content.substring(idx - 100, idx + 800));
