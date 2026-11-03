const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/FrontPage/Frontend/speaking.html', 'utf8');

const matches = [...content.matchAll(/Speaking Mock Test (\d+)/g)];
console.log('FrontPage tests found:', matches.map(m => m[1]));

const dataTests = require('D:/personal websites/ieltsmockpoint/data/speakingTests.js');
console.log('data/speakingTests.js keys:', Object.keys(dataTests));
