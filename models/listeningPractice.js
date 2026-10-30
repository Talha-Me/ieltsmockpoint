const mongoose = require("mongoose");

const listeningSchema = new mongoose.Schema(
  {
    pracNumber: { type: String, required: true },
    type: { type: String, required: true },
    plan: { type: String, default: "Academic" },
    listening: { type: Object, required: true }
  },
  {
    timestamps: true,
    strict: false
  }
);

module.exports = mongoose.model(
  "Listening-Practice",
  listeningSchema,
  "listening-practices"
);