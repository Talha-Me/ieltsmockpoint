const mongoose = require("../config/db");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    module: {
      type: String,
      required: true,
      enum: ["listening", "reading", "writing", "speaking"],
      lowercase: true,
    },
    lessonNumber: {
      type: Number,
      required: true,
      default: 1,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Band 8+"],
      default: "Intermediate",
    },
    thumbnail: {
      type: String,
      default: "", // Cloudflare R2 link
    },
    summary: {
      type: String,
      trim: true,
      maxlength: 260,
    },
    content: {
      type: String, // Rich step-by-step tutorial, tips, structures, sample band 9 answers
      required: true,
    },
    audioUrl: {
      type: String,
      default: "", // Cloudflare R2 audio link (Especially for Listening/Speaking lessons)
    },
    tips: [
      {
        type: String,
      },
    ],
    // High-Rank SEO Meta Fields
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

lessonSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

module.exports = mongoose.model("Lesson", lessonSchema, "lessons");