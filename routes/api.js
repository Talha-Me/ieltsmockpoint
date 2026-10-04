

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

// module.exports = router;

const express = require("express");
const router = express.Router();
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

module.exports = router;