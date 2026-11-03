const fs = require('fs');
const js = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/cambridgetest/cambridge-writing-test.js', 'utf8');
const html = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/cambridgetest/cambridge-writing-test.html', 'utf8');

console.log('In JS calls:');
const matches = [...js.matchAll(/isCurrentSessionLocked\([^)]*\)/g)];
matches.forEach(m => console.log(m[0]));

console.log('In HTML calls:');
const matchesH = [...html.matchAll(/isCurrentSessionLocked\([^)]*\)/g)];
matchesH.forEach(m => console.log(m[0]));
