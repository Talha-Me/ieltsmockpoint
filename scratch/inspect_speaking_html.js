const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/FrontPage/Frontend/speaking.html', 'utf8');
console.log('File size:', content.length);
console.log('Lines:', content.split('\n').length);
const scriptMatch = content.lastIndexOf('<script');
if (scriptMatch !== -1) {
  console.log('--- Last Scripts ---');
  console.log(content.substring(scriptMatch));
}
