const http = require('http');

function get(path, headers = {}) {
  return new Promise((resolve, reject) => {
    http.get({
      host: 'localhost',
      port: 5001,
      path,
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch(e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function testEndpoints() {
  try {
    const res = await get('/api/student/test-record/6ae9700c4bee3c54aaf40cdb');
    console.log('GET /api/student/test-record/6ae9700c4bee3c54aaf40cdb: Status', res.status);
    if (res.body && res.body.success) {
      console.log('Record title:', res.body.record.title);
      console.log('Listening score:', res.body.record.listeningScore);
      console.log('Listening mistakes count:', res.body.record.mistakes?.listening?.length);
      console.log('Sample question 1:', res.body.record.mistakes?.listening?.[0]);
      console.log('Sample question 16:', res.body.record.mistakes?.listening?.[15]);
      console.log('Sample question 17:', res.body.record.mistakes?.listening?.[16]);
    } else {
      console.log('Response body:', res.body || res.raw);
    }
  } catch (err) {
    console.error('Server request error:', err.message);
  }
}

testEndpoints();
