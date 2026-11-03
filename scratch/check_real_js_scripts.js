// check_real_js_scripts.js - only check actual JS scripts (not JSON-LD)

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const filePath = path.join(__dirname, '..', 'FrontPage', 'Frontend', 'Practice-hub.html');
const content = fs.readFileSync(filePath, 'utf8');

const scripts = [];
// Only get script tags that are NOT type="application/ld+json"
const re = /<script(?![^>]*src)(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/gi;
let m;
while ((m = re.exec(content)) !== null) {
  scripts.push(m[1]);
}

console.log(`Found ${scripts.length} real JS script blocks`);

let errors = 0;
scripts.forEach((src, i) => {
  try {
    new vm.Script(src);
    console.log(`  Script ${i+1}: ✅ OK`);
  } catch(e) {
    console.error(`  Script ${i+1}: ❌ ERROR - ${e.message} (line ${e.lineNumber})`);
    // Show context
    const lines = src.split('\n');
    const ln = (e.lineNumber || 1) - 1;
    for (let j = Math.max(0,ln-3); j < Math.min(lines.length,ln+4); j++) {
      console.log(`    ${j+1}${j===ln?' <<<':''}: ${lines[j]}`);
    }
    errors++;
  }
});

console.log(errors === 0 ? '\n✅ All JS scripts valid!' : `\n❌ ${errors} JS scripts with errors`);
