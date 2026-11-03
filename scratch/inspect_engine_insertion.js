const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/speaking_engine/speaking-test.html', 'utf8');

const styleEnd = content.indexOf('</style>');
console.log('</style> at:', styleEnd);

const bodyEnd = content.lastIndexOf('</body>');
console.log('</body> at:', bodyEnd);

const startExamIdx = content.indexOf('function startSpeakingExam');
console.log('startSpeakingExam at:', startExamIdx);

const loadTestIdx = content.indexOf('async function loadTest');
console.log('loadTest at:', loadTestIdx);

const modeIdx = content.indexOf('function setPracticeMode');
console.log('setPracticeMode at:', modeIdx);
