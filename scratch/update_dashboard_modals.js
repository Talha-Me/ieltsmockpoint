const fs = require('fs');
const path = require('path');

const targetStr = `      // 1. Find from globalHistory or fetch by ID
      let rec = globalHistory.find(h => String(h.id) === String(recordId));
      if (!rec || !rec.mistakes || Object.keys(rec.mistakes).length === 0) {
        try {
          const res = await fetch('/api/student/test-record/' + recordId);
          const data = await res.json();
          if (data && data.success && data.record) {
            rec = data.record;
          }
        } catch (e) {
          console.warn('Could not fetch single record:', e);
        }
      }`;

const replaceStr = `      // 1. Fetch complete record by ID to guarantee fresh 1-40 evaluated breakdown
      let rec = globalHistory.find(h => String(h.id) === String(recordId)) || {};
      try {
        const res = await fetch('/api/student/test-record/' + recordId);
        const data = await res.json();
        if (data && data.success && data.record) {
          rec = data.record;
        }
      } catch (e) {
        console.warn('Could not fetch single record:', e);
      }`;

[
  path.join(__dirname, '../public/dashboard.html'),
  path.join(__dirname, '../FrontPage/Frontend/dashboard.html')
].forEach(p => {
  let content = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
  if (content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
    fs.writeFileSync(p, content, 'utf8');
    console.log('Updated ' + path.basename(p));
  } else {
    console.warn('targetStr not found in ' + p);
  }
});
