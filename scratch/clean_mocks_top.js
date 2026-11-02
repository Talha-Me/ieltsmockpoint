const fs = require('fs');
const path = require('path');

const mocksPath = path.resolve(__dirname, '../FrontPage/Frontend/mocks.html');
let html = fs.readFileSync(mocksPath, 'utf8');

// Find index of <!DOCTYPE html> around line 925
const doctypeMarker = '<!DOCTYPE html>';
const idx = html.indexOf(doctypeMarker, 10); // skip very start if any
if (idx > 0) {
  html = html.slice(idx);
  console.log('Removed dead commented-out block from top of mocks.html. New start starts with <!DOCTYPE html>');
  fs.writeFileSync(mocksPath, html, 'utf8');
} else {
  console.log('Could not find second <!DOCTYPE html>');
}
