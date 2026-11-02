const fs = require('fs');

const cl = fs.readFileSync('../public/cambridge-listening.html', 'utf8');

const sIdx = cl.indexOf('function checkSectionLocked');
if (sIdx !== -1) {
  console.log(cl.substring(sIdx - 100, sIdx + 1200));
} else {
  const pIdx = cl.indexOf('getUserAccessState');
  console.log(cl.substring(pIdx - 100, pIdx + 1200));
}
