const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../app.js');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Remove from commented-out area
const badBlock = `  // IELTS SPEAKING ROUTES (Placed before express.static to avoid directory redirects)
  // ==========================================
  app.get(["/speaking", "/speaking/"], (req, res) => {
    res.sendFile(path.join(__dirname, "FrontPage", "Frontend", "speaking.html"));
  });

  app.get(["/speaking-test", "/speaking-test/", "/speaking-practice"], (req, res) => {
    res.sendFile(path.join(__dirname, "views", "speaking", "speaking-test.html"));
  });

  `;
content = content.replace(badBlock, '');

// 2. Insert into the active area (after `app.use(express.static(path.join(__dirname, "audio")));`)
const targetPos = 'app.use(express.static(path.join(__dirname, "audio")));';
const goodBlock = `app.use(express.static(path.join(__dirname, "audio")));

  // ==========================================
  // IELTS SPEAKING ROUTES
  // ==========================================
  app.get(["/speaking", "/speaking.html"], (req, res) => {
    res.sendFile(path.join(__dirname, "FrontPage", "Frontend", "speaking.html"));
  });

  app.get(["/speaking-test", "/speaking-practice"], (req, res) => {
    res.sendFile(path.join(__dirname, "views", "speaking", "speaking-test.html"));
  });`;

content = content.replace(targetPos, goodBlock);
fs.writeFileSync(appPath, content, 'utf8');
console.log('Fixed app.js placement!');
