const fs = require('fs');
const dashHtml = fs.readFileSync('D:/personal websites/ieltsmockpoint/FrontPage/Frontend/dashboard.html', 'utf8');

const tableIdx = dashHtml.indexOf('id="activityTableBody"');
console.log('--- Table HTML in dashboard.html ---');
console.log(dashHtml.substring(tableIdx - 500, tableIdx + 300));
