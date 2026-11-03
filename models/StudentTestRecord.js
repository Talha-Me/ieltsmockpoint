const mongoose = require("mongoose");

const studentTestRecordSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, index: true, lowercase: true, trim: true },
    userId: { type: String, default: null, index: true },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "completed",
      index: true
    },
    testType: {
      type: String,
      default: "full-mock"
    },
    module: { type: String, default: null }, // "reading", "listening", "writing"
    testId: { type: String, default: "" }, // e.g. "Academic-UKA-FINAL-1" or "cambridge-21-test-1"
    title: { type: String, default: "IELTS Test" },
    totalQuestions: { type: Number, default: null },
    listeningScore: { type: Number, default: null },
    readingScore: { type: Number, default: null },
    writingScore: { type: Number, default: null },
    speakingScore: { type: Number, default: null },
    listeningBand: { type: Number, default: null },
    readingBand: { type: Number, default: null },
    writingBand: { type: Number, default: null },
    speakingBand: { type: Number, default: null },
    overallBand: { type: Number, default: null },
    totalWords: { type: Number, default: null },
    feedback: { type: mongoose.Schema.Types.Mixed, default: {} },
    writingTask1Feedback: { type: mongoose.Schema.Types.Mixed, default: null },
    writingTask2Feedback: { type: mongoose.Schema.Types.Mixed, default: null },
    mistakes: { type: mongoose.Schema.Types.Mixed, default: {} },
    answers: { type: mongoose.Schema.Types.Mixed, default: {} },
    lastSavedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.StudentTestRecord ||
  mongoose.model("StudentTestRecord", studentTestRecordSchema);
