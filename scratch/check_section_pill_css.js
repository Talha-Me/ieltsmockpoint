const fs = require('fs');

const lCss = fs.readFileSync('../views/cambridgetest/styles-listening-v2.css', 'utf8');
const rCss = fs.readFileSync('../views/cambridgetest/styles-reading-v2.css', 'utf8');

const lIdx = lCss.indexOf('.cl-section-pill');
console.log('--- Listening CSS pill ---');
console.log(lCss.substring(lIdx, lIdx + 400));

const rIdx = rCss.indexOf('.cr-section-practice-badge');
console.log('--- Reading CSS pill ---');
console.log(rCss.substring(rIdx, rIdx + 400));
