const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../app.js');
let content = fs.readFileSync(appPath, 'utf8');

// First remove any previously added speaking routes from lines 1070
content = content.replace(`  // ==========================================
  // IELTS SPEAKING PRACTICE & TEST ENGINE
  // ==========================================
  app.get(["/speaking", "/speaking.html"], (req, res) => {
    res.sendFile(
      path.join(__dirname, "FrontPage", "Frontend", "speaking.html"),
      (err) => {
        if (err && !res.headersSent) res.status(err.status || 500).send(err.message);
      }
    );
  });

  app.get(["/speaking-test", "/speaking-practice"], (req, res) => {
    res.sendFile(
      path.join(__dirname, "views", "speaking", "speaking-test.html"),
      (err) => {
        if (err && !res.headersSent) res.status(err.status || 500).send(err.message);
      }
    );
  });\n`, '');

// Now insert right before STATIC ASSETS ROUTES
const staticMarker = '// STATIC ASSETS ROUTES (ALL FOLDERS INCLUDED)';
const speakingRoutes = `// ==========================================
  // IELTS SPEAKING ROUTES (Placed before express.static to avoid directory redirects)
  // ==========================================
  app.get(["/speaking", "/speaking/"], (req, res) => {
    res.sendFile(path.join(__dirname, "FrontPage", "Frontend", "speaking.html"));
  });

  app.get(["/speaking-test", "/speaking-test/", "/speaking-practice"], (req, res) => {
    res.sendFile(path.join(__dirname, "views", "speaking", "speaking-test.html"));
  });

  `;

content = content.replace(staticMarker, `${speakingRoutes}\n  ${staticMarker}`);
fs.writeFileSync(appPath, content, 'utf8');
console.log('app.js cleanly updated!');
