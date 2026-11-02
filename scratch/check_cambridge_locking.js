const fs = require('fs');

const cl = fs.readFileSync('../public/cambridge-listening.html', 'utf8');
const cr = fs.readFileSync('../public/cambridge-reading.html', 'utf8');

const clIdx = cl.indexOf('current_phase');
console.log('cl current_phase idx:', clIdx);
if (clIdx !== -1) {
  console.log(cl.substring(clIdx - 200, clIdx + 800));
}

const crIdx = cr.indexOf('current_phase');
console.log('cr current_phase idx:', crIdx);
if (crIdx !== -1) {
  console.log(cr.substring(crIdx - 200, crIdx + 800));
}
