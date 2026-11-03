const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('public/writing-exercises.html', 'utf8');
const scripts = [];
const re = /<script(?![^>]*src)(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/gi;
let m;
while ((m = re.exec(html)) !== null) {
  scripts.push(m[1]);
}

console.log(`Found ${scripts.length} inline scripts in writing-exercises.html`);
scripts.forEach((s, idx) => {
  try {
    new vm.Script(s);
    console.log(`Script ${idx + 1}: ✅ OK`);
  } catch(e) {
    console.error(`Script ${idx + 1}: ❌ ERROR - ${e.message}`);
  }
});
