const fs = require('fs');
const path = require('path');
const vm = require('vm');

const apiPath = path.join(__dirname, '../routes/api.js');
let raw = fs.readFileSync(apiPath, 'utf8');
let content = raw.replace(/\r\n/g, '\n');

const activeUpdateStart = content.lastIndexOf('router.post("/update-mock-info", async (req, res) => {');
const errorMarker = 'console.error("Critical error in update-mock-info:", error);';
const errorPos = content.indexOf(errorMarker, activeUpdateStart);
// Find the closing of router.post which is the second '});' after errorPos
const firstEnd = content.indexOf('});', errorPos);
const routeEnd = content.indexOf('});', firstEnd + 3);
const activeUpdateFullEnd = routeEnd + 3;

console.log('START:');
console.log(content.slice(activeUpdateStart, activeUpdateStart + 60));
console.log('END:');
console.log(content.slice(activeUpdateFullEnd - 60, activeUpdateFullEnd));
