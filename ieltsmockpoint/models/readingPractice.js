const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    pracNumber: { type: String, required: true },
    type: { type: String, required: true },
    plan: { type: String, default: "Academic" },
    reading: { type: Object, default: undefined },
  },
  {
    timestamps: true,
    strict: false
  }
);

// নিশ্চিতভাবে 'reading-practices' কালেকশনেই সেভ হবে
module.exports = mongoose.model(
  "Reading-Practice",
  questionSchema,
  "reading-practices"
);