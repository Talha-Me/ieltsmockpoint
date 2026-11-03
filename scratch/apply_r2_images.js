const fs = require('fs');
const path = require('path');
const mongoose = require('../config/db');

async function applyImages() {
  const dir = path.resolve(__dirname, '../Writing part 1 pictures');
  const files = fs.readdirSync(dir);

  const mapping = {};
  for (const f of files) {
    const match = f.match(/cambridge[-_]ielts[-_](\d+)[-_]academic[-_]writing[-_]test[-_](\d+)/i);
    if (!match) continue;
    const book = parseInt(match[1]);
    const testNo = parseInt(match[2]);
    const url = `https://pub-f88da22cc9ae4937a6641b7ee1702c05.r2.dev/Writing%20part%201%20pictures/${encodeURIComponent(f)}`;
    mapping[`${book}-${testNo}`] = url;
  }

  // 1. Update JSON file
  const jsonPath = path.resolve(__dirname, '../data/cambridgeWriting12_21.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  for (const test of data) {
    const key = `${test.book}-${test.testNo}`;
    const imgUrl = mapping[key];
    if (imgUrl && test.writing && test.writing.questions) {
      test.writing.questions.forEach(q => {
        if (q.part === 1) {
          q.image = [imgUrl];
        }
      });
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${jsonPath} with all 40 image URLs!`);

  // 2. Update MongoDB
  const Schema = new mongoose.Schema({}, { strict: false });
  const CambridgeWriting =
    mongoose.models.CambridgeWriting ||
    mongoose.model('CambridgeWriting', Schema, 'cambridgewritings');

  let updatedCount = 0;
  for (const test of data) {
    const res = await CambridgeWriting.updateOne(
      { book: test.book, testNo: test.testNo },
      { $set: { "writing.questions": test.writing.questions } }
    );
    if (res.modifiedCount > 0 || res.matchedCount > 0) {
      updatedCount++;
    }
  }

  console.log(`Updated ${updatedCount} records in MongoDB 'cambridgewritings' collection.`);

  // Sample check Book 12 Test 1 and Book 20 Test 1 and Book 21 Test 4
  for (const check of [{ b: 12, t: 1 }, { b: 20, t: 1 }, { b: 21, t: 4 }]) {
    const doc = await CambridgeWriting.findOne({ book: check.b, testNo: check.t });
    console.log(`\nSample Check: Cambridge ${check.b} Test ${check.t}`);
    console.log(`  Task 1 image:`, doc?.writing?.questions[0]?.image);
  }

  process.exit(0);
}

mongoose.connection.once('open', applyImages);
