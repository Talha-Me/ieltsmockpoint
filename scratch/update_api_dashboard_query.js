const fs = require('fs');
const path = require('path');
const vm = require('vm');

const apiPath = path.join(__dirname, '../routes/api.js');
let content = fs.readFileSync(apiPath, 'utf8').replace(/\r\n/g, '\n');

const oldRecordPush = `      seenIds.add(r.testId || r._id.toString());
      combinedHistory.push({
        id: r._id,
        testId: r.testId,
        title: r.title || 'IELTS Mock Test',
        testType: r.testType || 'Full Mock',
        module: r.module || null,
        totalQuestions: r.totalQuestions || 40,
        listeningScore: r.listeningScore || 0,
        readingScore: r.readingScore || 0,
        writingScore: r.writingScore || 0,
        listeningBand: r.listeningBand || 0,
        readingBand: r.readingBand || 0,
        writingBand: r.writingBand || 0,
        overallBand: r.overallBand || 0,
        totalWords: r.totalWords || 0,
        feedback: r.feedback || {},
        mistakes: r.mistakes || [],
        answers: r.answers || {},
        completedAt: r.completedAt
      });`;

const newRecordPush = `      seenIds.add(r.testId || r._id.toString());

      const validBands = [r.listeningBand, r.readingBand, r.writingBand].filter(b => typeof b === 'number' && b > 0);
      let calculatedOverall = r.overallBand || 0;
      if (!calculatedOverall && validBands.length > 0) {
        const avg = validBands.reduce((a, b) => a + b, 0) / validBands.length;
        calculatedOverall = Math.round(avg * 2) / 2;
      }

      combinedHistory.push({
        id: r._id,
        testId: r.testId,
        title: r.title || 'IELTS Mock Test',
        testType: r.testType || 'Full Mock',
        module: r.module || null,
        totalQuestions: r.totalQuestions || 40,
        listeningScore: r.listeningScore || 0,
        readingScore: r.readingScore || 0,
        writingScore: r.writingScore || 0,
        listeningBand: r.listeningBand || 0,
        readingBand: r.readingBand || 0,
        writingBand: r.writingBand || 0,
        overallBand: calculatedOverall,
        totalWords: r.totalWords || 0,
        feedback: r.feedback || {},
        mistakes: r.mistakes || [],
        answers: r.answers || {},
        completedAt: r.completedAt || r.createdAt || new Date()
      });`;

if (!content.includes(oldRecordPush)) {
  throw new Error('oldRecordPush not found in routes/api.js');
}

content = content.replace(oldRecordPush, newRecordPush);
new vm.Script(content);
fs.writeFileSync(apiPath, content, 'utf8');
console.log('routes/api.js successfully updated & validated!');
