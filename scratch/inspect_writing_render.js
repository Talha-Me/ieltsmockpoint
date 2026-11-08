const fs = require("fs");
const lines = fs.readFileSync("D:/personal websites/ieltsmockpoint/views/test_pages/writing/scripts-writing.js", "utf8").replace(/\r\n/g, "\n").split("\n");

console.log("Writing lines 3690-3720:");
for (let i = 3690; i < 3720; i++) {
  console.log(i + 1, lines[i]);
}
