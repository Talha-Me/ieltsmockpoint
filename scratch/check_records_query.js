const fs = require('fs');
const content = fs.readFileSync('../routes/api.js', 'utf8');
console.log('Query without filter:', content.includes('const records = await StudentTestRecord.find({ userEmail })'));
console.log('Query with ne filter:', content.includes('const records = await StudentTestRecord.find({ userEmail, status: { $ne: "in-progress" } })'));
