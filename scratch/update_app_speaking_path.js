const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../app.js');
let content = fs.readFileSync(appPath, 'utf8');

content = content.replace(
  'path.join(__dirname, "views", "speaking", "speaking-test.html")',
  'path.join(__dirname, "views", "speaking_engine", "speaking-test.html")'
);

fs.writeFileSync(appPath, content, 'utf8');
console.log('app.js updated path to speaking_engine');
