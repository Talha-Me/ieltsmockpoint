const mongoose = require("mongoose");

const cambridgeListeningSchema = new mongoose.Schema(
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
    audioUrl: {
      type: String,
      default: "" // Full test audio link
    },
    partAudios: {
      type: Map,
      of: String,
      default: {} // Part-wise individual audio: { "1": "url", "2": "url", ... }
    },
    questions: {
      type: Array,
      required: true
    },
    instructions: {
      type: Array,
      default: []
    },
    answers: {
      type: Object,
      required: true
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  {
    collection: "cambridge_listening",
    timestamps: true
  }
);

module.exports = mongoose.model("CambridgeListening", cambridgeListeningSchema);