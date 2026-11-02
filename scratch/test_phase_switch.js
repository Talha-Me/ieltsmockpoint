const http = require('http');

function postSettings(phase, callback) {
  const payload = JSON.stringify({ currentPhase: phase });
  const req = http.request('http://localhost:5001/api/admin/system-settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  }, res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      console.log(`Updated to Phase ${phase} -> Status:`, res.statusCode, JSON.parse(data));
      callback();
    });
  });
  req.on('error', e => console.error('Error:', e.message));
  req.write(payload);
  req.end();
}

function getSettings(expectedPhase) {
  http.get('http://localhost:5001/api/system-settings', res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      const parsed = JSON.parse(data);
      console.log(`Verified GET settings -> currentPhase:`, parsed.settings.currentPhase, parsed.settings.currentPhase === expectedPhase ? '✓ SUCCESS' : '✗ FAILED');
    });
  });
}

// Test setting Phase 2 and verify
postSettings(2, () => {
  getSettings(2);
});
