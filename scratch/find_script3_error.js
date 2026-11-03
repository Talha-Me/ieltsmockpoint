// find_script3_error.js

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const filePath = path.join(__dirname, '..', 'FrontPage', 'Frontend', 'Practice-hub.html');
const content = fs.readFileSync(filePath, 'utf8');

const scripts = [];
const re = /<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi;
let m;
while ((m = re.exec(content)) !== null) {
  scripts.push(m[1]);
}

const src = scripts[2]; // Script 3 (0-indexed: 2)
try {
  new vm.Script(src);
  console.log('No error!');
} catch(e) {
  console.error('Error:', e.message);
  // Show lines around the error
  const lines = src.split('\n');
  const errLine = e.lineNumber || 0;
  console.log(`Error at line ~${errLine}`);
  const start = Math.max(0, errLine - 5);
  const end = Math.min(lines.length, errLine + 5);
  for (let i = start; i < end; i++) {
    console.log(`  ${i+1}: ${lines[i]}`);
  }
}
