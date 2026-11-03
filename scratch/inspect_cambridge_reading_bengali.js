const fs = require('fs');

const html = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/cambridgetest/reading-practice-v2.html', 'utf8');
const linesH = html.split('\n');
console.log('--- reading-practice-v2.html around line 134 ---');
console.log(linesH.slice(120, 155).join('\n'));

const js = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/cambridgetest/scripts-reading-practice-v2.js', 'utf8');
const linesJ = js.split('\n');
console.log('--- scripts-reading-practice-v2.js around line 600 ---');
console.log(linesJ.slice(585, 625).join('\n'));
