const mongoose = require("mongoose");

const systemSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "global_config", unique: true },
    currentPhase: { type: Number, default: 1, enum: [1, 2, 3] }, // 1: Open Growth, 2: Freemium/Lead Gen, 3: Paid/Subscription
    freeAcademicMocksCount: { type: Number, default: 1 },
    freePremiumMocksCount: { type: Number, default: 1 },
    freeFullMocksCount: { type: Number, default: 1 },
    freeSpeakingTestsCount: { type: Number, default: 1 },
    freeSpeakingPartsCount: { type: Number, default: 1 },
    freeRecentTestsCount: { type: Number, default: 2 },
    freePartsPerTest: { type: Number, default: 1 },
    freeQuestionTypesPerTest: { type: Number, default: 0 },
    freePracticeHubSets: { type: Number, default: 2 },
    freeAiWritingPerDay: { type: Number, default: 1 },
    loginReminderEnabled: { type: Boolean, default: true },
    loginReminderMode: { type: String, enum: ["every_time", "once_per_session"], default: "every_time" },
    cambridgeAlwaysFree: { type: Boolean, default: true },
    updatedBy: { type: String, default: "admin" }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.SystemSettings ||
  mongoose.model("SystemSettings", systemSettingsSchema);
