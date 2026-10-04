const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Task 1 Schema
const task1Schema = new mongoose.Schema({
  categoryIndex: { type: String, required: true }, // "01", "02", ...
  categoryName: { type: String, required: true },  // "Line Graph", "Bar Chart", ...
  categorySlug: { type: String, required: true },  // "line-graph", ...
  badge: { type: String, default: "Writing · T1 Academic" },
  setNumber: { type: String, required: true },
  title: { type: String, required: true },
  prompt: { type: String, required: true },
  image: { type: String, required: true },
  overviewPoints: [String],
  vocabularyList: [String],
  modelAnswer: { type: String, default: "" },
  minWords: { type: Number, default: 150 },
  timeLimitMinutes: { type: Number, default: 20 },
  createdAt: { type: Date, default: Date.now }
});

const WritingTask1 = mongoose.models.WritingTask1 || mongoose.model("WritingTask1", task1Schema);

// ১. নতুন সেট আপলোড করার API
router.post("/api/admin/writing-task1", async (req, res) => {
  try {
    const task = new WritingTask1(req.body);
    await task.save();
    res.status(201).json({ success: true, message: "Task 1 practice set created!", data: task });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ২. ফ্রন্টএন্ড কার্ডের সেটের সংখ্যা (Live Set Counter) পাওয়ার API
// এর মাধ্যমে প্রতিটি কার্ডের "0 sets" বদলে ডাটাবেসে কয়টি সেট আছে তা অটোমেটিক দেখাবে (যেমন "3 sets")
router.get("/api/writing-task1/counts", async (req, res) => {
  try {
    const counts = await WritingTask1.aggregate([
      { $group: { _id: "$categorySlug", totalSets: { $sum: 1 } } }
    ]);
    res.json({ success: true, counts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;