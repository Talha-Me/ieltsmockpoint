

// const express = require("express");
// const router = express.Router();
// const path = require("path");
// const mongoose = require("mongoose");
// const User = require("../FrontPage/Backend/models/User");
// const TestQuestions = require("../models/testQuestion");
// const AdminNotifs = require("../models/notification_for_admin");
// const SpeakingBookings = require("../models/speaking_slots");

// const listeningPractice = require("../models/listeningPractice");
// const readingPractice = require("../models/readingPractice");
// const writingPractice = require("../models/writingPractice");
// const SystemSettings = require("../models/SystemSettings");
// const StudentTestRecord = require("../models/StudentTestRecord");
// const Account = require("../models/Account");

// // ==========================================
// // ১. ইমেজ রাউটস
// // ==========================================
// router.get("/image/premium-map-1-00", (req, res) => {
//   res.sendFile(path.join(__dirname, "../premium-images/premium-map-1.png"));
// });

// router.get("/image/premium-writing-1-00", (req, res) => {
//   res.sendFile(path.join(__dirname, "../premium-images/premium-writing-1.png"));
// });

// router.get("/image/premium-writing-2-00", (req, res) => {
//   res.sendFile(path.join(__dirname, "../premium-images/premium-writing-2.png"));
// });

// // ==========================================
// // ২. লগইন করা ইউজারের ইনফরমেশন ফেচ
// // ==========================================
// router.get("/user-data", async (req, res) => {
//   const sessionUser = req.session.user || req.session.candidate;

//   if (!sessionUser) {
//     return res.status(401).json({ message: "Unauthorized. Please login." });
//   }

//   try {
//     const user = await User.findOne({ email: sessionUser.email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({
//       username: user.username,
//       email: user.email,
//       mockInformation: user.mockInformation || []
//     });
//   } catch (err) {
//     console.error("Error fetching user data:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ==========================================
// // ৩. ফুল মক টেস্ট ডেটা ফেচ
// // ==========================================
// router.get("/mockTest", (req, res) => {
//   if (req.session && req.session.mock) {
//     return res.json({
//       mockNumber: req.session.mock.mockNumber,
//       plan: req.session.mock.plan || "Free",
//       listening: req.session.mock.listening,
//       reading: req.session.mock.reading,
//       writing: req.session.mock.writing,
//     });
//   }
//   res.status(400).json({ error: "No active mock test in session" });
// });

// router.get("/getListeningData", (req, res) => {
//   if (req.session && req.session.mock && req.session.mock.listening) {
//     return res.json(req.session.mock.listening);
//   }
//   res.status(400).json({ error: "No mock listening session found" });
// });

// router.get("/getReadingData", (req, res) => {
//   if (req.session && req.session.mock && req.session.mock.reading) {
//     return res.json(req.session.mock.reading);
//   }
//   res.status(400).json({ error: "No mock reading session found" });
// });

// router.get("/getWritingData", (req, res) => {
//   if (req.session && req.session.mock && req.session.mock.writing) {
//     return res.json(req.session.mock.writing);
//   }
//   res.status(400).json({ error: "No mock writing session found" });
// });

// // ==========================================
// // ৪. এক্সাম সাবমিশন ও রেজাল্ট প্রসেসিং
// // ==========================================
// router.post("/update-mock-info", async (req, res) => {
//   try {
//     const { score, mistakes, mod, writingInputs } = req.body;
//     const sessionUser = req.session.user || req.session.candidate;

//     if (!mod) {
//       return res.status(400).json({ error: "Module type is required" });
//     }

//     const currentMockId = req.session.mock ? req.session.mock.mockNumber : "Free-Mock";

//     if (!req.session.examResults) {
//       req.session.examResults = {};
//     }

//     if (mod === "listening") {
//       req.session.examResults.listening = { score, mistakes };
//     } else if (mod === "reading") {
//       req.session.examResults.reading = { score, mistakes };
//     } else if (mod === "writing") {
//       req.session.examResults.writing = { writingInputs };
//     }

//     if (sessionUser && sessionUser.email && currentMockId) {
//       try {
//         const user = await User.findOne({ email: sessionUser.email });

//         if (user) {
//           if (!Array.isArray(user.mockInformation)) {
//             user.mockInformation = [];
//           }

//           let mockRecord = user.mockInformation.find((obj) => obj.mockID === currentMockId);

//           if (!mockRecord) {
//             mockRecord = { mockID: currentMockId };
//             user.mockInformation.push(mockRecord);
//           }

//           if (mod === "listening") {
//             mockRecord.listening = { score, mistakes };
//           } else if (mod === "reading") {
//             mockRecord.reading = { score, mistakes };
//           } else if (mod === "writing") {
//             mockRecord.writing = { writingInputs };
//             mockRecord.completed = true;

//             if (typeof AdminNotifs !== "undefined") {
//               const newNotif = new AdminNotifs({
//                 username: user.username,
//                 mockNumber: currentMockId,
//                 time: new Date(),
//               });
//               await newNotif.save();
//             }
//           }

//           user.markModified("mockInformation");
//           await user.save();
//         }
//       } catch (err) {
//         console.error("Error saving mock info to database:", err);
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       module: mod,
//       score: score !== undefined ? score : null,
//       mistakes: mistakes || [],
//       writingInputs: writingInputs || null,
//       message: "Submission successful"
//     });
//   } catch (error) {
//     console.error("Critical error in update-mock-info:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // ==========================================
// // ৫. অ্যাডমিন ভিউ ও ম্যানেজমেন্ট রাউটস
// // ==========================================
// router.get("/user-information-for-admin", (req, res) => {
//   if (req.session.user) {
//     res.json({
//       username: req.session.user.username,
//       email: req.session.user.email,
//       mockInformation: req.session.user.mockInformation,
//     });
//   } else {
//     res.status(401).send("Unauthorized");
//   }
// });

// router.get("/user-information-for-admin-better", async (req, res) => {
//   const { email } = req.query;
//   try {
//     const user = await User.findOne({ email: email });
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.json({
//       username: user.username,
//       email: user.email,
//       mockInformation: user.mockInformation,
//     });
//   } catch (err) {
//     res.status(500).send("Server error");
//   }
// });

// router.get("/notification-information-for-admin", async (req, res) => {
//   try {
//     const notifications = await AdminNotifs.find({});
//     res.json(notifications);
//   } catch (error) {
//     console.error("Error fetching Notifications:", error);
//     res.status(500).send("Error fetching notifications");
//   }
// });

// // ==========================================
// // ৬. স্পিকিং টেস্ট বুকিং
// // ==========================================
// router.post("/add-speaking-test-booking", async (req, res) => {
//   const { username, plan, email, bookingsLeft, speaking_dates } = req.body;
//   if (!username || !email || !speaking_dates) {
//     return res.status(400).send("Missing required fields");
//   }

//   try {
//     const newBooker = new SpeakingBookings({
//       username,
//       plan: plan || "Free",
//       email,
//       bookingsLeft,
//       speaking_dates,
//     });
//     await newBooker.save();
//     res.status(200).send("Booking created successfully");
//   } catch (err) {
//     res.status(500).send("Error adding booking: " + err.message);
//   }
// });

// router.post("/update-speaking-test-booking", async (req, res) => {
//   const { email, bookingsLeft, speaking_dates } = req.body;
//   try {
//     const user = await SpeakingBookings.findOne({ email: email });
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     user.bookingsLeft = bookingsLeft;
//     if (speaking_dates && speaking_dates.length > 0) {
//       user.speaking_dates.push({
//         testId: speaking_dates[0].testId,
//         date: speaking_dates[0].date,
//         time: speaking_dates[0].time,
//         completed: speaking_dates[0].completed,
//       });
//       user.markModified("speaking_dates");
//     }
//     await user.save();
//     res.status(200).send("Booking updated");
//   } catch (err) {
//     console.error("Error updating booking:", err);
//     res.status(500).send("Update failed");
//   }
// });

// router.get("/speaking-booking-data", async (req, res) => {
//   try {
//     const data = await SpeakingBookings.find();
//     res.json(data);
//   } catch (err) {
//     res.status(500).send("Error fetching speaking data");
//   }
// });

// // ==========================================
// // ৭. প্র্যাকটিস হাব ও ক্যামব্রিজ ডেটা রাউটস (EXACT MATCH FOR testNo & cambridge_*)
// // ==========================================
// router.get("/pracDataListening", async (req, res) => {
//   try {
//     const type = req.query.type || (req.session && req.session.type);
//     const pracNumber = req.query.pracNumber || (req.session && req.session.pracNumber);
//     const book = req.query.book || (req.session && req.session.book);
//     const test = req.query.test || (req.session && req.session.test);

//     // ১. ক্যামব্রিজ টেস্ট কুয়েরি (?book=12&test=1)
//     if (book && test) {
//       const db = mongoose.connection.db;
//       const bNum = isNaN(book) ? book : Number(book);
//       const tNum = isNaN(test) ? test : Number(test);

//       // সরাসরি cambridge_listening কালেকশন সার্চ (book এবং testNo ম্যাচ)
//       const cDoc = await db.collection("cambridge_listening").findOne({
//         $or: [
//           { book: bNum, testNo: tNum },
//           { book: String(book), testNo: String(test) },
//           { book: bNum, test: tNum },
//           { bookNumber: bNum, testNumber: tNum },
//           { bookNumber: String(book), testNumber: String(test) }
//         ]
//       });

//       if (cDoc) {
//         // ফ্রন্টএন্ড স্ক্রিপ্ট যাতে listening.questions পায় তাই ফরম্যাট নিশ্চিত করা
//         const responseData = {
//           ...cDoc,
//           type: cDoc.title || `Cambridge ${book} Test ${test}`,
//           listening: {
//             questions: cDoc.questions || [],
//             instructions: cDoc.instructions || [],
//             answers: cDoc.answers || {},
//             answerExplanations: cDoc.answerExplanations || {},
//             audioUrl: cDoc.audioUrl || "",
//             audio: cDoc.audioUrl || "",
//             partAudios: cDoc.partAudios || {}
//           }
//         };
//         return res.json(responseData);
//       }
//     }

//     // ২. সেশনে আগে থেকে থাকলে
//     if (req.session && req.session.pracListening) {
//       return res.json(req.session.pracListening);
//     }

//     // ৩. রেগুলার টপিক প্র্যাকটিস কুয়েরি
//     if (type && pracNumber) {
//       const ListeningModel = typeof listeningPractice !== "undefined" && listeningPractice
//         ? listeningPractice
//         : mongoose.model("Listening-Practice", new mongoose.Schema({}, { strict: false }), "listening-practices");

//       const dbDoc = await ListeningModel.findOne({ type, pracNumber });
//       if (dbDoc) return res.json(dbDoc);
//     }

//     res.status(404).json({ error: "No practice listening data found" });
//   } catch (err) {
//     console.error("pracDataListening error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// router.get("/pracDataReading", async (req, res) => {
//   try {
//     const type = req.query.type || (req.session && req.session.type);
//     const pracNumber = req.query.pracNumber || (req.session && req.session.pracNumber);
//     const book = req.query.book || (req.session && req.session.book);
//     const test = req.query.test || (req.session && req.session.test);

//     // ১. ক্যামব্রিজ টেস্ট কুয়েরি
//     if (book && test) {
//       const db = mongoose.connection.db;
//       const bNum = isNaN(book) ? book : Number(book);
//       const tNum = isNaN(test) ? test : Number(test);

//       const cDoc = await db.collection("cambridge_reading").findOne({
//         $or: [
//           { book: bNum, testNo: tNum },
//           { book: String(book), testNo: String(test) },
//           { book: bNum, test: tNum },
//           { bookNumber: bNum, testNumber: tNum },
//           { bookNumber: String(book), testNumber: String(test) }
//         ]
//       });

//       if (cDoc) {
//         const responseData = {
//           ...cDoc,
//           type: cDoc.title || `Cambridge ${book} Reading Test ${test}`,
//           reading: {
//             passages: cDoc.passages || [],
//             questions: cDoc.questions || [],
//             instructions: cDoc.instructions || [],
//             answers: cDoc.answers || {},
//             answerExplanations: cDoc.answerExplanations || {}
//           }
//         };
//         return res.json(responseData);
//       }
//     }

//     if (req.session && req.session.pracReading) {
//       return res.json(req.session.pracReading);
//     }

//     if (type && pracNumber) {
//       const dbDoc = await readingPractice.findOne({ type, pracNumber });
//       if (dbDoc) return res.json(dbDoc);
//     }

//     res.status(404).json({ error: "No practice reading data found" });
//   } catch (err) {
//     console.error("pracDataReading error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// router.get("/pracDataWriting", async (req, res) => {
//   try {
//     const type = req.query.type || (req.session && req.session.type);
//     const pracNumber = req.query.pracNumber || (req.session && req.session.pracNumber);
//     const book = req.query.book || (req.session && req.session.book);
//     const test = req.query.test || (req.session && req.session.test);

//     if (book && test) {
//       const db = mongoose.connection.db;
//       const bNum = isNaN(book) ? book : Number(book);
//       const tNum = isNaN(test) ? test : Number(test);

//       const cDoc = await db.collection("cambridgewritings").findOne({
//         $or: [
//           { book: bNum, testNo: tNum },
//           { book: String(book), testNo: String(test) },
//           { book: bNum, test: tNum },
//           { bookNumber: bNum, testNumber: tNum }
//         ]
//       });

//       if (cDoc) return res.json(cDoc);
//     }

//     if (req.session && req.session.pracWriting) {
//       return res.json(req.session.pracWriting);
//     }

//     const WritingModel = typeof writingPractice !== "undefined" && writingPractice
//       ? writingPractice
//       : mongoose.model("Writing-Practice", new mongoose.Schema({}, { strict: false }), "writing-practices");

//     if (type && pracNumber) {
//       const dbDoc = await WritingModel.findOne({ type, pracNumber });
//       if (dbDoc) return res.json(dbDoc);
//     }

//     res.status(404).json({ error: "No practice writing data found" });
//   } catch (err) {
//     console.error("pracDataWriting error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// 
// const express = require("express");
// const router = express.Router();
// const path = require("path");
// const mongoose = require("mongoose");
// const User = require("../FrontPage/Backend/models/User");
// const TestQuestions = require("../models/testQuestion");
// const AdminNotifs = require("../models/notification_for_admin");
// const SpeakingBookings = require("../models/speaking_slots");

// const listeningPractice = require("../models/listeningPractice");
// const readingPractice = require("../models/readingPractice");
// const writingPractice = require("../models/writingPractice");
// const Account = require("../models/Account");

// // ==========================================
// // ১. ইমেজ রাউটস
// // ==========================================
// router.get("/image/premium-map-1-00", (req, res) => {
//   res.sendFile(path.join(__dirname, "../premium-images/premium-map-1.png"));
// });

// router.get("/image/premium-writing-1-00", (req, res) => {
//   res.sendFile(path.join(__dirname, "../premium-images/premium-writing-1.png"));
// });

// router.get("/image/premium-writing-2-00", (req, res) => {
//   res.sendFile(path.join(__dirname, "../premium-images/premium-writing-2.png"));
// });

// // ==========================================
// // ২. লগইন করা ইউজারের ইনফরমেশন ফেচ
// // ==========================================
// router.get("/user-data", async (req, res) => {
//   const sessionUser = req.session.user || req.session.candidate;

//   if (!sessionUser) {
//     return res.status(401).json({ message: "Unauthorized. Please login." });
//   }

//   try {
//     const user = await User.findOne({ email: sessionUser.email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({
//       username: user.username,
//       email: user.email,
//       mockInformation: user.mockInformation || []
//     });
//   } catch (err) {
//     console.error("Error fetching user data:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ==========================================
// // ৩. ফুল মক টেস্ট ডেটা ফেচ
// // ==========================================
// router.get("/mockTest", (req, res) => {
//   if (req.session && req.session.mock) {
//     return res.json({
//       mockNumber: req.session.mock.mockNumber,
//       plan: req.session.mock.plan || "Free",
//       listening: req.session.mock.listening,
//       reading: req.session.mock.reading,
//       writing: req.session.mock.writing,
//     });
//   }
//   res.status(400).json({ error: "No active mock test in session" });
// });

// router.get("/getListeningData", (req, res) => {
//   if (req.session && req.session.mock && req.session.mock.listening) {
//     return res.json(req.session.mock.listening);
//   }
//   res.status(400).json({ error: "No mock listening session found" });
// });

// router.get("/getReadingData", (req, res) => {
//   if (req.session && req.session.mock && req.session.mock.reading) {
//     return res.json(req.session.mock.reading);
//   }
//   res.status(400).json({ error: "No mock reading session found" });
// });

// router.get("/getWritingData", (req, res) => {
//   if (req.session && req.session.mock && req.session.mock.writing) {
//     return res.json(req.session.mock.writing);
//   }
//   res.status(400).json({ error: "No mock writing session found" });
// });

// // ==========================================
// // ৪. এক্সাম সাবমিশন ও রেজাল্ট প্রসেসিং
// // ==========================================
// router.post("/update-mock-info", async (req, res) => {
//   try {
//     const { score, mistakes, mod, writingInputs } = req.body;
//     const sessionUser = req.session.user || req.session.candidate;

//     if (!mod) {
//       return res.status(400).json({ error: "Module type is required" });
//     }

//     const currentMockId = req.session.mock ? req.session.mock.mockNumber : "Free-Mock";

//     if (!req.session.examResults) {
//       req.session.examResults = {};
//     }

//     if (mod === "listening") {
//       req.session.examResults.listening = { score, mistakes };
//     } else if (mod === "reading") {
//       req.session.examResults.reading = { score, mistakes };
//     } else if (mod === "writing") {
//       req.session.examResults.writing = { writingInputs };
//     }

//     if (sessionUser && sessionUser.email && currentMockId) {
//       try {
//         const user = await User.findOne({ email: sessionUser.email });

//         if (user) {
//           if (!Array.isArray(user.mockInformation)) {
//             user.mockInformation = [];
//           }

//           let mockRecord = user.mockInformation.find((obj) => obj.mockID === currentMockId);

//           if (!mockRecord) {
//             mockRecord = { mockID: currentMockId };
//             user.mockInformation.push(mockRecord);
//           }

//           if (mod === "listening") {
//             mockRecord.listening = { score, mistakes };
//           } else if (mod === "reading") {
//             mockRecord.reading = { score, mistakes };
//           } else if (mod === "writing") {
//             mockRecord.writing = { writingInputs };
//             mockRecord.completed = true;

//             if (typeof AdminNotifs !== "undefined") {
//               const newNotif = new AdminNotifs({
//                 username: user.username,
//                 mockNumber: currentMockId,
//                 time: new Date(),
//               });
//               await newNotif.save();
//             }
//           }

//           user.markModified("mockInformation");
//           await user.save();
//         }
//       } catch (err) {
//         console.error("Error saving mock info to database:", err);
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       module: mod,
//       score: score !== undefined ? score : null,
//       mistakes: mistakes || [],
//       writingInputs: writingInputs || null,
//       message: "Submission successful"
//     });
//   } catch (error) {
//     console.error("Critical error in update-mock-info:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // ==========================================
// // ৫. অ্যাডমিন ভিউ ও ম্যানেজমেন্ট রাউটস
// // ==========================================
// router.get("/user-information-for-admin", (req, res) => {
//   if (req.session.user) {
//     res.json({
//       username: req.session.user.username,
//       email: req.session.user.email,
//       mockInformation: req.session.user.mockInformation,
//     });
//   } else {
//     res.status(401).send("Unauthorized");
//   }
// });

// router.get("/user-information-for-admin-better", async (req, res) => {
//   const { email } = req.query;
//   try {
//     const user = await User.findOne({ email: email });
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.json({
//       username: user.username,
//       email: user.email,
//       mockInformation: user.mockInformation,
//     });
//   } catch (err) {
//     res.status(500).send("Server error");
//   }
// });

// router.get("/notification-information-for-admin", async (req, res) => {
//   try {
//     const notifications = await AdminNotifs.find({});
//     res.json(notifications);
//   } catch (error) {
//     console.error("Error fetching Notifications:", error);
//     res.status(500).send("Error fetching notifications");
//   }
// });

// // ==========================================
// // ৬. স্পিকিং টেস্ট বুকিং
// // ==========================================
// router.post("/add-speaking-test-booking", async (req, res) => {
//   const { username, plan, email, bookingsLeft, speaking_dates } = req.body;
//   if (!username || !email || !speaking_dates) {
//     return res.status(400).send("Missing required fields");
//   }

//   try {
//     const newBooker = new SpeakingBookings({
//       username,
//       plan: plan || "Free",
//       email,
//       bookingsLeft,
//       speaking_dates,
//     });
//     await newBooker.save();
//     res.status(200).send("Booking created successfully");
//   } catch (err) {
//     res.status(500).send("Error adding booking: " + err.message);
//   }
// });

// router.post("/update-speaking-test-booking", async (req, res) => {
//   const { email, bookingsLeft, speaking_dates } = req.body;
//   try {
//     const user = await SpeakingBookings.findOne({ email: email });
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     user.bookingsLeft = bookingsLeft;
//     if (speaking_dates && speaking_dates.length > 0) {
//       user.speaking_dates.push({
//         testId: speaking_dates[0].testId,
//         date: speaking_dates[0].date,
//         time: speaking_dates[0].time,
//         completed: speaking_dates[0].completed,
//       });
//       user.markModified("speaking_dates");
//     }
//     await user.save();
//     res.status(200).send("Booking updated");
//   } catch (err) {
//     console.error("Error updating booking:", err);
//     res.status(500).send("Update failed");
//   }
// });

// router.get("/speaking-booking-data", async (req, res) => {
//   try {
//     const data = await SpeakingBookings.find();
//     res.json(data);
//   } catch (err) {
//     res.status(500).send("Error fetching speaking data");
//   }
// });

// // ==========================================
// // ৭. প্র্যাকটিস হাব ও ক্যামব্রিজ ডেটা রাউটস (EXACT MATCH FOR testNo & cambridge_*)
// // ==========================================
// router.get("/pracDataListening", async (req, res) => {
//   try {
//     const type = req.query.type || (req.session && req.session.type);
//     const pracNumber = req.query.pracNumber || (req.session && req.session.pracNumber);
//     const book = req.query.book || (req.session && req.session.book);
//     const test = req.query.test || (req.session && req.session.test);

//     // ১. ক্যামব্রিজ টেস্ট কুয়েরি (?book=12&test=1)
//     if (book && test) {
//       const db = mongoose.connection.db;
//       const bNum = isNaN(book) ? book : Number(book);
//       const tNum = isNaN(test) ? test : Number(test);

//       // সরাসরি cambridge_listening কালেকশন সার্চ (book এবং testNo ম্যাচ)
//       const cDoc = await db.collection("cambridge_listening").findOne({
//         $or: [
//           { book: bNum, testNo: tNum },
//           { book: String(book), testNo: String(test) },
//           { book: bNum, test: tNum },
//           { bookNumber: bNum, testNumber: tNum },
//           { bookNumber: String(book), testNumber: String(test) }
//         ]
//       });

//       if (cDoc) {
//         // ফ্রন্টএন্ড স্ক্রিপ্ট যাতে listening.questions পায় তাই ফরম্যাট নিশ্চিত করা
//         const responseData = {
//           ...cDoc,
//           type: cDoc.title || `Cambridge ${book} Test ${test}`,
//           listening: {
//             questions: cDoc.questions || [],
//             instructions: cDoc.instructions || [],
//             answers: cDoc.answers || {},
//             answerExplanations: cDoc.answerExplanations || {},
//             audioUrl: cDoc.audioUrl || "",
//             audio: cDoc.audioUrl || "",
//             partAudios: cDoc.partAudios || {}
//           }
//         };
//         return res.json(responseData);
//       }
//     }

//     // ২. সেশনে আগে থেকে থাকলে
//     if (req.session && req.session.pracListening) {
//       return res.json(req.session.pracListening);
//     }

//     // ৩. রেগুলার টপিক প্র্যাকটিস কুয়েরি
//     if (type && pracNumber) {
//       const ListeningModel = typeof listeningPractice !== "undefined" && listeningPractice
//         ? listeningPractice
//         : mongoose.model("Listening-Practice", new mongoose.Schema({}, { strict: false }), "listening-practices");

//       const dbDoc = await ListeningModel.findOne({ type, pracNumber });
//       if (dbDoc) return res.json(dbDoc);
//     }

//     res.status(404).json({ error: "No practice listening data found" });
//   } catch (err) {
//     console.error("pracDataListening error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// router.get("/pracDataReading", async (req, res) => {
//   try {
//     const type = req.query.type || (req.session && req.session.type);
//     const pracNumber = req.query.pracNumber || (req.session && req.session.pracNumber);
//     const book = req.query.book || (req.session && req.session.book);
//     const test = req.query.test || (req.session && req.session.test);

//     // ১. ক্যামব্রিজ টেস্ট কুয়েরি
//     if (book && test) {
//       const db = mongoose.connection.db;
//       const bNum = isNaN(book) ? book : Number(book);
//       const tNum = isNaN(test) ? test : Number(test);

//       const cDoc = await db.collection("cambridge_reading").findOne({
//         $or: [
//           { book: bNum, testNo: tNum },
//           { book: String(book), testNo: String(test) },
//           { book: bNum, test: tNum },
//           { bookNumber: bNum, testNumber: tNum },
//           { bookNumber: String(book), testNumber: String(test) }
//         ]
//       });

//       if (cDoc) {
//         const responseData = {
//           ...cDoc,
//           type: cDoc.title || `Cambridge ${book} Reading Test ${test}`,
//           reading: {
//             passages: cDoc.passages || [],
//             questions: cDoc.questions || [],
//             instructions: cDoc.instructions || [],
//             answers: cDoc.answers || {},
//             answerExplanations: cDoc.answerExplanations || {}
//           }
//         };
//         return res.json(responseData);
//       }
//     }

//     if (req.session && req.session.pracReading) {
//       return res.json(req.session.pracReading);
//     }

//     if (type && pracNumber) {
//       const dbDoc = await readingPractice.findOne({ type, pracNumber });
//       if (dbDoc) return res.json(dbDoc);
//     }

//     res.status(404).json({ error: "No practice reading data found" });
//   } catch (err) {
//     console.error("pracDataReading error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// router.get("/pracDataWriting", async (req, res) => {
//   try {
//     const type = req.query.type || (req.session && req.session.type);
//     const pracNumber = req.query.pracNumber || (req.session && req.session.pracNumber);
//     const book = req.query.book || (req.session && req.session.book);
//     const test = req.query.test || (req.session && req.session.test);

//     if (book && test) {
//       const db = mongoose.connection.db;
//       const bNum = isNaN(book) ? book : Number(book);
//       const tNum = isNaN(test) ? test : Number(test);

//       const cDoc = await db.collection("cambridgewritings").findOne({
//         $or: [
//           { book: bNum, testNo: tNum },
//           { book: String(book), testNo: String(test) },
//           { book: bNum, test: tNum },
//           { bookNumber: bNum, testNumber: tNum }
//         ]
//       });

//       if (cDoc) return res.json(cDoc);
//     }

//     if (req.session && req.session.pracWriting) {
//       return res.json(req.session.pracWriting);
//     }

//     const WritingModel = typeof writingPractice !== "undefined" && writingPractice
//       ? writingPractice
//       : mongoose.model("Writing-Practice", new mongoose.Schema({}, { strict: false }), "writing-practices");

//     if (type && pracNumber) {
//       const dbDoc = await WritingModel.findOne({ type, pracNumber });
//       if (dbDoc) return res.json(dbDoc);
//     }

//     res.status(404).json({ error: "No practice writing data found" });
//   } catch (err) {
//     console.error("pracDataWriting error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// 
// ==========================================
// SYSTEM SETTINGS & ACCESS CONTROL PHASES
// ==========================================
// router.get("/system-settings", async (req, res) => {
//   try {
//     let settings = await SystemSettings.findOne({ key: "global_config" });
//     if (!settings) {
//       settings = await SystemSettings.create({
//         key: "global_config",
//         currentPhase: 1,
//         freeFullMocksCount: 1,
//         freePartsPerTest: 1,
//         freeQuestionTypesPerTest: 1,
//         freePracticeHubSets: 3,
//         freeAiWritingPerDay: 1,
//         loginReminderEnabled: true,
//         cambridgeAlwaysFree: true
//       });
//     }
//     return res.json({ success: true, settings });
//   } catch (err) {
//     console.error("Error fetching system settings:", err);
//     return res.status(500).json({ error: "Failed to fetch settings" });
//   }
// });

// router.post("/admin/system-settings", async (req, res) => {
//   try {
//     const {
//       currentPhase,
//       freeFullMocksCount,
//       freePartsPerTest,
//       freeQuestionTypesPerTest,
//       freePracticeHubSets,
//       freeAiWritingPerDay,
//       loginReminderEnabled,
//       cambridgeAlwaysFree
//     } = req.body;

//     let settings = await SystemSettings.findOne({ key: "global_config" });
//     if (!settings) {
//       settings = new SystemSettings({ key: "global_config" });
//     }

//     if (currentPhase !== undefined) settings.currentPhase = Number(currentPhase);
//     if (freeFullMocksCount !== undefined) settings.freeFullMocksCount = Number(freeFullMocksCount);
//     if (freePartsPerTest !== undefined) settings.freePartsPerTest = Number(freePartsPerTest);
//     if (freeQuestionTypesPerTest !== undefined) settings.freeQuestionTypesPerTest = Number(freeQuestionTypesPerTest);
//     if (freePracticeHubSets !== undefined) settings.freePracticeHubSets = Number(freePracticeHubSets);
//     if (freeAiWritingPerDay !== undefined) settings.freeAiWritingPerDay = Number(freeAiWritingPerDay);
//     if (loginReminderEnabled !== undefined) settings.loginReminderEnabled = Boolean(loginReminderEnabled);
//     if (cambridgeAlwaysFree !== undefined) settings.cambridgeAlwaysFree = Boolean(cambridgeAlwaysFree);

//     await settings.save();
//     return res.json({ success: true, message: "System settings saved successfully!", settings });
//   } catch (err) {
//     console.error("Error updating system settings:", err);
//     return res.status(500).json({ error: "Failed to update settings" });
//   }
// });

// ==========================================
// STUDENT ADVANCED DASHBOARD APIS
// ==========================================
// router.get("/student/dashboard-data", async (req, res) => {
//   const sessionUser = req.session.user || req.session.candidate;
//   if (!sessionUser || !sessionUser.email) {
//     return res.status(401).json({ success: false, message: "Please log in to view dashboard" });
//   }

//   const userEmail = sessionUser.email.toLowerCase().trim();

//   try {
//     const records = await StudentTestRecord.find({ userEmail }).sort({ completedAt: -1 }).lean();
//     const userDoc = await User.findOne({ email: userEmail }).lean();
//     const accountDoc = await Account.findOne({ email: userEmail }).lean();

//     const allMocks = [];
//     if (userDoc && Array.isArray(userDoc.mockInformation)) {
//       userDoc.mockInformation.forEach((m, idx) => {
//         allMocks.push({
//           source: "mockInformation",
//           mockID: m.mockID || "Mock-" + (idx + 1),
//           listening: m.listening || null,
//           reading: m.reading || null,
//           writing: m.writing || null,
//           completed: m.completed || false,
//           date: m.date || userDoc.updatedAt || new Date()
//         });
//       });
//     }

//     const history = records.map(r => ({
//       id: r._id,
//       testType: r.testType,
//       testId: r.testId,
//       title: r.title,
//       listeningScore: r.listeningScore,
//       readingScore: r.readingScore,
//       writingScore: r.writingScore,
//       listeningBand: r.listeningBand,
//       readingBand: r.readingBand,
//       writingBand: r.writingBand,
//       overallBand: r.overallBand,
//       totalWords: r.totalWords,
//       completedAt: r.completedAt
//     }));

//     let lSum = 0, lCount = 0;
//     let rSum = 0, rCount = 0;
//     let wSum = 0, wCount = 0;

//     history.forEach(h => {
//       if (h.listeningBand) { lSum += h.listeningBand; lCount++; }
//       if (h.readingBand) { rSum += h.readingBand; rCount++; }
//       if (h.writingBand) { wSum += h.writingBand; wCount++; }
//     });

//     allMocks.forEach(m => {
//       if (m.listening && typeof m.listening.score === "number") {
//         const b = Math.min(9, Math.max(3, +(m.listening.score / 4.4).toFixed(1)));
//         lSum += b; lCount++;
//       }
//       if (m.reading && typeof m.reading.score === "number") {
//         const b = Math.min(9, Math.max(3, +(m.reading.score / 4.4).toFixed(1)));
//         rSum += b; rCount++;
//       }
//     });

//     const avgL = lCount > 0 ? +(lSum / lCount).toFixed(1) : 0;
//     const avgR = rCount > 0 ? +(rSum / rCount).toFixed(1) : 0;
//     const avgW = wCount > 0 ? +(wSum / wCount).toFixed(1) : 0;

//     const avgModules = [avgL, avgR, avgW].filter(x => x > 0);
//     let overallAvg = 0;
//     if (avgModules.length > 0) {
//       const rawAvg = avgModules.reduce((a, b) => a + b, 0) / avgModules.length;
//       const fl = Math.floor(rawAvg);
//       const rem = rawAvg - fl;
//       if (rem < 0.25) overallAvg = fl;
//       else if (rem < 0.75) overallAvg = fl + 0.5;
//       else overallAvg = fl + 1.0;
//     }

//     return res.json({
//       success: true,
//       user: {
//         name: accountDoc?.name || userDoc?.name || sessionUser.name || "Candidate",
//         email: userEmail,
//         avatar: accountDoc?.avatar || "",
//         targetBand: accountDoc?.targetBand || 7.5,
//         memberSince: accountDoc?.createdAt || userDoc?.createdAt || new Date()
//       },
//       stats: {
//         totalTestsTaken: history.length + allMocks.length,
//         avgListeningBand: avgL,
//         avgReadingBand: avgR,
//         avgWritingBand: avgW,
//         overallBand: overallAvg
//       },
//       history,
//       allMocks
//     });
//   } catch (err) {
//     console.error("Dashboard data error:", err);
//     return res.status(500).json({ error: "Failed to load dashboard data" });
//   }
// });

// router.post("/student/record-test", async (req, res) => {
//   const sessionUser = req.session.user || req.session.candidate;
//   if (!sessionUser || !sessionUser.email) {
//     return res.status(401).json({ success: false, message: "Please log in to record test" });
//   }

//   try {
//     const userEmail = sessionUser.email.toLowerCase().trim();
//     const {
//       testType,
//       testId,
//       title,
//       listeningScore,
//       readingScore,
//       writingScore,
//       listeningBand,
//       readingBand,
//       writingBand,
//       overallBand,
//       totalWords,
//       writingTask1Feedback,
//       writingTask2Feedback,
//       mistakes,
//       answers
//     } = req.body;

//     const record = await StudentTestRecord.create({
//       userEmail,
//       userId: sessionUser.id || null,
//       testType: testType || "full-mock",
//       testId: testId || "",
//       title: title || "IELTS Mock Test",
//       listeningScore: listeningScore !== undefined ? listeningScore : null,
//       readingScore: readingScore !== undefined ? readingScore : null,
//       writingScore: writingScore !== undefined ? writingScore : null,
//       listeningBand: listeningBand !== undefined ? listeningBand : null,
//       readingBand: readingBand !== undefined ? readingBand : null,
//       writingBand: writingBand !== undefined ? writingBand : null,
//       overallBand: overallBand !== undefined ? overallBand : null,
//       totalWords: totalWords !== undefined ? totalWords : null,
//       writingTask1Feedback: writingTask1Feedback || null,
//       writingTask2Feedback: writingTask2Feedback || null,
//       mistakes: mistakes || {},
//       answers: answers || {}
//     });

//     return res.json({ success: true, recordId: record._id });
//   } catch (err) {
//     console.error("Error recording test:", err);
//     return res.status(500).json({ error: "Failed to record test" });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();

const SystemSettings = require("../models/SystemSettings");
const StudentTestRecord = require("../models/StudentTestRecord");
const Account = require("../models/Account");

const path = require("path");
const mongoose = require("mongoose");
const User = require("../models/User")
const TestQuestions = require("../models/testQuestion");
const AdminNotifs = require("../models/notification_for_admin");
const SpeakingBookings = require("../models/speaking_slots");

const listeningPractice = require("../models/listeningPractice");
const readingPractice = require("../models/readingPractice");
const writingPractice = require("../models/writingPractice");

// ==========================================
// ১. ইমেজ রাউটস
// ==========================================
router.get("/image/premium-map-1-00", (req, res) => {
  res.sendFile(path.join(__dirname, "../premium-images/premium-map-1.png"));
});

router.get("/image/premium-writing-1-00", (req, res) => {
  res.sendFile(path.join(__dirname, "../premium-images/premium-writing-1.png"));
});

router.get("/image/premium-writing-2-00", (req, res) => {
  res.sendFile(path.join(__dirname, "../premium-images/premium-writing-2.png"));
});

// ==========================================
// ২. লগইন করা ইউজারের ইনফরমেশন ফেচ
// ==========================================
router.get("/user-data", async (req, res) => {
  const sessionUser = req.session.user || req.session.candidate;

  if (!sessionUser) {
    return res.status(401).json({ message: "Unauthorized. Please login." });
  }

  try {
    const user = await User.findOne({ email: sessionUser.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      email: user.email,
      mockInformation: user.mockInformation || []
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// ৩. ফুল মক টেস্ট ডেটা ফেচ (test-questions কালেকশন)
// ==========================================
router.get("/mockTest", (req, res) => {
  if (req.session && req.session.mock) {
    return res.json({
      mockNumber: req.session.mock.mockNumber,
      plan: req.session.mock.plan || "Free",
      listening: req.session.mock.listening,
      reading: req.session.mock.reading,
      writing: req.session.mock.writing,
    });
  }
  res.status(400).json({ error: "No active mock test in session" });
});

router.get("/getListeningData", (req, res) => {
  if (req.session && req.session.mock && req.session.mock.listening) {
    return res.json(req.session.mock.listening);
  }
  res.status(400).json({ error: "No mock listening session found" });
});

router.get("/getReadingData", (req, res) => {
  if (req.session && req.session.mock && req.session.mock.reading) {
    return res.json(req.session.mock.reading);
  }
  res.status(400).json({ error: "No mock reading session found" });
});

router.get("/getWritingData", (req, res) => {
  if (req.session && req.session.mock && req.session.mock.writing) {
    return res.json(req.session.mock.writing);
  }
  res.status(400).json({ error: "No mock writing session found" });
});

// ==========================================
// ৪. এক্সাম সাবমিশন ও রেজাল্ট প্রসেসিং
// ==========================================
router.post("/update-mock-info", async (req, res) => {
  try {
    const { score, mistakes, mod, writingInputs } = req.body;
    const sessionUser = req.session.user || req.session.candidate;

    if (!mod) {
      return res.status(400).json({ error: "Module type is required" });
    }

    const currentMockId = req.session.mock ? req.session.mock.mockNumber : "Free-Mock";

    if (!req.session.examResults) {
      req.session.examResults = {};
    }

    if (mod === "listening") {
      req.session.examResults.listening = { score, mistakes };
    } else if (mod === "reading") {
      req.session.examResults.reading = { score, mistakes };
    } else if (mod === "writing") {
      req.session.examResults.writing = { writingInputs };
    }

    if (sessionUser && sessionUser.email && currentMockId) {
      try {
        const user = await User.findOne({ email: sessionUser.email });

        if (user) {
          if (!Array.isArray(user.mockInformation)) {
            user.mockInformation = [];
          }

          let mockRecord = user.mockInformation.find((obj) => obj.mockID === currentMockId);

          if (!mockRecord) {
            mockRecord = { mockID: currentMockId };
            user.mockInformation.push(mockRecord);
          }

          if (mod === "listening") {
            mockRecord.listening = { score, mistakes };
          } else if (mod === "reading") {
            mockRecord.reading = { score, mistakes };
          } else if (mod === "writing") {
            mockRecord.writing = { writingInputs };
            mockRecord.completed = true;

            if (typeof AdminNotifs !== "undefined") {
              const newNotif = new AdminNotifs({
                username: user.username,
                mockNumber: currentMockId,
                time: new Date(),
              });
              await newNotif.save();
            }
          }

          user.markModified("mockInformation");
          await user.save();
        }

        // Also sync to StudentTestRecord for seamless dashboard tracking
        try {
          const userEmail = sessionUser.email.toLowerCase().trim();
          let record = await StudentTestRecord.findOne({ userEmail, testId: currentMockId });
          if (!record) {
            record = new StudentTestRecord({
              userEmail,
              userId: sessionUser.id || null,
              testType: "full-mock",
              testId: currentMockId,
              title: currentMockId.replace(/-UKA-FINAL-/i, " Mock Test ")
            });
          }
          if (mod === "listening" && score !== undefined) {
            record.listeningScore = score;
            const lB = Math.min(9, Math.max(2.5, +(score / 4.4).toFixed(1)));
            record.listeningBand = lB;
          } else if (mod === "reading" && score !== undefined) {
            record.readingScore = score;
            const rB = Math.min(9, Math.max(2.5, +(score / 4.4).toFixed(1)));
            record.readingBand = rB;
          }
          await record.save();
        } catch (recErr) {
          console.warn("StudentTestRecord sync notice:", recErr.message);
        }
      } catch (err) {
        console.error("Error saving mock info to database:", err);
      }
    }

    return res.status(200).json({
      success: true,
      module: mod,
      score: score !== undefined ? score : null,
      mistakes: mistakes || [],
      writingInputs: writingInputs || null,
      message: "Submission successful"
    });
  } catch (error) {
    console.error("Critical error in update-mock-info:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// ৫. অ্যাডমিন ভিউ ও ম্যানেজমেন্ট রাউটস
// ==========================================
router.get("/user-information-for-admin", (req, res) => {
  if (req.session.user) {
    res.json({
      username: req.session.user.username,
      email: req.session.user.email,
      mockInformation: req.session.user.mockInformation,
    });
  } else {
    res.status(401).send("Unauthorized");
  }
});

router.get("/user-information-for-admin-better", async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json({
      username: user.username,
      email: user.email,
      mockInformation: user.mockInformation,
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.get("/notification-information-for-admin", async (req, res) => {
  try {
    const notifications = await AdminNotifs.find({});
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching Notifications:", error);
    res.status(500).send("Error fetching notifications");
  }
});

// ==========================================
// ৬. স্পিকিং টেস্ট বুকিং
// ==========================================
router.post("/add-speaking-test-booking", async (req, res) => {
  const { username, plan, email, bookingsLeft, speaking_dates } = req.body;
  if (!username || !email || !speaking_dates) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const newBooker = new SpeakingBookings({
      username,
      plan: plan || "Free",
      email,
      bookingsLeft,
      speaking_dates,
    });
    await newBooker.save();
    res.status(200).send("Booking created successfully");
  } catch (err) {
    res.status(500).send("Error adding booking: " + err.message);
  }
});

router.post("/update-speaking-test-booking", async (req, res) => {
  const { email, bookingsLeft, speaking_dates } = req.body;
  try {
    const user = await SpeakingBookings.findOne({ email: email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.bookingsLeft = bookingsLeft;
    if (speaking_dates && speaking_dates.length > 0) {
      user.speaking_dates.push({
        testId: speaking_dates[0].testId,
        date: speaking_dates[0].date,
        time: speaking_dates[0].time,
        completed: speaking_dates[0].completed,
      });
      user.markModified("speaking_dates");
    }
    await user.save();
    res.status(200).send("Booking updated");
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).send("Update failed");
  }
});

router.get("/speaking-booking-data", async (req, res) => {
  try {
    const data = await SpeakingBookings.find();
    res.json(data);
  } catch (err) {
    res.status(500).send("Error fetching speaking data");
  }
});

// ==========================================
// ৭. প্র্যাকটিস ডেটা রাউটস (CAMBRIDGE vs QUESTION-TYPE)
// ==========================================

// ১. LISTENING DATA
router.get("/pracDataListening", async (req, res) => {
  try {
    const { book, test, part, type, pracNumber } = req.query;

    // [ক] QUESTION TYPE PRACTICE: যদি type এবং pracNumber থাকে
    if (type && pracNumber) {
      const db = mongoose.connection.db;
      // সরাসরি প্র্যাকটিস কালেকশন থেকে কুয়েরি
      const pracDoc = await db.collection("listening-practices").findOne({
        type: type,
        pracNumber: pracNumber
      });

      if (pracDoc) {
        return res.json(pracDoc);
      }
      return res.status(404).json({ error: "Listening question-type practice not found" });
    }

    // [খ] CAMBRIDGE TEST: যদি book এবং test থাকে
    if (book && test) {
      const db = mongoose.connection.db;
      const bNum = isNaN(book) ? book : Number(book);
      const tNum = isNaN(test) ? test : Number(test);

      const cDoc = await db.collection("cambridge_listening").findOne({
        $or: [
          { book: bNum, testNo: tNum },
          { book: String(book), testNo: String(test) },
          { book: bNum, test: tNum },
          { bookNumber: bNum, testNumber: tNum }
        ]
      });

      if (cDoc) {
        let finalQuestions = cDoc.questions || [];
        let finalAudio = cDoc.audioUrl || "";

        // নির্দিষ্ট পার্ট চাইলে
        if (part) {
          const pNum = Number(part);
          finalQuestions = finalQuestions.filter((q) => Number(q.part) === pNum);
          if (cDoc.partAudios && cDoc.partAudios[String(pNum)]) {
            finalAudio = cDoc.partAudios[String(pNum)];
          }
        }

        return res.json({
          ...cDoc,
          type: cDoc.title || `Cambridge ${book} Test ${test}`,
          listening: {
            questions: finalQuestions,
            instructions: cDoc.instructions || [],
            answers: cDoc.answers || {},
            answerExplanations: cDoc.answerExplanations || {},
            audioUrl: finalAudio,
            audio: finalAudio,
            partAudios: cDoc.partAudios || {}
          }
        });
      }
      return res.status(404).json({ error: "Cambridge listening test not found" });
    }

    res.status(400).json({ error: "Missing required parameters (type/pracNumber OR book/test)" });
  } catch (err) {
    console.error("pracDataListening error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ২. READING DATA
router.get("/pracDataReading", async (req, res) => {
  try {
    const { book, test, type, pracNumber } = req.query;

    // [ক] QUESTION TYPE PRACTICE: যদি type এবং pracNumber থাকে
    if (type && pracNumber) {
      const db = mongoose.connection.db;
      // সরাসরি রিডিং প্র্যাকটিস কালেকশন থেকে কুয়েরি
      const pracDoc = await db.collection("reading-practices").findOne({
        type: type,
        pracNumber: pracNumber
      });

      if (pracDoc) {
        return res.json(pracDoc);
      }
      return res.status(404).json({ error: "Reading question-type practice not found" });
    }

    // [খ] CAMBRIDGE READING: যদি book এবং test থাকে
    if (book && test) {
      const db = mongoose.connection.db;
      const bNum = isNaN(book) ? book : Number(book);
      const tNum = isNaN(test) ? test : Number(test);

      const cDoc = await db.collection("cambridge_reading").findOne({
        $or: [
          { book: bNum, testNo: tNum },
          { book: String(book), testNo: String(test) },
          { book: bNum, test: tNum },
          { bookNumber: bNum, testNumber: tNum }
        ]
      });

      if (cDoc) {
        return res.json({
          ...cDoc,
          type: cDoc.title || `Cambridge ${book} Reading Test ${test}`,
          reading: {
            passages: cDoc.passages || [],
            questions: cDoc.questions || [],
            instructions: cDoc.instructions || [],
            answers: cDoc.answers || {},
            answerExplanations: cDoc.answerExplanations || {}
          }
        });
      }
      return res.status(404).json({ error: "Cambridge reading test not found" });
    }

    res.status(400).json({ error: "Missing required parameters (type/pracNumber OR book/test)" });
  } catch (err) {
    console.error("pracDataReading error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ৩. WRITING DATA
router.get("/pracDataWriting", async (req, res) => {
  try {
    const { book, test, type, pracNumber } = req.query;

    if (type && pracNumber) {
      const db = mongoose.connection.db;
      const pracDoc = await db.collection("writing-practices").findOne({
        type: type,
        pracNumber: pracNumber
      });
      if (pracDoc) return res.json(pracDoc);
      return res.status(404).json({ error: "Writing practice not found" });
    }

    if (book && test) {
      const db = mongoose.connection.db;
      const bNum = isNaN(book) ? book : Number(book);
      const tNum = isNaN(test) ? test : Number(test);

      const cDoc = await db.collection("cambridgewritings").findOne({
        $or: [
          { book: bNum, testNo: tNum },
          { book: String(book), testNo: String(test) }
        ]
      });

      if (cDoc) return res.json(cDoc);
      return res.status(404).json({ error: "Cambridge writing not found" });
    }

    res.status(400).json({ error: "Missing parameters" });
  } catch (err) {
    console.error("pracDataWriting error:", err);
    res.status(500).json({ error: err.message });
  }
});








// ==========================================
// SYSTEM SETTINGS & ACCESS CONTROL PHASES
// ==========================================
router.get("/system-settings", async (req, res) => {
  try {
    let settings = await SystemSettings.findOne({ key: "global_config" });
    if (!settings) {
      settings = await SystemSettings.create({
        key: "global_config",
        currentPhase: 1,
        freeAcademicMocksCount: 1,
        freePremiumMocksCount: 1,
        freeFullMocksCount: 1,
        freePartsPerTest: 1,
        freeQuestionTypesPerTest: 0,
        freePracticeHubSets: 2,
        freeAiWritingPerDay: 1,
        loginReminderEnabled: true,
        cambridgeAlwaysFree: true
      });
    }
    return res.json({ success: true, settings });
  } catch (err) {
    console.error("Error fetching system settings:", err);
    return res.status(500).json({ error: "Failed to fetch system settings" });
  }
});

router.post("/admin/system-settings", async (req, res) => {
  try {
    const {
      currentPhase,
      freeAcademicMocksCount,
      freePremiumMocksCount,
      freeFullMocksCount,
      freePartsPerTest,
      freeQuestionTypesPerTest,
      freePracticeHubSets,
      freeAiWritingPerDay,
      loginReminderEnabled
    } = req.body;

    const parseNum = (val, fallback) => {
      const n = Number(val);
      return isNaN(n) ? fallback : n;
    };

    const updateFields = {
      updatedAt: new Date(),
      cambridgeAlwaysFree: true
    };

    if (currentPhase !== undefined) updateFields.currentPhase = parseNum(currentPhase, 1);
    if (freeAcademicMocksCount !== undefined) updateFields.freeAcademicMocksCount = parseNum(freeAcademicMocksCount, 1);
    if (freePremiumMocksCount !== undefined) updateFields.freePremiumMocksCount = parseNum(freePremiumMocksCount, 1);
    if (freeFullMocksCount !== undefined) {
      updateFields.freeFullMocksCount = parseNum(freeFullMocksCount, 1);
      if (freeAcademicMocksCount === undefined) updateFields.freeAcademicMocksCount = parseNum(freeFullMocksCount, 1);
    }
    if (freePartsPerTest !== undefined) updateFields.freePartsPerTest = parseNum(freePartsPerTest, 1);
    if (freeQuestionTypesPerTest !== undefined) updateFields.freeQuestionTypesPerTest = parseNum(freeQuestionTypesPerTest, 0);
    if (freePracticeHubSets !== undefined) updateFields.freePracticeHubSets = parseNum(freePracticeHubSets, 2);
    if (freeAiWritingPerDay !== undefined) updateFields.freeAiWritingPerDay = parseNum(freeAiWritingPerDay, 1);
    if (loginReminderEnabled !== undefined) updateFields.loginReminderEnabled = !!loginReminderEnabled;

    const updated = await SystemSettings.findOneAndUpdate(
      { key: "global_config" },
      { $set: updateFields },
      { upsert: true, new: true }
    );

    return res.json({ success: true, settings: updated });
  } catch (err) {
    console.error("Error saving system settings:", err);
    return res.status(500).json({ error: "Failed to save system settings" });
  }
});

// ==========================================
// CANDIDATE DASHBOARD DATA AGGREGATOR
// ==========================================
router.get("/student/dashboard-data", async (req, res) => {
  try {
    const sessionUser = req.session.user || req.session.candidate;
    if (!sessionUser || !sessionUser.email) {
      return res.status(401).json({ success: false, message: "Please log in to view dashboard" });
    }

    const userEmail = sessionUser.email.toLowerCase().trim();

    // 1. Fetch from StudentTestRecord
    const records = await StudentTestRecord.find({ userEmail }).sort({ completedAt: -1 }).lean();

    // 2. Fetch from User.mockInformation
    let legacyMockList = [];
    try {
      const userDoc = await User.findOne({ email: userEmail }).lean();
      if (userDoc && Array.isArray(userDoc.mockInformation)) {
        legacyMockList = userDoc.mockInformation;
      }
    } catch (e) {
      console.warn("Legacy mockInformation query error:", e.message);
    }

    // Combine test items cleanly
    const combinedHistory = [];
    const seenIds = new Set();

    records.forEach(r => {
      seenIds.add(r.testId || r._id.toString());
      combinedHistory.push({
        id: r._id,
        testId: r.testId,
        title: r.title || 'IELTS Mock Test',
        testType: r.testType || 'Full Mock',
        module: r.module || null,
        totalQuestions: r.totalQuestions || 40,
        listeningScore: r.listeningScore || 0,
        readingScore: r.readingScore || 0,
        writingScore: r.writingScore || 0,
        listeningBand: r.listeningBand || 0,
        readingBand: r.readingBand || 0,
        writingBand: r.writingBand || 0,
        overallBand: r.overallBand || 0,
        totalWords: r.totalWords || 0,
        feedback: r.feedback || {},
        mistakes: r.mistakes || [],
        answers: r.answers || {},
        completedAt: r.completedAt
      });
    });

    legacyMockList.forEach((m, idx) => {
      const testKey = 'legacy-' + (m.mockID || m.testID || idx);
      if (!seenIds.has(testKey)) {
        const lScore = Number(m.listeningScore || m.listening || 0);
        const rScore = Number(m.readingScore || m.reading || 0);
        const wScore = Number(m.writingScore || m.writing || 0);

        function calcBand(raw) {
          if (!raw) return 0;
          if (raw >= 39) return 9.0;
          if (raw >= 37) return 8.5;
          if (raw >= 35) return 8.0;
          if (raw >= 32) return 7.5;
          if (raw >= 30) return 7.0;
          if (raw >= 26) return 6.5;
          if (raw >= 23) return 6.0;
          if (raw >= 18) return 5.5;
          if (raw >= 16) return 5.0;
          return 4.5;
        }

        const lBand = calcBand(lScore);
        const rBand = calcBand(rScore);
        const wBand = wScore > 0 ? (wScore > 9 ? wScore / 10 : wScore) : 0;
        
        const validBands = [lBand, rBand, wBand].filter(b => b > 0);
        let overall = 0;
        if (validBands.length > 0) {
          const rawAvg = validBands.reduce((a, b) => a + b, 0) / validBands.length;
          overall = Math.round(rawAvg * 2) / 2;
        }

        combinedHistory.push({
          id: testKey,
          testId: m.mockID || m.testID || ('Mock ' + (idx + 1)),
          title: m.mockName || m.mockID || ('Academic IELTS Mock ' + (idx + 1)),
          testType: 'Full Mock',
          listeningScore: lScore,
          readingScore: rScore,
          writingScore: wScore,
          listeningBand: lBand,
          readingBand: rBand,
          writingBand: wBand,
          overallBand: overall,
          completedAt: m.date || m.submittedAt || new Date()
        });
      }
    });

    // Calculate official averages
    let sumListening = 0, sumReading = 0, sumWriting = 0, sumOverall = 0;
    let countL = 0, countR = 0, countW = 0, countO = 0;
    let sumLRaw = 0, sumRRaw = 0;
    let totalQuestionsAttempted = 0;
    let totalCorrectAnswers = 0;

    const categoryBreakdown = {
      fullMock: 0,
      cambridge: 0,
      questionType: 0,
      writing: 0
    };

    combinedHistory.forEach(h => {
      const typeLower = String(h.testType || '').toLowerCase();
      if (typeLower.includes('full') || typeLower.includes('academic') || typeLower.includes('premium') || typeLower.includes('general')) {
        categoryBreakdown.fullMock++;
      } else if (typeLower.includes('hub') || typeLower.includes('question') || typeLower.includes('type')) {
        categoryBreakdown.questionType++;
      } else if (typeLower.includes('writing')) {
        categoryBreakdown.writing++;
      } else if (typeLower.includes('cambridge')) {
        categoryBreakdown.cambridge++;
      }

      if (h.listeningBand > 0) { 
        sumListening += h.listeningBand; 
        countL++; 
        sumLRaw += (h.listeningScore || 0); 
        totalCorrectAnswers += (h.listeningScore || 0);
        totalQuestionsAttempted += (h.totalQuestions || 40);
      }
      if (h.readingBand > 0) { 
        sumReading += h.readingBand; 
        countR++; 
        sumRRaw += (h.readingScore || 0); 
        totalCorrectAnswers += (h.readingScore || 0);
        totalQuestionsAttempted += (h.totalQuestions || 40);
      }
      if (h.writingBand > 0) { sumWriting += h.writingBand; countW++; }
      if (h.overallBand > 0) { sumOverall += h.overallBand; countO++; }
    });

    const accuracyRate = totalQuestionsAttempted > 0 ? Math.round((totalCorrectAnswers / totalQuestionsAttempted) * 100) : 0;

    const averages = {
      overall: countO ? Math.round((sumOverall / countO) * 2) / 2 : 0,
      listening: countL ? Math.round((sumListening / countL) * 2) / 2 : 0,
      reading: countR ? Math.round((sumReading / countR) * 2) / 2 : 0,
      writing: countW ? Math.round((sumWriting / countW) * 2) / 2 : 0,
      avgListeningScore: countL ? sumLRaw / countL : 0,
      avgReadingScore: countR ? sumRRaw / countR : 0
    };

    return res.json({
      success: true,
      totalTests: combinedHistory.length,
      evaluatedWritingCount: countW,
      totalQuestionsAttempted,
      totalCorrectAnswers,
      accuracyRate,
      categoryBreakdown,
      averages,
      history: combinedHistory
    });
  } catch (err) {
    console.error("Dashboard data load error:", err);
    return res.status(500).json({ error: "Failed to load dashboard data" });
  }
});

// Record test completion endpoint
router.post("/student/record-test", async (req, res) => {
  try {
    const sessionUser = req.session.user || req.session.candidate;
    const userEmail = (sessionUser && sessionUser.email ? sessionUser.email : (req.body.email || 'guest@ieltsmockpoint.com')).toLowerCase().trim();

    const {
      testType,
      module: modName,
      testId,
      title,
      totalQuestions,
      listeningScore,
      readingScore,
      writingScore,
      listeningBand,
      readingBand,
      writingBand,
      overallBand,
      totalWords,
      feedback,
      mistakes,
      answers
    } = req.body;

    const detectedMod = modName || (testType && testType.toLowerCase().includes('reading') ? 'reading' : (testType && testType.toLowerCase().includes('listening') ? 'listening' : (testType && testType.toLowerCase().includes('writing') ? 'writing' : null)));

    const record = await StudentTestRecord.create({
      userEmail,
      testType: testType || 'Full Mock',
      module: detectedMod,
      testId: testId || 'mock-' + Date.now(),
      title: title || 'Academic IELTS Mock Test',
      totalQuestions: Number(totalQuestions) || null,
      listeningScore: Number(listeningScore) || 0,
      readingScore: Number(readingScore) || 0,
      writingScore: Number(writingScore) || 0,
      listeningBand: Number(listeningBand) || 0,
      readingBand: Number(readingBand) || 0,
      writingBand: Number(writingBand) || 0,
      overallBand: Number(overallBand) || 0,
      totalWords: Number(totalWords) || 0,
      feedback: feedback || {},
      mistakes: mistakes || [],
      answers: answers || {}
    });

    return res.json({ success: true, recordId: record._id });
  } catch (err) {
    console.error("Error recording test:", err);
    return res.status(500).json({ error: "Failed to record test" });
  }
});


module.exports = router;