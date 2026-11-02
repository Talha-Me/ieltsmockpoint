const fs = require('fs');
const html = fs.readFileSync('../FrontPage/Frontend/home.html', 'utf8');

const secIdx = html.indexOf('<section id="qtypes"');
const secEnd = html.indexOf('</section>', secIdx) + 10;
console.log('--- SECTION HTML ---');
console.log(html.substring(secIdx, secEnd));

// Also let's find the CSS for .qt, #qtypes, etc.
const styleStart = html.indexOf('<style>');
const styleEnd = html.indexOf('</style>');
const style = html.substring(styleStart, styleEnd);
const cssLines = style.split('\n');
const matchedCss = [];
let capturing = false;
cssLines.forEach(line => {
  if (line.includes('#qtypes') || line.includes('.qt-') || line.includes('.qt') || line.includes('.qlinks')) {
    capturing = true;
  }
  if (capturing) {
    matchedCss.push(line);
    if (line.includes('}')) {
      // check if next line continues or ends block
    }
  }
});
console.log('\n--- MATCHED CSS SAMPLE ---');
console.log(matchedCss.slice(0, 50).join('\n'));
