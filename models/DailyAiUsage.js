const mongoose = require("mongoose");

const dailyAiUsageSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true }, // deviceId OR user email/id OR ipHash
    type: { type: String, enum: ["device", "user", "ip"], required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    writingCount: { type: Number, default: 0 },
    speakingCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Fast compound index for daily queries
dailyAiUsageSchema.index({ identifier: 1, date: 1, type: 1 }, { unique: true });

// Auto-purge records older than 4 days to keep DB fast and light
dailyAiUsageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 * 4 });

module.exports =
  mongoose.models.DailyAiUsage ||
  mongoose.model("DailyAiUsage", dailyAiUsageSchema);
