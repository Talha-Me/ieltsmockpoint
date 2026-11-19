const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const Account = require("../models/Account");
const EmailVerification = require("../models/EmailVerification");
const { sendOtpEmail } = require("../services/otpMailService");

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sha256 = (s) => crypto.createHash("sha256").update(String(s)).digest("hex");

const publicUser = (a) => {
  const now = new Date();
  const notExpired = !a.premiumExpiresAt || new Date(a.premiumExpiresAt) > now;
  const activePremium = Boolean(a.isPremium && notExpired);
  return {
    id: a._id,
    name: a.name,
    email: a.email,
    avatar: a.avatar || "",
    role: a.role || "student",
    plan: activePremium ? (a.plan || "premium") : "free",
    isPremium: activePremium,
    premiumExpiresAt: a.premiumExpiresAt || null
  };
};

// session e user rekhe dei (app.js e express-session already ache)
function startSession(req, account) {
  return new Promise((resolve, reject) => {
    req.session.user = publicUser(account);
    req.session.save((err) => (err ? reject(err) : resolve()));
  });
}

// ---------------------------------------------------------------------------
// 1. REGISTER: Send 6-digit OTP (Verify Email First)
// ---------------------------------------------------------------------------
router.post(["/register/send-otp", "/auth/register/send-otp", "/register"], async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (name.length < 2) {
      return res.status(400).json({ success: false, message: "Please enter your full name (at least 2 characters)." });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }
    if (password.length < 4) {
      return res.status(400).json({ success: false, message: "Password must be at least 4 characters." });
    }

    const existing = await Account.findOne({ email });
    if (existing) {
      const msg =
        existing.provider === "google" && !existing.password
          ? "This email is registered with Google. Please click 'Continue with Google'."
          : "This email is already registered. Please log in.";
      return res.status(409).json({ success: false, message: msg });
    }

    // Rate limiting: cooldown of 60 seconds
    const pending = await EmailVerification.findOne({
      email,
      purpose: "register",
      expiresAt: { $gt: new Date() }
    });

    if (pending && pending.resendAfter && pending.resendAfter > new Date()) {
      const waitSec = Math.ceil((pending.resendAfter.getTime() - Date.now()) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSec} seconds before requesting a new code.`
      });
    }

    // Generate 6-digit secure numeric OTP
    const otp = String(crypto.randomInt(100000, 999999));
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpHash = sha256(otp);

    await EmailVerification.findOneAndUpdate(
      { email, purpose: "register" },
      {
        email,
        name,
        password: hashedPassword,
        otpHash,
        purpose: "register",
        attempts: 0,
        resendAfter: new Date(Date.now() + 60 * 1000), // 60s cooldown
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendOtpEmail(email, name, otp, "register");

    return res.status(200).json({
      success: true,
      requireOtp: true,
      email,
      message: "A 6-digit verification code has been sent to your email."
    });
  } catch (err) {
    console.error("Register send-otp error:", err);
    return res.status(500).json({ success: false, message: "Failed to send verification code. Please try again." });
  }
});

// ---------------------------------------------------------------------------
// 2. REGISTER: Verify 6-digit OTP & Create Authentic Account
// ---------------------------------------------------------------------------
router.post(["/register/verify-otp", "/auth/register/verify-otp"], async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const otp = String(req.body.otp || "").trim();

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: "Valid email is required." });
    }
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: "Please enter the 6-digit verification code." });
    }

    const record = await EmailVerification.findOne({
      email,
      purpose: "register",
      expiresAt: { $gt: new Date() }
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired or is invalid. Please request a new code."
      });
    }

    if (record.attempts >= 5) {
      await EmailVerification.deleteOne({ _id: record._id });
      return res.status(429).json({
        success: false,
        message: "Too many failed attempts. Please request a new verification code."
      });
    }

    if (sha256(otp) !== record.otpHash) {
      record.attempts += 1;
      await record.save();
      const remaining = 5 - record.attempts;
      return res.status(400).json({
        success: false,
        message: `Invalid code. ${remaining > 0 ? remaining + " attempt(s) remaining." : "Please request a new code."}`
      });
    }

    // Double-check existing account
    const existing = await Account.findOne({ email });
    if (existing) {
      await EmailVerification.deleteOne({ _id: record._id });
      return res.status(409).json({ success: false, message: "This email is already registered. Please log in." });
    }

    // Create the authentic, verified account
    const newAccount = await Account.create({
      name: record.name,
      email: record.email,
      password: record.password,
      provider: "local"
    });

    await EmailVerification.deleteOne({ _id: record._id });
    await startSession(req, newAccount);

    return res.status(201).json({
      success: true,
      message: "Account verified and created successfully!",
      user: publicUser(newAccount)
    });
  } catch (err) {
    console.error("Register verify-otp error:", err);
    if (err && err.code === 11000) {
      return res.status(409).json({ success: false, message: "This email is already registered. Please log in." });
    }
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

// ---------------------------------------------------------------------------
// 3. REGISTER: Resend 6-digit OTP
// ---------------------------------------------------------------------------
router.post(["/register/resend-otp", "/auth/register/resend-otp"], async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: "Valid email is required." });
    }

    const record = await EmailVerification.findOne({
      email,
      purpose: "register"
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "No pending registration found. Please fill in the registration form."
      });
    }

    if (record.resendAfter && record.resendAfter > new Date()) {
      const waitSec = Math.ceil((record.resendAfter.getTime() - Date.now()) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSec} seconds before requesting a new code.`
      });
    }

    const otp = String(crypto.randomInt(100000, 999999));
    record.otpHash = sha256(otp);
    record.attempts = 0;
    record.resendAfter = new Date(Date.now() + 60 * 1000);
    record.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await record.save();

    await sendOtpEmail(email, record.name, otp, "register");

    return res.status(200).json({
      success: true,
      message: "A new 6-digit verification code has been sent."
    });
  } catch (err) {
    console.error("Register resend-otp error:", err);
    return res.status(500).json({ success: false, message: "Failed to resend code. Please try again." });
  }
});

// ---------------------------------------------------------------------------
// POST /login  { email, password }
// ---------------------------------------------------------------------------
router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!EMAIL_RE.test(email) || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    if (!account.password) {
      return res
        .status(400)
        .json({ success: false, message: "This account uses Google login. Please click 'Continue with Google'." });
    }

    const ok = await bcrypt.compare(password, account.password);
    if (!ok) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    await startSession(req, account);
    return res.json({ success: true, user: publicUser(account), redirect: "/mocks" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

// ---------------------------------------------------------------------------
// POST /auth/google  { credential }   (Google ID token)
// ---------------------------------------------------------------------------
router.post("/auth/google", async (req, res) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({ success: false, message: "Google login is not configured on the server." });
    }

    const credential = req.body.credential;
    if (!credential) {
      return res.status(400).json({ success: false, message: "Missing Google credential." });
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });
    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.email_verified) {
      return res.status(401).json({ success: false, message: "Google email is not verified." });
    }

    const email = payload.email.toLowerCase();
    let account = await Account.findOne({ email });

    if (!account) {
      account = await Account.create({
        name: payload.name || email.split("@")[0],
        email,
        googleId: payload.sub,
        avatar: payload.picture || "",
        provider: "google"
      });
    } else if (!account.googleId) {
      // age email/password diye register korechilo, ekhon Google link hocche
      account.googleId = payload.sub;
      if (!account.avatar && payload.picture) account.avatar = payload.picture;
      await account.save();
    }

    await startSession(req, account);
    return res.json({ success: true, user: publicUser(account), redirect: "/mocks" });
  } catch (err) {
    console.error("Google auth error:", err.message);
    return res.status(401).json({ success: false, message: "Google login failed. Please try again." });
  }
});

// ---------------------------------------------------------------------------
// Forgot password
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// 4. FORGOT PASSWORD: Send 6-digit OTP & Reset Link
// ---------------------------------------------------------------------------
const RESET_MINUTES = 15;

function getTransport() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT || 465),
    secure: String(process.env.EMAIL_PORT || 465) === "465",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
}

// POST /auth/forgot { email }
router.post(["/auth/forgot", "/auth/forgot/send-otp"], async (req, res) => {
  const generic = {
    success: true,
    message: "If this email is registered, a 6-digit reset code has been sent. Please check your inbox (and spam folder)."
  };

  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }

    const account = await Account.findOne({ email });
    if (!account) return res.json(generic);

    if (account.provider === "google" && !account.password) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google Login. Please sign in by clicking 'Continue with Google'."
      });
    }

    // Rate limiting: 60s cooldown
    const pending = await EmailVerification.findOne({
      email,
      purpose: "forgot",
      expiresAt: { $gt: new Date() }
    });

    if (pending && pending.resendAfter && pending.resendAfter > new Date()) {
      const waitSec = Math.ceil((pending.resendAfter.getTime() - Date.now()) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSec} seconds before requesting a new code.`
      });
    }

    // 6-digit OTP
    const otp = String(crypto.randomInt(100000, 999999));
    const token = crypto.randomBytes(32).toString("hex");

    // Save token hash on account for link reset support
    account.resetTokenHash = sha256(token);
    account.resetTokenExpires = new Date(Date.now() + RESET_MINUTES * 60 * 1000);
    await account.save();

    // Save OTP verification record for 6-digit OTP reset
    await EmailVerification.findOneAndUpdate(
      { email, purpose: "forgot" },
      {
        email,
        name: account.name,
        otpHash: sha256(otp),
        purpose: "forgot",
        attempts: 0,
        resendAfter: new Date(Date.now() + 60 * 1000),
        expiresAt: new Date(Date.now() + RESET_MINUTES * 60 * 1000)
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send 6-digit OTP email
    await sendOtpEmail(email, account.name, otp, "forgot");

    return res.json(generic);
  } catch (err) {
    console.error("Forgot password error:", err.message);
    return res.status(500).json({ success: false, message: "Could not send the email. Please try again later." });
  }
});

// ---------------------------------------------------------------------------
// 5. FORGOT PASSWORD: Reset with 6-digit OTP { email, otp, password }
// ---------------------------------------------------------------------------
router.post(["/auth/forgot/verify-otp", "/auth/reset-otp"], async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const otp = String(req.body.otp || "").trim();
    const password = String(req.body.password || "");

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: "Valid email is required." });
    }
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: "Please enter the 6-digit reset code." });
    }
    if (password.length < 4) {
      return res.status(400).json({ success: false, message: "Password must be at least 4 characters." });
    }

    const record = await EmailVerification.findOne({
      email,
      purpose: "forgot",
      expiresAt: { $gt: new Date() }
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Reset code has expired or is invalid. Please request a new code."
      });
    }

    if (record.attempts >= 5) {
      await EmailVerification.deleteOne({ _id: record._id });
      return res.status(429).json({
        success: false,
        message: "Too many failed attempts. Please request a new reset code."
      });
    }

    if (sha256(otp) !== record.otpHash) {
      record.attempts += 1;
      await record.save();
      const remaining = 5 - record.attempts;
      return res.status(400).json({
        success: false,
        message: `Invalid code. ${remaining > 0 ? remaining + " attempt(s) remaining." : "Please request a new code."}`
      });
    }

    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found." });
    }

    account.password = await bcrypt.hash(password, 10);
    account.resetTokenHash = null;
    account.resetTokenExpires = null;
    await account.save();

    await EmailVerification.deleteOne({ _id: record._id });

    return res.json({
      success: true,
      message: "Password updated successfully! Please log in with your new password."
    });
  } catch (err) {
    console.error("Forgot password verify-otp error:", err);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

// POST /auth/reset  { token, password }
router.post("/auth/reset", async (req, res) => {
  try {
    const token = String(req.body.token || "");
    const password = String(req.body.password || "");

    if (!token) return res.status(400).json({ success: false, message: "Invalid or expired reset link." });
    if (password.length < 4) {
      return res.status(400).json({ success: false, message: "Password must be at least 4 characters." });
    }

    const account = await Account.findOne({
      resetTokenHash: sha256(token),
      resetTokenExpires: { $gt: new Date() }
    });
    if (!account) {
      return res.status(400).json({ success: false, message: "This reset link is invalid or has expired. Please request a new one." });
    }

    account.password = await bcrypt.hash(password, 10);
    account.resetTokenHash = null;
    account.resetTokenExpires = null;
    await account.save();

    return res.json({ success: true, message: "Password updated successfully. Please log in." });
  } catch (err) {
    console.error("Reset password error:", err.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

// ---------------------------------------------------------------------------
// Extra: logout + current user
// ---------------------------------------------------------------------------
router.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

router.get("/auth/me", async (req, res) => {
  try {
    if (!req.session || !req.session.user) return res.status(401).json({ success: false });
    const uid = req.session.user.id || req.session.user._id;
    if (uid) {
      const account = await Account.findById(uid).select("-password -resetTokenHash -resetTokenExpires");
      if (!account) return res.status(401).json({ success: false });
      req.session.user = publicUser(account);
    }
    return res.json({ success: true, user: req.session.user });
  } catch (err) {
    return res.json({ success: true, user: req.session.user });
  }
});

module.exports = router;