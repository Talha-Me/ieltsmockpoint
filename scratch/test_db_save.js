const mongoose = require('../config/db');
const SystemSettings = require('../models/SystemSettings');

async function testSave() {
  try {
    const updated = await SystemSettings.findOneAndUpdate(
      { key: "global_config" },
      {
        $set: {
          currentPhase: 2,
          freeFullMocksCount: 1,
          freePartsPerTest: 1,
          freeQuestionTypesPerTest: 1,
          freePracticeHubSets: 3,
          freeAiWritingPerDay: 1,
          loginReminderEnabled: true,
          cambridgeAlwaysFree: true
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('Save success:', updated);
  } catch(e) {
    console.error('Save failed:', e);
  } finally {
    process.exit(0);
  }
}

testSave();
