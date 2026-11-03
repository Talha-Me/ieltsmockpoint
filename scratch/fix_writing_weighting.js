const fs = require('fs');
const path = require('path');
const vm = require('vm');

const evalPath = path.join(__dirname, '../routes/evaluate.js');
let content = fs.readFileSync(evalPath, 'utf8').replace(/\r\n/g, '\n');

const oldBlock = `    let finalWritingBand = 0;
    if (!eval1.not_submitted && !eval2.not_submitted && eval1.overall_band > 0 && eval2.overall_band > 0) {
      // Official IELTS Writing weighting: Task 2 carries twice the weight of Task 1
      const raw = (eval1.overall_band + eval2.overall_band * 2) / 3;
      finalWritingBand = Math.round(raw * 2) / 2;
    } else if (!eval2.not_submitted && eval2.overall_band > 0) {
      finalWritingBand = eval2.overall_band;
    } else if (!eval1.not_submitted && eval1.overall_band > 0) {
      finalWritingBand = eval1.overall_band;
    }`;

const newBlock = `    const t1Band = (!eval1.not_submitted && typeof eval1.overall_band === 'number' && eval1.overall_band > 0) ? eval1.overall_band : 0;
    const t2Band = (!eval2.not_submitted && typeof eval2.overall_band === 'number' && eval2.overall_band > 0) ? eval2.overall_band : 0;

    let finalWritingBand = 0;
    if (t1Band > 0 || t2Band > 0) {
      // Official IELTS Writing weighting (Cambridge / British Council / IDP):
      // Task 2 carries 2/3 (twice the weight) of Task 1 (1/3).
      // If Task 2 is unattempted, it receives Band 0: final = (t1Band + 0) / 3
      // If Task 1 is unattempted, it receives Band 0: final = (0 + 2 * t2Band) / 3
      const raw = (t1Band + (t2Band * 2)) / 3;
      finalWritingBand = snapHalfBand(raw, 0);
    }`;

if (!content.includes(oldBlock)) {
  throw new Error('oldBlock not found in routes/evaluate.js');
}

content = content.replace(oldBlock, newBlock);
new vm.Script(content);
fs.writeFileSync(evalPath, content, 'utf8');
console.log('routes/evaluate.js updated and syntax verified!');
