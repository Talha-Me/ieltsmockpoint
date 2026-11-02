const fs = require('fs');

console.log('--- update_cambridge_quotas.js ---');
console.log(fs.readFileSync('../scratch/update_cambridge_quotas.js', 'utf8').substring(0, 1500));

console.log('--- update_cambridge_modals.js ---');
console.log(fs.readFileSync('../scratch/update_cambridge_modals.js', 'utf8').substring(0, 1500));
