const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../app.js');
let content = fs.readFileSync(appPath, 'utf8');

const target = 'app.use("/", evaluateRoute);';
const speakingBlock = `app.use("/", evaluateRoute);

// ==========================================
// IELTS SPEAKING ROUTES
// ==========================================
app.get(["/speaking", "/speaking.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "FrontPage", "Frontend", "speaking.html"));
});

app.get(["/speaking-test", "/speaking-practice"], (req, res) => {
  res.sendFile(path.join(__dirname, "views", "speaking", "speaking-test.html"));
});`;

content = content.replace(target, speakingBlock);
fs.writeFileSync(appPath, content, 'utf8');
console.log('Successfully inserted speaking routes at bottom of app.js!');
