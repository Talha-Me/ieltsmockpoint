const fs = require('fs');

const cl = fs.readFileSync('../public/cambridge-listening.html', 'utf8');

const modalStart = cl.indexOf('<!-- Practice Unlock Modal -->');
const modalEnd = cl.indexOf('<!-- Cambridge Full Mock Notice Modal -->', modalStart);
console.log('=== UNLOCK MODAL HTML ===');
console.log(cl.substring(modalStart, modalEnd));

const fnStart = cl.indexOf('function openUnlockModal');
const fnEnd = cl.indexOf('function closeUnlockModal', fnStart);
const fnEnd2 = cl.indexOf('}', fnEnd) + 1;
console.log('=== UNLOCK MODAL JS ===');
console.log(cl.substring(fnStart, fnEnd2));
