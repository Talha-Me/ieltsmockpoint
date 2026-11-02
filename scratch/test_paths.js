const fs = require('fs');
const path = require('path');

// 1. Reading file
const readingPath = path.resolve(__dirname, '../public/cambridge-reading.html');
let readingHtml = fs.readFileSync(readingPath, 'utf8');

// 2. Listening file
const listeningPath = path.resolve(__dirname, '../public/cambridge-listening.html');
let listeningHtml = fs.readFileSync(listeningPath, 'utf8');

console.log('Reading size:', readingHtml.length);
console.log('Listening size:', listeningHtml.length);
