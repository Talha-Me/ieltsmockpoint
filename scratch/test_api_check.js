const http = require('http');

async function checkApi() {
  http.get('http://localhost:5001/api/student/test-record/6ae97c3af9c1a4fdda3045bb', res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      console.log('GET /api/student/test-record/:id HTTP', res.statusCode);
      const json = JSON.parse(d);
      console.log('title:', json.record?.title);
      console.log('writingBand:', json.record?.writingBand);
      console.log('overallBand:', json.record?.overallBand);
      console.log('listening mistakes count:', json.record?.mistakes?.listening?.length);
    });
  }).on('error', err => console.error(err));
}

checkApi();
