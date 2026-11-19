const mongoose = require("../config/db");

const emailVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      default: "",
      trim: true
    },
    password: {
      type: String,
      default: ""
    },
    otpHash: {
      type: String,
      required: true
    },
    purpose: {
      type: String,
      enum: ["register", "forgot"],
      required: true
    },
    attempts: {
      type: Number,
      default: 0
    },
    resendAfter: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 1000)
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // MongoDB TTL index: document automatically deleted when expiresAt is reached
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.EmailVerification ||
  mongoose.model("EmailVerification", emailVerificationSchema, "email_verifications");
