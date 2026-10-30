const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const Account = require("../models/Account");

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const publicUser = (a) => ({
  id: a._id,
  name: a.name,
  email: a.email,
  avatar: a.avatar || ""
});

// session e user rekhe dei (app.js e express-session already ache)
function startSession(req, account) {
  return new Promise((resolve, reject) => {
    req.session.user = publicUser(account);
    req.session.save((err) => (err ? reject(err) : resolve()));
  });
}

// ---------------------------------------------------------------------------
// POST /register  { name, email, password }
// ---------------------------------------------------------------------------
router.post("/register", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (name.length < 2) {
      return res.status(400).json({ success: false, message: "Please enter your full name." });
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
          ? "This email is registered with Google. Please use Google login."
          : "This email is already registered. Please log in.";
      return res.status(409).json({ success: false, message: msg });
    }

    const hash = await bcrypt.hash(password, 10);
    await Account.create({ name, email, password: hash, provider: "local" });

    return res.status(201).json({ success: true, message: "Registration successful!" });
  } catch (err) {
    console.error("Register error:", err);
    if (err && err.code === 11000) {
      return res.status(409).json({ success: false, message: "This email is already registered." });
    }
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
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
const RESET_MINUTES = 30;
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");

function getTransport() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT || 465),
    secure: String(process.env.EMAIL_PORT || 465) === "465",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
}

// POST /auth/forgot  { email }
router.post("/auth/forgot", async (req, res) => {
  // Email royeche kina ta bole dei na (account enumeration thekate), shobsomoy same reply
  const generic = {
    success: true,
    message: "If this email is registered, a reset link has been sent. Please check your inbox (and spam folder)."
  };

  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }

    const account = await Account.findOne({ email });
    if (!account) return res.json(generic);

    const token = crypto.randomBytes(32).toString("hex");
    account.resetTokenHash = sha256(token);
    account.resetTokenExpires = new Date(Date.now() + RESET_MINUTES * 60 * 1000);
    await account.save();

    const base = (process.env.APP_URL || `${req.protocol}://${req.get("host")}`).replace(/\/+$/, "");
    const link = `${base}/forgot?token=${token}`;

    const transport = getTransport();
    if (!transport) {
      // Email setup na thakle local test er jonno link ta terminal e dekhay
      console.log("\n[DEV] Email not configured. Reset link for", email, "=>", link, "\n");
      return res.json(generic);
    }

    await transport.sendMail({
      from: `"IELTS Mockpoint" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your IELTS Mockpoint password",
      text:
        `Hi ${account.name},\n\nWe received a request to reset your password.\n` +
        `Open this link to choose a new one (valid for ${RESET_MINUTES} minutes):\n${link}\n\n` +
        `If you didn't ask for this, you can ignore this email.`,
      html:
        `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#0f2038">` +
        `<h2 style="color:#0b2b52">Reset your password</h2>` +
        `<p>Hi ${String(account.name).replace(/[<>&]/g, "")},</p>` +
        `<p>We received a request to reset your IELTS Mockpoint password. This link is valid for ${RESET_MINUTES} minutes.</p>` +
        `<p><a href="${link}" style="display:inline-block;background:#e0202d;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:bold">Reset Password</a></p>` +
        `<p style="font-size:13px;color:#5d708c">If the button doesn't work, copy this link:<br>${link}</p>` +
        `<p style="font-size:13px;color:#5d708c">If you didn't request this, you can safely ignore this email.</p></div>`
    });

    return res.json(generic);
  } catch (err) {
    console.error("Forgot password error:", err.message);
    return res.status(500).json({ success: false, message: "Could not send the email. Please try again later." });
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

router.get("/auth/me", (req, res) => {
  if (req.session && req.session.user) return res.json({ success: true, user: req.session.user });
  return res.status(401).json({ success: false });
});

module.exports = router;