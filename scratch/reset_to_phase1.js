const mongoose = require('../config/db');
const SystemSettings = require('../models/SystemSettings');

async function resetPhase1() {
  await SystemSettings.findOneAndUpdate(
    { key: "global_config" },
    { $set: { currentPhase: 1 } },
    { upsert: true }
  );
  console.log('Reset currentPhase to 1 (Open Growth)');
  process.exit(0);
}

resetPhase1();
