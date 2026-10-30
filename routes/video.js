

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const User = require("../models/User")
const TestQuestions = require("../models/testQuestion");
const { loginUser } = require("../controllers/authController");
const adminAuth = require("../middleware/adminAuthMiddleware");
const { route } = require("./auth");
const { config, env } = require("process");
require("dotenv").config();

// Helper function: root path theke video file khuje ber kora
function getVideoFilePath(filename) {
  // 1. Jodi process.env.ROOT_PATH valid hoy ebong file thake
  if (process.env.ROOT_PATH) {
    const envPath = path.join(process.env.ROOT_PATH, "videos", filename);
    if (fs.existsSync(envPath)) {
      return envPath;
    }
  }

  // 2. Dynamic fallback: current directory theke root directory-r videos folder
  const localPath = path.join(__dirname, "..", "videos", filename);
  if (fs.existsSync(localPath)) {
    return localPath;
  }

  // 3. Fallback direct root check
  return path.join(process.cwd(), "videos", filename);
}

// 1. Listening Instruction Video
router.get("/listening", (req, res) => {
  const filePath = getVideoFilePath("WhatsApp Video 2025-05-05 at 5.02.30 PM.mp4");
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.error("Listening video not found at:", filePath);
    res.status(404).send("Listening video not found");
  }
});

// 2. Reading Instruction Video
router.get("/reading", (req, res) => {
  const filePath = getVideoFilePath("reading.mp4");
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.error("Reading video not found at:", filePath);
    res.status(404).send("Reading video not found");
  }
});

// 3. Writing Instruction Video
router.get("/writing", (req, res) => {
  const filePath = getVideoFilePath("writing.mp4");
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.error("Writing video not found at:", filePath);
    res.status(404).send("Writing video not found");
  }
});

module.exports = router;