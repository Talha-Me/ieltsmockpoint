const fs = require('fs');
const path = require('path');

const ukaDash = fs.readFileSync(path.resolve(__dirname, '../FrontPage/Frontend/admin/admin-dashboard.html'), 'utf8');
console.log('ukaPhase1 present:', ukaDash.includes('id="ukaPhase1"'));
console.log('ukaSaveBtn present:', ukaDash.includes('id="ukaSaveBtn"'));
console.log('saveUkaSettings present:', ukaDash.includes('saveUkaSettings'));
console.log('loadUkaSettings present:', ukaDash.includes('loadUkaSettings'));

const vDash = fs.readFileSync(path.resolve(__dirname, '../views/admin/dashboard.html'), 'utf8');
console.log('cfgPartsPerTest present:', vDash.includes('cfgPartsPerTest'));
console.log('saveSystemSettings present:', vDash.includes('saveSystemSettings'));
console.log('loadSystemSettings present:', vDash.includes('loadSystemSettings'));
