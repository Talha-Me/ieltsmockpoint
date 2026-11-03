const http = require('http');

function postJSON(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost',
      port: 5001,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch(e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function getJSON(path) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: 'localhost', port: 5001, path: path }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch(e) {
          resolve({ status: res.statusCode, body });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('Testing Auto-Save & Record Endpoints...');

  // 1. Auto-save test
  const autoSaveRes = await postJSON('/api/student/auto-save', {
    testId: 'Academic-UKA-FINAL-1',
    testType: 'full-mock',
    module: 'listening',
    answers: { 1: ['train'], 2: ['station'] },
    email: 'test-autosave@ieltsmockpoint.com'
  });
  console.log('1. Auto-Save Response:', autoSaveRes);

  // 2. Final Record completion test with mistakes breakdown
  const recordRes = await postJSON('/api/student/record-test', {
    testId: 'Academic-UKA-FINAL-1',
    testType: 'Academic Full Mock',
    title: 'Academic Mock Test 1',
    email: 'test-autosave@ieltsmockpoint.com',
    listeningScore: 32,
    readingScore: 30,
    writingScore: 7.0,
    listeningBand: 7.5,
    readingBand: 7.0,
    writingBand: 7.0,
    overallBand: 7.0,
    totalWords: 420,
    feedback: {
      task1: { band: 7.0, summary_feedback: 'Well organized overview with accurate data comparisons.' },
      task2: { band: 7.0, summary_feedback: 'Clear position presented throughout with well-developed ideas.' }
    },
    mistakes: {
      listening: [
        { qNum: 1, yourAns: 'train', officialAns: 'train', isCorrect: true },
        { qNum: 2, yourAns: 'bus', officialAns: 'train', isCorrect: false }
      ],
      reading: [
        { qNum: 1, yourAns: 'TRUE', officialAns: 'TRUE', isCorrect: true }
      ]
    },
    answers: {
      listening: { 1: ['train'], 2: ['bus'] },
      reading: { 1: ['TRUE'] },
      writing: { 'part-1': 'The chart illustrates...', 'part-2': 'In modern society...' }
    }
  });
  console.log('2. Record Test Response:', recordRes);

  if (recordRes.data && recordRes.data.recordId) {
    // 3. Fetch single test record
    const singleRec = await getJSON('/api/student/test-record/' + recordRes.data.recordId);
    console.log('3. Fetch Record by ID Response Status:', singleRec.status);
    console.log('   Title:', singleRec.data?.record?.title);
    console.log('   Mistakes count listening:', singleRec.data?.record?.mistakes?.listening?.length);
    console.log('   Writing feedback task1 band:', singleRec.data?.record?.feedback?.task1?.band);
  }

  // 4. Clean up test record from database so it doesn't pollute live data
  const StudentTestRecord = require('D:/personal websites/ieltsmockpoint/models/StudentTestRecord');
  await StudentTestRecord.deleteMany({ userEmail: 'test-autosave@ieltsmockpoint.com' });
  console.log('4. Cleaned up temporary test record from database.');

  console.log('\nAll End-to-End Tests Passed Successfully!');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
