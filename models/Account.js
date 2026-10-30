const mongoose = require("../config/db");

const accountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Google diye khola account e password thakbe na
    password: { type: String, default: null },
    googleId: { type: String, default: null, index: true },
    avatar: { type: String, default: "" },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    // Forgot password: token er sudhu hash save hoy, asol token shudhu email e jay
    resetTokenHash: { type: String, default: null, index: true },
    resetTokenExpires: { type: Date, default: null }
  },
  { timestamps: true }
);

// Alada collection ("accounts") ba'e purono users collection er phone unique index er sathe conflict na hoy
module.exports =
  mongoose.models.Account || mongoose.model("Account", accountSchema, "accounts");