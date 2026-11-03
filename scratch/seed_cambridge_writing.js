const mongoose = require('../config/db');
const fs = require('fs');
const path = require('path');

async function seed() {
  try {
    const jsonPath = path.resolve(__dirname, '../data/cambridgeWriting12_21.json');
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Loaded ${data.length} tests from JSON.`);

    const Schema = new mongoose.Schema({}, { strict: false });
    const CambridgeWriting =
      mongoose.models.CambridgeWriting ||
      mongoose.model('CambridgeWriting', Schema, 'cambridgewritings');

    let inserted = 0;
    let updated = 0;

    for (const item of data) {
      const res = await CambridgeWriting.updateOne(
        { book: item.book, testNo: item.testNo },
        { $set: item },
        { upsert: true }
      );
      if (res.upsertedCount > 0) inserted++;
      else updated++;
    }

    console.log(`Seeding complete: ${inserted} inserted, ${updated} updated.`);
    const total = await CambridgeWriting.countDocuments();
    console.log(`Total documents in 'cambridgewritings': ${total}`);

    // Verify first and last
    const first = await CambridgeWriting.findOne({ book: 12, testNo: 1 });
    const last = await CambridgeWriting.findOne({ book: 21, testNo: 4 });
    console.log('Verified Book 12 Test 1 title:', first?.title);
    console.log('Verified Book 21 Test 4 title:', last?.title);

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

mongoose.connection.once('open', seed);
