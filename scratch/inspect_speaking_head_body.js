const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/FrontPage/Frontend/speaking.html', 'utf8');

const headEndIdx = content.indexOf('</head>');
console.log('</head> is at:', headEndIdx);
console.log('Before </head>:\n', content.substring(headEndIdx - 300, headEndIdx));

const bodyEndIdx = content.lastIndexOf('</body>');
console.log('</body> is at:', bodyEndIdx);
console.log('Before </body>:\n', content.substring(bodyEndIdx - 400, bodyEndIdx));
