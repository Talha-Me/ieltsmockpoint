const mongoose = require("mongoose");

const writingTask1Schema = new mongoose.Schema({
  setNumber: {
    type: String, // e.g., "Set-1", "Set-2"
    required: true,
  },
  taskType: {
    type: String,
    required: true,
    enum: [
      "Line Graph",
      "Bar Chart",
      "Pie Chart",
      "Table",
      "Process Diagram",
      "Map Comparison",
      "Mixed Charts"
    ],
  },
  plan: {
    type: String,
    default: "Academic",
  },
  title: {
    type: String,
    required: true, // e.g., "Car theft trends in four European countries"
  },
  prompt: {
    type: String,
    required: true, // "The chart below shows..."
  },
  image: {
    type: String,
    required: true, // URL of the graph/chart image
  },
  minWords: {
    type: Number,
    default: 150,
  },
  recommendedTime: {
    type: Number,
    default: 20, // in minutes
  },
  overviewTips: {
    type: [String], // bullet points to guide the student
    default: [],
  },
  band9Sample: {
    type: String, // Full model answer for reference
    default: "",
  },
  keyVocabulary: {
    type: [String], // e.g., ["dramatic plunge", "steady plateau"]
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("WritingTask1", writingTask1Schema);