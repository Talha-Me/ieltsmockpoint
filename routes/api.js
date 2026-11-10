

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
router.get("/mockTest", async (req, res) => {
  try {
    const mockID = req.query.mockID || (req.session && req.session.mock && req.session.mock.mockNumber);

    if (mockID) {
      const mockDoc = await TestQuestions.findOne({
        $or: [
          { mockNumber: mockID },
          { mockNumber: String(mockID).trim() }
        ]
      }).lean();

      if (mockDoc) {
        if (req.session) {
          req.session.mock = {
            mockNumber: mockDoc.mockNumber,
            plan: mockDoc.plan || "Free",
            listening: mockDoc.listening,
            reading: mockDoc.reading,
            writing: mockDoc.writing,
          };
        }
        return res.json({
          mockNumber: mockDoc.mockNumber,
          plan: mockDoc.plan || "Free",
          listening: mockDoc.listening,
          reading: mockDoc.reading,
          writing: mockDoc.writing,
        });
      }
    }

    if (req.session && req.session.mock) {
      return res.json({
        mockNumber: req.session.mock.mockNumber,
        plan: req.session.mock.plan || "Free",
        listening: req.session.mock.listening,
        reading: req.session.mock.reading,
        writing: req.session.mock.writing,
      });
    }

    res.status(400).json({ error: "No active mock test in session or query" });
  } catch (err) {
    console.error("Error in /mockTest:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getListeningData", async (req, res) => {
  try {
    const mockID = req.query.mockID || (req.session && req.session.mock && req.session.mock.mockNumber);
    if (req.session && req.session.mock && req.session.mock.listening) {
      return res.json(req.session.mock.listening);
    }
    if (mockID) {
      const mockDoc = await TestQuestions.findOne({ mockNumber: mockID }).lean();
      if (mockDoc && mockDoc.listening) {
        return res.json(mockDoc.listening);
      }
    }
    res.status(400).json({ error: "No mock listening session found" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/getReadingData", async (req, res) => {
  try {
    const mockID = req.query.mockID || (req.session && req.session.mock && req.session.mock.mockNumber);
    if (req.session && req.session.mock && req.session.mock.reading) {
      return res.json(req.session.mock.reading);
    }
    if (mockID) {
      const mockDoc = await TestQuestions.findOne({ mockNumber: mockID }).lean();
      if (mockDoc && mockDoc.reading) {
        return res.json(mockDoc.reading);
      }
    }
    res.status(400).json({ error: "No mock reading session found" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/getWritingData", async (req, res) => {
  try {
    const mockID = req.query.mockID || (req.session && req.session.mock && req.session.mock.mockNumber);
    if (req.session && req.session.mock && req.session.mock.writing) {
      return res.json(req.session.mock.writing);
    }
    if (mockID) {
      const mockDoc = await TestQuestions.findOne({ mockNumber: mockID }).lean();
      if (mockDoc && mockDoc.writing) {
        return res.json(mockDoc.writing);
      }
    }
    res.status(400).json({ error: "No mock writing session found" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// ৪. এক্সাম সাবমিশন ও রেজাল্ট প্রসেসিং
// ==========================================
function calcIeltsBand(raw) {
  const score = Number(raw) || 0;
  if (score >= 39) return 9.0;
  if (score >= 37) return 8.5;
  if (score >= 35) return 8.0;
  if (score >= 32) return 7.5;
  if (score >= 30) return 7.0;
  if (score >= 26) return 6.5;
  if (score >= 23) return 6.0;
  if (score >= 18) return 5.5;
  if (score >= 16) return 5.0;
  if (score >= 13) return 4.5;
  if (score >= 10) return 4.0;
  if (score >= 7) return 3.5;
  if (score >= 5) return 3.0;
  if (score >= 3) return 2.5;
  return 2.0;
}
router.post("/update-mock-info", async (req, res) => {
  try {
    const { score, mistakes, mod, writingInputs, answers } = req.body;
    const sessionUser = req.session.user || req.session.candidate;

    if (!mod) {
      return res.status(400).json({ error: "Module type is required" });
    }

    const currentMockId = req.body.testId || (req.session.mock ? req.session.mock.mockNumber : "Free-Mock");

    if (!req.session.examResults) {
      req.session.examResults = {};
    }

    if (mod === "listening") {
      req.session.examResults.listening = { score, mistakes, answers };
    } else if (mod === "reading") {
      req.session.examResults.reading = { score, mistakes, answers };
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
          let record = await StudentTestRecord.findOne({
            userEmail,
            testId: currentMockId,
            status: "in-progress"
          });
          if (!record) {
            record = await StudentTestRecord.findOne({
              userEmail,
              testId: currentMockId
            }).sort({ createdAt: -1 });
          }
          if (!record) {
            const isPrem = currentMockId.includes("Premium");
            const isGen = currentMockId.includes("General");
            record = new StudentTestRecord({
              userEmail,
              userId: sessionUser.id || null,
              testType: isPrem ? "Premium Full Mock" : (isGen ? "General Full Mock" : "Academic Full Mock"),
              testId: currentMockId,
              title: isPrem ? currentMockId.replace(/-UKA-FINAL-/i, " Premium Mock ") : currentMockId.replace(/-UKA-FINAL-/i, " Academic Mock "),
              status: "completed",
              answers: {},
              mistakes: {}
            });
          }

          if (!record.answers) record.answers = {};
          if (!record.mistakes) record.mistakes = {};

          if (mod === "listening") {
            if (score !== undefined && score !== null) {
              record.listeningScore = Number(score);
              record.listeningBand = calcIeltsBand(score);
            }
            if (answers) record.answers.listening = answers;
            if (mistakes) record.mistakes.listening = mistakes;
          } else if (mod === "reading") {
            if (score !== undefined && score !== null) {
              record.readingScore = Number(score);
              record.readingBand = calcIeltsBand(score);
            }
            if (answers) record.answers.reading = answers;
            if (mistakes) record.mistakes.reading = mistakes;
          } else if (mod === "writing") {
            if (writingInputs) {
              record.answers.writing = writingInputs;
            }
          }

          record.status = "completed";

          const bands = [record.listeningBand, record.readingBand, record.writingBand, record.speakingBand].filter(b => typeof b === 'number' && b > 0);
          if (bands.length > 0) {
            const rawAvg = bands.reduce((a, b) => a + b, 0) / bands.length;
            record.overallBand = Math.round(rawAvg * 2) / 2;
          }

          record.lastSavedAt = new Date();
          record.markModified("answers");
          record.markModified("mistakes");
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
function requireAdminAuth(req, res, next) {
  if (req.session && req.session.isAdmin === true) {
    return next();
  }
  return res.status(401).json({ success: false, message: "Unauthorized admin session. Please log in again." });
}

router.post("/admin/login", (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");
  const primaryUser = process.env.ADMIN_USER || "Talha";
  const primaryPass = process.env.ADMIN_PASS || "Talha123@#";
  const secondaryUser = process.env.UKA_ADMIN_USER || "UKA";
  const secondaryPass = process.env.UKA_ADMIN_PASS || "@abcxyz634#";

  if ((username === primaryUser && password === primaryPass) || (username === secondaryUser && password === secondaryPass)) {
    req.session.isAdmin = true;
    req.session.adminUser = username;
    return req.session.save((err) => {
      if (err) return res.status(500).json({ success: false, message: "Failed to create admin session" });
      return res.json({ success: true, adminUser: username });
    });
  }
  return res.status(401).json({ success: false, message: "Invalid username or password!" });
});

router.post("/admin/logout", (req, res) => {
  if (req.session) {
    delete req.session.isAdmin;
    delete req.session.adminUser;
    return req.session.save(() => res.json({ success: true }));
  }
  return res.json({ success: true });
});

router.get("/admin/session", (req, res) => {
  const authenticated = Boolean(req.session && req.session.isAdmin === true);
  return res.json({
    success: true,
    authenticated,
    adminUser: authenticated ? (req.session.adminUser || "admin") : null
  });
});

router.get("/admin/accounts", requireAdminAuth, async (req, res) => {
  try {
    const q = String(req.query.search || "").trim();
    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } }
          ]
        }
      : {};
    const accounts = await Account.find(filter)
      .select("name email provider role isPremium plan premiumExpiresAt paymentProvider lastTransactionId createdAt")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return res.json({ success: true, accounts });
  } catch (err) {
    console.error("Error fetching admin accounts:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch accounts" });
  }
});

router.post("/admin/accounts/:id/premium", requireAdminAuth, async (req, res) => {
  try {
    const { isPremium, plan, days } = req.body;
    const enable = Boolean(isPremium);
    let expiresAt = null;
    if (enable && Number(days) > 0) {
      expiresAt = new Date(Date.now() + Number(days) * 24 * 60 * 60 * 1000);
    }
    const update = {
      isPremium: enable,
      plan: enable ? (plan || "premium") : "free",
      premiumExpiresAt: enable ? expiresAt : null,
      paymentProvider: enable ? "admin_manual" : null
    };
    const updated = await Account.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    ).select("name email provider role isPremium plan premiumExpiresAt paymentProvider createdAt");
    if (!updated) return res.status(404).json({ success: false, message: "Account not found" });
    return res.json({ success: true, account: updated });
  } catch (err) {
    console.error("Error updating account premium status:", err);
    return res.status(500).json({ success: false, message: "Failed to update account premium status" });
  }
});

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
        freeSpeakingTestsCount: 1,
        freeSpeakingPartsCount: 1,
        freeRecentTestsCount: 2,
        freePartsPerTest: 1,
        freeQuestionTypesPerTest: 0,
        freePracticeHubSets: 2,
        freeAiWritingPerDay: 1,
        loginReminderEnabled: true,
        loginReminderMode: "every_time",
        cambridgeAlwaysFree: true
      });
    } else {
      let dirty = false;
      if (settings.freeRecentTestsCount === undefined) {
        settings.freeRecentTestsCount = 2;
        dirty = true;
      }
      if (!settings.loginReminderMode) {
        settings.loginReminderMode = "every_time";
        dirty = true;
      }
      if (dirty) await settings.save();
    }
    return res.json({ success: true, settings });
  } catch (err) {
    console.error("Error fetching system settings:", err);
    return res.status(500).json({ error: "Failed to fetch system settings" });
  }
});

router.post("/admin/system-settings", requireAdminAuth, async (req, res) => {
  try {
    const {
      currentPhase,
      freeAcademicMocksCount,
      freePremiumMocksCount,
      freeFullMocksCount,
      freeSpeakingTestsCount,
      freeSpeakingPartsCount,
      freeRecentTestsCount,
      freePartsPerTest,
      freeQuestionTypesPerTest,
      freePracticeHubSets,
      freeAiWritingPerDay,
      loginReminderEnabled,
      loginReminderMode,
      cambridgeAlwaysFree
    } = req.body;

    const parseNum = (val, fallback) => {
      const n = Number(val);
      return isNaN(n) ? fallback : n;
    };

    const updateFields = {
      updatedAt: new Date(),
      updatedBy: req.session?.adminUser || "admin",
      cambridgeAlwaysFree: cambridgeAlwaysFree === undefined ? true : Boolean(cambridgeAlwaysFree)
    };

    if (currentPhase !== undefined) updateFields.currentPhase = parseNum(currentPhase, 1);
    if (freeAcademicMocksCount !== undefined) updateFields.freeAcademicMocksCount = parseNum(freeAcademicMocksCount, 1);
    if (freePremiumMocksCount !== undefined) updateFields.freePremiumMocksCount = parseNum(freePremiumMocksCount, 1);
    if (freeFullMocksCount !== undefined) {
      updateFields.freeFullMocksCount = parseNum(freeFullMocksCount, 1);
      if (freeAcademicMocksCount === undefined) updateFields.freeAcademicMocksCount = parseNum(freeFullMocksCount, 1);
    }
    if (freeSpeakingTestsCount !== undefined) updateFields.freeSpeakingTestsCount = parseNum(freeSpeakingTestsCount, 1);
    if (freeSpeakingPartsCount !== undefined) updateFields.freeSpeakingPartsCount = parseNum(freeSpeakingPartsCount, 1);
    if (freeRecentTestsCount !== undefined) updateFields.freeRecentTestsCount = parseNum(freeRecentTestsCount, 2);
    if (freePartsPerTest !== undefined) updateFields.freePartsPerTest = parseNum(freePartsPerTest, 1);
    if (freeQuestionTypesPerTest !== undefined) updateFields.freeQuestionTypesPerTest = parseNum(freeQuestionTypesPerTest, 0);
    if (freePracticeHubSets !== undefined) updateFields.freePracticeHubSets = parseNum(freePracticeHubSets, 2);
    if (freeAiWritingPerDay !== undefined) updateFields.freeAiWritingPerDay = parseNum(freeAiWritingPerDay, 1);
    if (loginReminderEnabled !== undefined) updateFields.loginReminderEnabled = !!loginReminderEnabled;
    if (loginReminderMode !== undefined && ["every_time", "once_per_session"].includes(loginReminderMode)) {
      updateFields.loginReminderMode = loginReminderMode;
    }

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
    const records = await StudentTestRecord.find({
      userEmail,
      $or: [
        { status: "completed" },
        { listeningScore: { $ne: null } },
        { readingScore: { $ne: null } },
        { writingBand: { $ne: null } },
        { speakingBand: { $ne: null } },
        { "answers.listening": { $exists: true } },
        { "answers.reading": { $exists: true } },
        { "answers.writing": { $exists: true } },
        { "answers.speaking": { $exists: true } }
      ]
    }).sort({ createdAt: -1 }).lean();

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

      const validBands = [r.listeningBand, r.readingBand, r.writingBand, r.speakingBand].filter(b => typeof b === 'number' && b > 0);
      let calculatedOverall = r.overallBand || 0;
      if (!calculatedOverall && validBands.length > 0) {
        const avg = validBands.reduce((a, b) => a + b, 0) / validBands.length;
        calculatedOverall = Math.round(avg * 2) / 2;
      }

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
        speakingBand: r.speakingBand || 0,
        speakingScore: r.speakingScore || 0,
        overallBand: calculatedOverall,
        totalWords: r.totalWords || 0,
        feedback: r.feedback || {},
        mistakes: r.mistakes || [],
        answers: r.answers || {},
        completedAt: r.completedAt || r.createdAt || new Date()
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
    let sumListening = 0, sumReading = 0, sumWriting = 0, sumSpeaking = 0, sumOverall = 0;
    let countL = 0, countR = 0, countW = 0, countS = 0, countO = 0;
    let sumLRaw = 0, sumRRaw = 0;
    let totalQuestionsAttempted = 0;
    let totalCorrectAnswers = 0;

    const categoryBreakdown = {
      fullMock: 0,
      cambridge: 0,
      questionType: 0,
      writing: 0,
      speaking: 0
    };

    combinedHistory.forEach(h => {
      const typeLower = String(h.testType || '').toLowerCase();
      const modLower = String(h.module || '').toLowerCase();
      if (typeLower.includes('cambridge')) {
        categoryBreakdown.cambridge++;
      } else if (typeLower.includes('speaking') || modLower === 'speaking' || (h.speakingBand > 0 && !h.listeningBand && !h.readingBand)) {
        categoryBreakdown.speaking++;
      } else if (typeLower.includes('writing') || modLower === 'writing' || (h.writingBand > 0 && !h.listeningBand && !h.readingBand)) {
        categoryBreakdown.writing++;
      } else if (typeLower.includes('hub') || typeLower.includes('question') || typeLower.includes('type') || modLower === 'practice') {
        categoryBreakdown.questionType++;
      } else {
        categoryBreakdown.fullMock++;
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
      if (h.speakingBand > 0) { sumSpeaking += h.speakingBand; countS++; }
      if (h.overallBand > 0) { sumOverall += h.overallBand; countO++; }
    });

    const accuracyRate = totalQuestionsAttempted > 0 ? Math.round((totalCorrectAnswers / totalQuestionsAttempted) * 100) : 0;

    const averages = {
      overall: countO ? Math.round((sumOverall / countO) * 2) / 2 : 0,
      listening: countL ? Math.round((sumListening / countL) * 2) / 2 : 0,
      reading: countR ? Math.round((sumReading / countR) * 2) / 2 : 0,
      writing: countW ? Math.round((sumWriting / countW) * 2) / 2 : 0,
      speaking: countS ? Math.round((sumSpeaking / countS) * 2) / 2 : 0,
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

// ==========================================
// AUTO-SAVE PROGRESS (EVERY 2-3 MINUTES & DRAFT RESTORE)
// ==========================================
router.post("/student/auto-save", async (req, res) => {
  try {
    const sessionUser = req.session.user || req.session.candidate;
    const userEmail = (sessionUser && sessionUser.email ? sessionUser.email : (req.body.email || '')).toLowerCase().trim();

    if (!userEmail || userEmail === 'guest@ieltsmockpoint.com') {
      return res.json({ success: true, savedTo: 'local-only', message: 'Guest session' });
    }

    const {
      testId,
      testType,
      module: modName,
      title,
      answers,
      remainingSeconds
    } = req.body;

    if (!testId) {
      return res.status(400).json({ error: "testId is required" });
    }

    let record = await StudentTestRecord.findOne({
      userEmail,
      testId,
      status: "in-progress"
    });

    if (!record) {
      record = new StudentTestRecord({
        userEmail,
        userId: (sessionUser && sessionUser.id) || null,
        testId,
        testType: testType || (testId.includes("Premium") ? "Premium Full Mock" : "Academic Full Mock"),
        module: modName || null,
        title: title || testId.replace(/-UKA-FINAL-/i, " Mock Test "),
        status: "in-progress",
        answers: {}
      });
    }

    if (!record.answers) record.answers = {};
    if (modName && answers) {
      record.answers[modName] = answers;
    } else if (answers) {
      record.answers = Object.assign(record.answers, answers);
    }

    record.lastSavedAt = new Date();
    record.markModified("answers");
    await record.save();

    return res.json({ success: true, recordId: record._id, lastSavedAt: record.lastSavedAt });
  } catch (err) {
    console.error("Auto-save error:", err);
    return res.status(500).json({ error: "Failed to auto-save" });
  }
});

// Fetch single test record with dynamic 1-40 question breakdown for review modal
router.get("/student/test-record/:id", async (req, res) => {
  try {
    const sessionUser = req.session.user || req.session.candidate;
    let record = await StudentTestRecord.findById(req.params.id).lean();
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    // Ownership check
    if (sessionUser && sessionUser.email) {
      const userEmail = sessionUser.email.toLowerCase().trim();
      if (record.userEmail !== userEmail && record.userEmail !== 'guest@ieltsmockpoint.com' && sessionUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    }

    // Dynamic reconstruction of 1-40 reviews if mistakes is empty or incomplete
    try {
      const testId = record.testId || record.testNumber || record.mockNumber;
      let testDoc = null;
      if (testId) {
        testDoc = await TestQuestions.findOne({ mockNumber: testId }).lean()
          || await TestQuestions.findOne({ mockNumber: new RegExp('^' + testId.replace(/[-\[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '$', 'i') }).lean();
      }
      if (!testDoc && record.title) {
        testDoc = await TestQuestions.findOne({ mockNumber: new RegExp(record.title.replace(/[-\[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i') }).lean();
      }

      if (testDoc) {
        if (testDoc.listening) {
          if (testDoc.listening.transcript) record.listeningTranscript = testDoc.listening.transcript;
          if (testDoc.listening.explanations) record.listeningExplanations = testDoc.listening.explanations;
          if (testDoc.listening.questions) record.listeningQuestions = testDoc.listening.questions;
          if (testDoc.listening.answers) record.listeningAnswers = testDoc.listening.answers;
        }
        if (testDoc.reading) {
          if (testDoc.reading.explanations) record.readingExplanations = testDoc.reading.explanations;
          if (testDoc.reading.passages) record.readingPassages = testDoc.reading.passages;
          if (testDoc.reading.questions) record.readingQuestions = testDoc.reading.questions;
          if (testDoc.reading.answers) record.readingAnswers = testDoc.reading.answers;
        }
        if (testDoc.writing) {
          if (testDoc.writing.sampleAnswers) record.writingSampleAnswers = testDoc.writing.sampleAnswers;
          if (testDoc.writing.questions) record.writingQuestions = testDoc.writing.questions;
        }

        if (!record.mistakes) record.mistakes = {};
        if (!record.answers) record.answers = {};

        // Dynamic evaluate Listening
        const officialL = testDoc.listening && testDoc.listening.answers;
          const userL = record.answers.listening || {};
          const hasLMistakes = Array.isArray(record.mistakes.listening) && record.mistakes.listening.length > 0;
          if (officialL && (!hasLMistakes || record.mistakes.listening.length < 40)) {
            const listL = [];
            let correctL = 0;
            for (let q = 1; q <= 40; q++) {
              const qStr = String(q);
              const uRaw = userL[qStr] || userL[q] || [];
              const uArr = Array.isArray(uRaw) ? uRaw.map(v => String(v).trim()).filter(Boolean) : (uRaw ? [String(uRaw).trim()] : []);
              const oRaw = officialL[qStr] || officialL[q] || [];
              const oArr = Array.isArray(oRaw) ? oRaw.map(v => String(v).trim()) : (oRaw ? [String(oRaw).trim()] : []);

              const isCorrect = uArr.some(uVal => {
                const uNorm = uVal.toLowerCase();
                return oArr.some(oVal => oVal.toLowerCase() === uNorm);
              });

              if (isCorrect) correctL++;
              listL.push({
                qNum: q,
                yourAns: uArr.length > 0 ? uArr.join(', ') : '(Not Answered)',
                officialAns: oArr.join(' / ') || '--',
                isCorrect
              });
            }
            record.mistakes.listening = listL;
            if (record.listeningScore === null || record.listeningScore === undefined) {
              record.listeningScore = correctL;
              record.listeningBand = calcIeltsBand(correctL);
            }
          }

          // Dynamic evaluate Reading
          const officialR = testDoc.reading && testDoc.reading.answers;
          const userR = record.answers.reading || {};
          const hasRMistakes = Array.isArray(record.mistakes.reading) && record.mistakes.reading.length > 0;
          if (officialR && (!hasRMistakes || record.mistakes.reading.length < 40)) {
            const listR = [];
            let correctR = 0;
            for (let q = 1; q <= 40; q++) {
              const qStr = String(q);
              const uRaw = userR[qStr] || userR[q] || [];
              const uArr = Array.isArray(uRaw) ? uRaw.map(v => String(v).trim()).filter(Boolean) : (uRaw ? [String(uRaw).trim()] : []);
              const oRaw = officialR[qStr] || officialR[q] || [];
              const oArr = Array.isArray(oRaw) ? oRaw.map(v => String(v).trim()) : (oRaw ? [String(oRaw).trim()] : []);

              const isCorrect = uArr.some(uVal => {
                const uNorm = uVal.toLowerCase();
                return oArr.some(oVal => oVal.toLowerCase() === uNorm);
              });

              if (isCorrect) correctR++;
              listR.push({
                qNum: q,
                yourAns: uArr.length > 0 ? uArr.join(', ') : '(Not Answered)',
                officialAns: oArr.join(' / ') || '--',
                isCorrect
              });
            }
            record.mistakes.reading = listR;
            if (record.readingScore === null || record.readingScore === undefined) {
              record.readingScore = correctR;
              record.readingBand = calcIeltsBand(correctR);
            }
          }

          // Update overallBand if needed
          const bands = [record.listeningBand, record.readingBand, record.writingBand, record.speakingBand].filter(b => typeof b === 'number' && b > 0);
          if (bands.length > 0 && (!record.overallBand || record.overallBand === 0)) {
            const rawAvg = bands.reduce((a, b) => a + b, 0) / bands.length;
            record.overallBand = Math.round(rawAvg * 2) / 2;
          }

          // Persist back to DB so subsequent loads are instant
          await StudentTestRecord.findByIdAndUpdate(record._id, {
            mistakes: record.mistakes,
            answers: record.answers,
            listeningScore: record.listeningScore,
            listeningBand: record.listeningBand,
            readingScore: record.readingScore,
            readingBand: record.readingBand,
            overallBand: record.overallBand,
            status: "completed"
          });
        }
    } catch (evalErr) {
      console.warn("Dynamic test record evaluation warning:", evalErr.message);
    }

    return res.json({ success: true, record });
  } catch (err) {
    console.error("Fetch test record error:", err);
    return res.status(500).json({ error: "Failed to load test record" });
  }
});

// Record test completion endpoint (Final Submittal & Band Scoring)
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
      speakingScore,
      listeningBand,
      readingBand,
      writingBand,
      speakingBand,
      overallBand,
      totalWords,
      feedback,
      mistakes,
      answers
    } = req.body;

    const detectedMod = modName || (testType && testType.toLowerCase().includes('reading') ? 'reading' : (testType && testType.toLowerCase().includes('listening') ? 'listening' : (testType && testType.toLowerCase().includes('writing') ? 'writing' : (testType && testType.toLowerCase().includes('speaking') ? 'speaking' : null))));
    const currentId = testId || 'mock-' + Date.now();

    // Look for an existing in-progress record to update or create fresh
    let record = null;
    if (userEmail && userEmail !== 'guest@ieltsmockpoint.com' && currentId) {
      record = await StudentTestRecord.findOne({ userEmail, testId: currentId, status: "in-progress" });
    }

    if (!record) {
      record = new StudentTestRecord({ userEmail, testId: currentId });
    }

    record.status = "completed";
    record.testType = testType || 'Full Mock';
    record.module = detectedMod;
    record.title = title || currentId.replace(/-UKA-FINAL-/i, " Mock Test ");
    record.totalQuestions = Number(totalQuestions) || null;
    if (listeningScore !== undefined && listeningScore !== null) record.listeningScore = Number(listeningScore);
    if (readingScore !== undefined && readingScore !== null) record.readingScore = Number(readingScore);
    if (writingScore !== undefined && writingScore !== null) record.writingScore = Number(writingScore);
    if (listeningBand !== undefined && listeningBand !== null) record.listeningBand = Number(listeningBand);
    if (readingBand !== undefined && readingBand !== null) record.readingBand = Number(readingBand);
    if (writingBand !== undefined && writingBand !== null) record.writingBand = Number(writingBand);
    if (speakingScore !== undefined && speakingScore !== null) record.speakingScore = Number(speakingScore);
    if (speakingBand !== undefined && speakingBand !== null) record.speakingBand = Number(speakingBand);
    if (overallBand !== undefined && overallBand !== null) record.overallBand = Number(overallBand);
    record.totalWords = Number(totalWords) || record.totalWords || 0;
    record.feedback = feedback || record.feedback || {};
    record.mistakes = Object.assign({}, record.mistakes || {}, mistakes || {});
    record.answers = Object.assign({}, record.answers || {}, answers || {});
    record.completedAt = new Date();
    record.lastSavedAt = new Date();

    record.markModified("feedback");
    record.markModified("mistakes");
    record.markModified("answers");

    await record.save();

    return res.json({ success: true, recordId: record._id });
  } catch (err) {
    console.error("Error recording test:", err);
    return res.status(500).json({ error: "Failed to record test" });
  }
});

module.exports = router;