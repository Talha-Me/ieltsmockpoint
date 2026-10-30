const mongoose = require("mongoose");

const cambridgeTestSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      enum: ["listening", "reading", "writing"],
      required: true,
    },
    book: {
      type: String, // e.g. "Cambridge 19"
      required: true,
    },
    testNo: {
      type: String, // e.g. "Test 1"
      required: true,
    },
    title: {
      type: String, // e.g. "Cambridge 19 - Academic Reading Test 1"
      required: true,
    },
    audioUrl: {
      type: String, // Listening-এর অডিও ফাইল লিংক (Reading/Writing-এর জন্য খালি থাকবে)
      default: "",
    },
    passages: [
      {
        passageNo: Number,
        title: String,
        content: String,
      },
    ],
    questions: {
      type: Object, // HTML ফরম্যাট বা প্রশ্ন কাঠামোর ডাটা
      required: true,
    },
    answers: {
      type: Object, // { "1": ["answer1", "alt answer"], "2": ["b"] }
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "cambridge_tests", // সরাসরি কালেকশনের নাম নির্দিষ্ট করে দেওয়া হলো
    timestamps: true,
  }
);

module.exports = mongoose.model("CambridgeTest", cambridgeTestSchema);