const fs = require('fs');
const path = require('path');
const vm = require('vm');

function checkScriptsInHtml(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  let count = 0;
  while ((match = scriptRegex.exec(content)) !== null) {
    const attrs = match[1];
    const code = match[2];
    if (attrs.includes('application/ld+json')) continue;
    if (attrs.includes('src=')) continue;
    if (!code.trim()) continue;
    count++;
    try {
      new vm.Script(code);
    } catch(err) {
      console.error(`Syntax error in ${path.basename(filePath)} script #${count}:`, err.message);
      return false;
    }
  }
  console.log(`All ${count} JS scripts in ${path.basename(filePath)} passed syntax check!`);
  return true;
}

const files = [
  '../public/cambridge-reading.html',
  '../public/cambridge-listening.html',
  '../FrontPage/Frontend/mocks.html',
  '../FrontPage/Frontend/Practice-hub.html',
  '../public/reading-exercises.html',
  '../public/listening-exercises.html',
  '../views/admin/dashboard.html'
];

let allOk = true;
for (const f of files) {
  const p = path.resolve(__dirname, f);
  if (fs.existsSync(p)) {
    const ok = checkScriptsInHtml(p);
    if (!ok) allOk = false;
  }
}

if (allOk) {
  console.log('=== ALL FILES 100% VALID SYNTAX ===');
} else {
  process.exit(1);
}
