const mongoose = require("../config/db");

const blogSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
      enum: ["Tips & Tricks", "Vocabulary", "Writing Band 8", "Listening Strategy", "Speaking Secrets", "Exam Updates"],
      default: "Tips & Tricks",
    },
    thumbnail: {
      type: String,
      default: "", // Cloudflare R2 link
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 220,
    },
    content: {
      type: String, // Rich HTML containing structured <h2>, <h3>, <p>, <blockquote>, <img>, etc.
      required: true,
    },
    author: {
      name: { type: String, default: "IELTS Point Editorial" },
      avatar: { type: String, default: "/images/author-avatar.png" },
    },
    readTimeMinutes: {
      type: Number,
      default: 5,
    },
    tags: [
      {
        type: String,
        trim: true,
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
    canonicalUrl: {
      type: String,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto slug generation hook if missing
blogSchema.pre("validate", function (next) {
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

module.exports = mongoose.model("Blog", blogSchema, "blogs");