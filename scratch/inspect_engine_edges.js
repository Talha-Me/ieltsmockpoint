const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/speaking_engine/speaking-test.html', 'utf8');

console.log('Top 40 lines:');
console.log(content.split('\n').slice(0, 40).join('\n'));

console.log('--- Bottom 40 lines:');
console.log(content.split('\n').slice(-40).join('\n'));
