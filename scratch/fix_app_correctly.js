const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../app.js');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Remove rogue speaking routes in the commented area
const rogueBlock = `  // ==========================================
  // IELTS SPEAKING ROUTES
  // ==========================================
  app.get(["/speaking", "/speaking.html"], (req, res) => {
    res.sendFile(path.join(__dirname, "FrontPage", "Frontend", "speaking.html"));
  });

  app.get(["/speaking-test", "/speaking-practice"], (req, res) => {
    res.sendFile(path.join(__dirname, "views", "speaking", "speaking-test.html"));
  });`;

content = content.replace(rogueBlock, '');

// 2. Put after `app.set("views", path.join(__dirname, "views"));`
const marker = 'app.set("views", path.join(__dirname, "views"));';
const activeSpeakingRoutes = `app.set("views", path.join(__dirname, "views"));

// ==========================================
// IELTS SPEAKING ROUTES
// ==========================================
app.get(["/speaking", "/speaking.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "FrontPage", "Frontend", "speaking.html"));
});

app.get(["/speaking-test", "/speaking-practice"], (req, res) => {
  res.sendFile(path.join(__dirname, "views", "speaking", "speaking-test.html"));
});`;

content = content.replace(marker, activeSpeakingRoutes);
fs.writeFileSync(appPath, content, 'utf8');
console.log('Cleaned up and correctly inserted speaking routes after app definition!');
