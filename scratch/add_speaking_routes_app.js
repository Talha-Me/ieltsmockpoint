const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../app.js');
let content = fs.readFileSync(appPath, 'utf8');

const targetStr = 'app.get("/writing-practice", authRoutes.writing_practice);';
const routesToAdd = `app.get("/writing-practice", authRoutes.writing_practice);

  // ==========================================
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
  });`;

if (!content.includes('app.get(["/speaking-test"')) {
  content = content.replace(targetStr, routesToAdd);
  fs.writeFileSync(appPath, content, 'utf8');
  console.log('app.js updated with speaking routes!');
} else {
  console.log('app.js already has speaking routes.');
}
