// verify_hub_js.js - extract and validate the script block from Practice-hub.html

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const filePath = path.join(__dirname, '..', 'FrontPage', 'Frontend', 'Practice-hub.html');
const content = fs.readFileSync(filePath, 'utf8');

// Extract all script blocks
const scripts = [];
const re = /<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi;
let m;
while ((m = re.exec(content)) !== null) {
  scripts.push(m[1]);
}

console.log(`Found ${scripts.length} inline script blocks`);

let errors = 0;
scripts.forEach((src, i) => {
  try {
    new vm.Script(src);
    console.log(`  Script ${i+1}: OK`);
  } catch(e) {
    console.error(`  Script ${i+1}: ERROR - ${e.message}`);
    errors++;
  }
});

console.log(errors === 0 ? '\n✅ All scripts valid!' : `\n❌ ${errors} scripts with errors`);
