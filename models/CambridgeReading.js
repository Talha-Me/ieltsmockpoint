const mongoose = require("mongoose");

const cambridgeReadingSchema = new mongoose.Schema(
  {
    book: {
      type: Number,
      required: true,
      index: true
    },
    testNo: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    // Matches your existing format: array of passages with part, title, paragraphs, paragraph-content
    passages: [
      {
        part: { type: Number, required: true },
        title: { type: String, default: "" },
        paragraphs: { type: [String], default: [] },
        "paragraph-content": { type: Array, default: [] }
      }
    ],
    // Array of question groups (T/F/NG, matching-table-container, summary, mcq, etc.)
    questions: {
      type: Array,
      required: true,
      default: []
    },
    // Array of instructions mapped with group IDs
    instructions: {
      type: Array,
      default: []
    },
    // Answers mapped by question number: { "1": ["true"], "2": ["d"] }
    answers: {
      type: Object,
      required: true,
      default: {}
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  {
    collection: "cambridge_reading",
    timestamps: true
  }
);

// Compound index for quick lookup of specific book & test
cambridgeReadingSchema.index({ book: 1, testNo: 1 }, { unique: true });

module.exports = mongoose.model("CambridgeReading", cambridgeReadingSchema);