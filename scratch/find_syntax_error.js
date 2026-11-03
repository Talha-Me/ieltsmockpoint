const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'cambridge-writing.html'), 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>[\s\S]*?<\/body>/);

try {
  new vm.Script(scriptMatch[1], { filename: 'cambridge-writing-inline.js' });
  console.log('Valid syntax!');
} catch (e) {
  console.error(e);
}
