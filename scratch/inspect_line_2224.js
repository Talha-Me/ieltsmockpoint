const fs = require('fs');

const listeningJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/listening/scripts-listening.js', 'utf8');
const lines = listeningJs.split('\n');

console.log(lines.slice(2220, 2270).join('\n'));
