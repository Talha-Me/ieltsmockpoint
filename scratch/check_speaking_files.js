const fs = require('fs');

const sHtml = fs.readFileSync('../FrontPage/Frontend/speaking.html', 'utf8');
console.log('speaking.html size:', sHtml.length);
console.log('Title:', sHtml.match(/<title>([^<]+)<\/title>/)?.[1]);

const sSlots = fs.readFileSync('../models/speaking_slots.js', 'utf8');
console.log('speaking_slots.js:\n', sSlots);
