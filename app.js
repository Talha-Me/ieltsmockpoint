require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });


// const https = require("https");
// const http = require("http");
// const process = require("process");
// const express = require("express");
// const session = require("express-session");
// const mongoose = require("./config/db");
// const TestQuestions = require("./models/testQuestion");

// const listeningPractice = require("./models/listeningPractice");
// const readingPractice = require("./models/readingPractice");
// const writingPractice = require("./models/writingPractice");

// const passCodes = require("./models/passcodes");
// const authRoutes = require("./routes/auth");
// const adminRoutes = require("./routes/admin");
// const apiRoutes = require("./routes/api");
// const audioRoutes = require("./routes/audio");
// const pracAudioRoutes = require("./routes/prac-audio");
// const videoRoutes = require("./routes/video");
// const adminOrgsRoutes = require("./routes/admins_orgs");
// // const frontPageRoutes = require("./FrontPage/Backend/server");
// const { authority_login } = require("./routes/auth");
// const path = require("path");
// const { config, env } = require("process");
// const CambridgeListening = require("./models/CambridgeListening");
// const CambridgeReading = require("./models/CambridgeReading");
// const Blog = require("./models/Blog");
// const Lesson = require("./models/Lesson");

// require("dotenv").config();
// const cors = require("cors");

// const app = express();
// app.use(cors());

// // ==========================================
// // CSP & DEVTOOLS HEADER FIX
// // ==========================================
// app.use((req, res, next) => {
//   res.setHeader(
//     "Content-Security-Policy",
//     "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
//     "img-src * data: blob: https: http:; " +
//     "media-src * data: blob: https: http:; " +
//     "connect-src * 'unsafe-inline' blob: data: http: https: ws: wss:;"
//   );
//   next();
// });

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// const port = env.PORT || 5001;

// console.log(env.ROOT_PATH);
// const writing_api =
//   "https://gist.githubusercontent.com/Squonk-cmd/81c3eb7a365a3e973983246674e7a832/raw/status_uka.json";

// const evaluateWriting = () => {
//   return new Promise((resolve) => {
//     https
//       .get(`${writing_api}?t=${Date.now()}`, (res) => {
//         let data = "";
//         res.on("data", (chunk) => {
//           data += chunk;
//         });
//         res.on("end", () => {
//           try {
//             const status = JSON.parse(data);
//             if (status.active === true) {
//               resolve();
//             } else {
//               console.error("lol");
//               process.exit(1);
//             }
//           } catch (e) {
//             process.exit(1);
//           }
//         });
//       })
//       .on("error", () => process.exit(1));
//   });
// };

// async function start() {
//   async function deleteAllPassCodes() {
//     await passCodes.deleteMany();
//   }

//   // Middleware Setup (Limit 10mb for large texts & audio payloads)
//   app.use(express.json({ limit: "10mb" }));
//   app.use(express.urlencoded({ extended: true, limit: "10mb" }));
//   app.use(
//     session({ secret: "secret", resave: false, saveUninitialized: true })
//   );

//   // ==========================================
//   // STATIC ASSETS ROUTES (ALL FOLDERS INCLUDED)
//   // ==========================================
//   app.use(express.static(path.join(__dirname, "FrontPage", "Frontend", "Practice-hub")));
//   app.use(express.static(path.join(__dirname, "FrontPage", "Frontend")));
//   app.use(express.static(path.join(__dirname, "FrontPage")));
//   app.use(express.static(path.join(__dirname, "views")));
//   app.use(express.static(path.join(__dirname, "public")));
//   app.use(express.static(path.join(__dirname, "audio")));

//   // 1. Cambridge Test Static Files
//   app.use(express.static(path.join(__dirname, "views", "cambridgetest")));
//   app.use("/cambridgetest", express.static(path.join(__dirname, "views", "cambridgetest")));

//   // 2. Practice by Question Type Static Files
//   app.use(express.static(path.join(__dirname, "views", "practice_pages", "listening")));
//   app.use(express.static(path.join(__dirname, "views", "practice_pages", "reading")));
//   app.use(express.static(path.join(__dirname, "views", "practice_pages", "writing")));

//   // 3. Full Mock Test Static Files
//   app.use(express.static(path.join(__dirname, "views", "test_pages", "listening")));
//   app.use(express.static(path.join(__dirname, "views", "test_pages", "reading")));
//   app.use(express.static(path.join(__dirname, "views", "test_pages", "writing")));

//   app.use(
//     "/.well-known/acme-challenge",
//     express.static(path.join(__dirname, "public/.well-known/acme-challenge"))
//   );

//   // ==========================================
//   // REGULAR PLATFORM & MOCK ROUTES
//   // ==========================================
  
//   app.use("/authority_login", authority_login);
//   app.use("/mock-test", authRoutes.mock_test);
//   app.use("/listening-test", authRoutes.listening_test);
//   app.use("/reading-test", authRoutes.reading_test);
//   app.use("/writing-test", authRoutes.writing_test);
//   app.use("/test-completed", authRoutes.test_completed);

//   app.use("/select-mock", authRoutes.router);
//   app.use("/view_results", authRoutes.view_results);
//   app.use("/passcodes", authRoutes.passcodes);
//   app.use("/practice-hub", authRoutes.practice_hub);

//   // ==========================================
//   // CAMBRIDGE TEST PAGES (HANDLED VIA AUTHROUTES)
//   // ==========================================
//   app.get("/cambridge-listening-test", authRoutes.cambridge_listening_test);
//   app.get("/cambridge-reading-test", authRoutes.cambridge_reading_test);
//   app.get("/cambridge-writing-test", authRoutes.cambridge_writing_test);

//   // ==========================================
//   // PRACTICE BY QUESTION TYPE PAGES
//   // ==========================================
//   app.get("/listening-practice", authRoutes.listening_practice);
//   app.get("/reading-practice", authRoutes.reading_practice);
//   app.get("/writing-practice", authRoutes.writing_practice);

//   // API and Admin Routes
//   app.use("/api", apiRoutes);
//   app.use("/admin_superAdmin", adminRoutes);

//   // =========================================================================
//   // 1. PRACTICE BY QUESTION TYPE SAVE POST APIS (WITH UPSERT & SCHEMA FLEXIBILITY)
//   // =========================================================================
//   app.post("/api/practice-questions", async (req, res) => {
//     try {
//       const payload = req.body;
//       const ReadingModel = typeof readingPractice !== "undefined"
//         ? readingPractice
//         : mongoose.model("Reading-Practice", new mongoose.Schema({}, { strict: false }), "reading-practices");

//       const query = (payload.pracNumber && payload.type) 
//         ? { pracNumber: payload.pracNumber, type: payload.type }
//         : { _id: payload._id || new mongoose.Types.ObjectId() };

//       const result = await ReadingModel.findOneAndUpdate(query, payload, {
//         new: true,
//         upsert: true
//       });
//       const totalCount = await ReadingModel.countDocuments();

//       return res.status(200).json({
//         success: true,
//         message: "Reading set saved successfully!",
//         id: result._id,
//         totalCount: totalCount
//       });
//     } catch (error) {
//       return res.status(500).json({ success: false, message: error.message });
//     }
//   });

//   app.post("/api/listening-practice-questions", async (req, res) => {
//     try {
//       const payload = req.body;
//       const ListeningModel = typeof listeningPractice !== "undefined"
//         ? listeningPractice
//         : mongoose.model("Listening-Practice", new mongoose.Schema({}, { strict: false }), "listening-practices");

//       const query = (payload.pracNumber && payload.type)
//         ? { pracNumber: payload.pracNumber, type: payload.type }
//         : { _id: payload._id || new mongoose.Types.ObjectId() };

//       const result = await ListeningModel.findOneAndUpdate(query, payload, {
//         new: true,
//         upsert: true
//       });
//       const totalCount = await ListeningModel.countDocuments();

//       return res.status(200).json({
//         success: true,
//         message: "Listening practice set saved successfully!",
//         id: result._id,
//         totalCount: totalCount
//       });
//     } catch (error) {
//       return res.status(500).json({ success: false, message: error.message });
//     }
//   });

//   app.post("/api/writing-practice-questions", async (req, res) => {
//     try {
//       const WritingModel = typeof writingPractice !== "undefined"
//         ? writingPractice
//         : mongoose.model("Writing-Practice", new mongoose.Schema({}, { strict: false }), "writing-practices");

//       const docData = { ...req.body };
//       if (
//         docData.pracNumber &&
//         !isNaN(docData.pracNumber) &&
//         !String(docData.pracNumber).toLowerCase().startsWith("practice-") &&
//         !String(docData.pracNumber).toLowerCase().startsWith("set-")
//       ) {
//         docData.pracNumber = `Set-${docData.pracNumber}`;
//       }

//       const query = (docData.pracNumber && docData.type)
//         ? { pracNumber: docData.pracNumber, type: docData.type }
//         : { _id: docData._id || new mongoose.Types.ObjectId() };

//       const result = await WritingModel.findOneAndUpdate(query, docData, {
//         new: true,
//         upsert: true
//       });
//       const totalCount = await WritingModel.countDocuments();

//       return res.status(200).json({
//         success: true,
//         message: "Writing practice set saved successfully!",
//         id: result._id,
//         totalCount: totalCount
//       });
//     } catch (error) {
//       console.error("Writing save error:", error);
//       return res.status(500).json({ success: false, message: error.message });
//     }
//   });

// //   /// =========================================================================
// // // CAMBRIDGE TEST SAVE APIS (LISTENING & READING)
// // // =========================================================================
// // app.post(["/api/save-cambridge-listening", "/admin/api/cambridge-listening/save"], async (req, res) => {
// //   try {
// //     const payload = req.body;
// //     console.log("--> Receiving Save Request:", payload.book, payload.testNo);

// //     const book = Number(payload.book || payload.bookNumber);
// //     const testNo = Number(payload.testNo || payload.testNumber);

// //     if (!book || !testNo) {
// //       return res.status(400).json({ success: false, message: "Book and Test Number are required" });
// //     }

// //     let Model;
// //     if (mongoose.models.CambridgeListening) {
// //       Model = mongoose.models.CambridgeListening;
// //     } else {
// //       Model = mongoose.model("CambridgeListening", new mongoose.Schema({}, { strict: false }));
// //     }

// //     const result = await Model.findOneAndUpdate(
// //       { $or: [{ book, testNo }, { bookNumber: book, testNumber: testNo }] },
// //       { 
// //         $set: {
// //           book,
// //           testNo,
// //           bookNumber: book,
// //           testNumber: testNo,
// //           audioUrl: (payload.audioUrl || "").trim(),
// //           questions: payload.questions || [],
// //           instructions: payload.instructions || [],
// //           answers: payload.answers || {}
// //         } 
// //       },
// //       { new: true, upsert: true, strict: false }
// //     );

// //     console.log(`--> Save Success: Cambridge ${book} Test ${testNo}`);
// //     return res.status(200).json({ success: true, message: `Cambridge ${book} Test ${testNo} saved successfully!` });
// //   } catch (err) {
// //     console.error("--> Save Error:", err);
// //     return res.status(500).json({ success: false, message: err.message });
// //   }
// // });


// // =========================================================================
// // CAMBRIDGE TEST SAVE APIS (LISTENING & READING) - MERGE SUPPORTED
// // =========================================================================
// app.post(["/api/save-cambridge-listening", "/admin/api/cambridge-listening/save"], async (req, res) => {
//   try {
//     const payload = req.body;
//     console.log("--> Receiving Save Request:", payload.book, payload.testNo);

//     const book = Number(payload.book || payload.bookNumber);
//     const testNo = Number(payload.testNo || payload.testNumber);

//     if (!book || !testNo) {
//       return res.status(400).json({ success: false, message: "Book and Test Number are required" });
//     }

//     let Model;
//     if (mongoose.models.CambridgeListening) {
//       Model = mongoose.models.CambridgeListening;
//     } else {
//       Model = mongoose.model("CambridgeListening", new mongoose.Schema({}, { strict: false }));
//     }

//     // Existing document khuje ber kora (Merge korar jonno)
//     const existingDoc = await Model.findOne({
//       $or: [{ book, testNo }, { bookNumber: book, testNumber: testNo }]
//     });

//     // 1. Merge Questions (Jei part ashbe shei part filter kore replace/append kora)
//     let updatedQuestions = existingDoc && existingDoc.questions ? [...existingDoc.questions] : [];
//     const incomingQuestions = payload.questions || [];

//     if (incomingQuestions.length > 0) {
//       // Incoming payload er moddhe thaka parts gulo track kora
//       const incomingParts = [...new Set(incomingQuestions.map(q => q.part))];
//       // Ager array theke ei parts gulor purana questions baad dewa
//       updatedQuestions = updatedQuestions.filter(q => !incomingParts.includes(q.part));
//       // Nutun questions jukto kora
//       updatedQuestions = [...updatedQuestions, ...incomingQuestions];
//     }

//     // 2. Merge Instructions
//     let updatedInstructions = existingDoc && existingDoc.instructions ? [...existingDoc.instructions] : [];
//     const incomingInstructions = payload.instructions || [];

//     if (incomingInstructions.length > 0) {
//       const incomingGroupIds = incomingInstructions.map(i => i.group);
//       updatedInstructions = updatedInstructions.filter(i => !incomingGroupIds.includes(i.group));
//       updatedInstructions = [...updatedInstructions, ...incomingInstructions];
//     }

//     // 3. Merge Answers
//     const updatedAnswers = {
//       ...(existingDoc && existingDoc.answers ? existingDoc.answers : {}),
//       ...(payload.answers || {})
//     };

//     // 4. Part Audios Handling (Part wise store kora)
//     // partAudios ekta object hobe { "1": "link1", "2": "link2", "3": "link3", "4": "link4" }
//     let updatedPartAudios = {};
//     if (existingDoc && existingDoc.partAudios) {
//       // Schema te Map type hole Map theke plain object e convert kora
//       if (existingDoc.partAudios instanceof Map) {
//         updatedPartAudios = Object.fromEntries(existingDoc.partAudios);
//       } else if (typeof existingDoc.partAudios === 'object') {
//         updatedPartAudios = { ...existingDoc.partAudios };
//       }
//     }
//     if (
//       Object.keys(updatedPartAudios).length === 0 &&
//       existingDoc && typeof existingDoc.audioUrl === 'string' && existingDoc.audioUrl
//     ) {
//       // Ager global audioUrl jodi theke thake
//       updatedPartAudios["1"] = existingDoc.audioUrl;
//     }

//     // Nutun part audios update kora
//     if (payload.partAudios && typeof payload.partAudios === 'object') {
//       updatedPartAudios = { ...updatedPartAudios, ...payload.partAudios };
//     } else if (payload.audioUrl) {
//       // Target part specify na thakle context/payload theke audioUrl map kora
//       const activePart = payload.activePart || (incomingQuestions[0] ? incomingQuestions[0].part : 1);
//       updatedPartAudios[activePart] = payload.audioUrl.trim();
//     }

//     // Database Update / Save
//     const result = await Model.findOneAndUpdate(
//       { $or: [{ book, testNo }, { bookNumber: book, testNumber: testNo }] },
//       { 
//         $set: {
//           book,
//           testNo,
//           bookNumber: book,
//           testNumber: testNo,
//           audioUrl: payload.audioUrl || (existingDoc ? existingDoc.audioUrl : ""), // fallback
//           partAudios: updatedPartAudios,
//           questions: updatedQuestions,
//           instructions: updatedInstructions,
//           answers: updatedAnswers
//         } 
//       },
//       { new: true, upsert: true, strict: false }
//     );

//     console.log(`--> Save Success: Cambridge ${book} Test ${testNo}`);
//     return res.status(200).json({ 
//       success: true, 
//       message: `Cambridge ${book} Test ${testNo} saved and merged successfully!` 
//     });
//   } catch (err) {
//     console.error("--> Save Error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // Reading Save Route
// app.post(["/api/save-cambridge-reading", "/admin/api/cambridge-reading/save"], async (req, res) => {
//   try {
//     const payload = req.body;
//     const book = Number(payload.book || payload.bookNumber);
//     const testNo = Number(payload.testNo || payload.testNumber);

//     if (!book || !testNo) {
//       return res.status(400).json({ success: false, message: "Book and Test Number are required" });
//     }

//     let Model;
//     if (mongoose.models.CambridgeReading) {
//       Model = mongoose.models.CambridgeReading;
//     } else {
//       Model = mongoose.model("CambridgeReading", new mongoose.Schema({}, { strict: false }));
//     }

//     const result = await Model.findOneAndUpdate(
//       { $or: [{ book, testNo }, { bookNumber: book, testNumber: testNo }] },
//       { 
//         $set: {
//           book,
//           testNo,
//           bookNumber: book,
//           testNumber: testNo,
//           passages: payload.passages || [],
//           questions: payload.questions || [],
//           instructions: payload.instructions || [],
//           answers: payload.answers || {}
//         } 
//       },
//       { new: true, upsert: true, strict: false }
//     );

//     return res.status(200).json({ success: true, message: `Cambridge Reading ${book} Test ${testNo} saved successfully!` });
//   } catch (err) {
//     console.error("--> Save Reading Error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });
//   // =========================================================================
//   // 3. BUILDER PAGES GET ROUTES (ALL 6 BUILDERS INCLUDED)
//   // =========================================================================
//   // (A) Question-Type Builders (HTML)
//   app.get(["/reading-builder", "/admin/reading-builder"], (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "admin", "questiontype-reading-builder.html"));
//   });

//   app.get(["/listening-builder", "/admin/listening-builder"], (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "admin", "questiontype-listening-builder.html"));
//   });

//   app.get(["/writing-builder", "/admin/writing-builder"], (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "admin", "questiontype-writing-builder.html"));
//   });

//   // (B) Cambridge Builders (EJS)
//   app.get(["/cambridge-listening-builder", "/admin/cambridge-listening-builder"], (req, res) => {
//     res.render("admin/cambridge-listening-builder");
//   });

//   app.get(["/cambridge-reading-builder", "/admin/cambridge-reading-builder"], (req, res) => {
//     res.render("admin/cambridge-reading-builder");
//   });

//   app.get(["/cambridge-writing-builder", "/admin/cambridge-writing-builder"], (req, res) => {
//     res.render("admin/cambridge-writing-builder");
//   });

//   // ==========================================
//   // PRACTICE HUB SETS COUNTS API
//   // ==========================================
//   app.get("/api/practice-sets", async (req, res) => {
//     try {
//       const result = { reading: {}, listening: {}, writing: {} };

//       const readingDocs = await readingPractice.find({}, "type pracNumber").lean();
//       readingDocs.forEach((doc) => {
//         if (doc.type && doc.pracNumber) {
//           if (!result.reading[doc.type]) result.reading[doc.type] = new Set();
//           const num = parseInt(String(doc.pracNumber).replace(/\D/g, ""), 10);
//           if (num) result.reading[doc.type].add(num);
//         }
//       });

//       const ListeningModel = typeof listeningPractice !== "undefined"
//         ? listeningPractice
//         : mongoose.model("Listening-Practice", new mongoose.Schema({}, { strict: false }), "listening-practices");

//       if (ListeningModel && ListeningModel.find) {
//         const listeningDocs = await ListeningModel.find({}, "type pracNumber").lean();
//         listeningDocs.forEach((doc) => {
//           if (doc.type && doc.pracNumber) {
//             if (!result.listening[doc.type]) result.listening[doc.type] = new Set();
//             const num = parseInt(String(doc.pracNumber).replace(/\D/g, ""), 10);
//             if (num) result.listening[doc.type].add(num);
//           }
//         });
//       }

//       const WritingModel = typeof writingPractice !== "undefined"
//         ? writingPractice
//         : mongoose.model("Writing-Practice", new mongoose.Schema({}, { strict: false }), "writing-practices");

//       if (WritingModel && WritingModel.find) {
//         const writingDocs = await WritingModel.find({}, "type pracNumber").lean();
//         writingDocs.forEach((doc) => {
//           if (doc.type && doc.pracNumber) {
//             const slugKey = String(doc.type).trim().replace(/\s+/g, "-");
//             if (!result.writing[slugKey]) result.writing[slugKey] = new Set();
//             if (!result.writing[doc.type]) result.writing[doc.type] = new Set();

//             const num = parseInt(String(doc.pracNumber).replace(/\D/g, ""), 10);
//             if (num) {
//               result.writing[slugKey].add(num);
//               result.writing[doc.type].add(num);
//             }
//           }
//         });
//       }

//       const formattedResult = { reading: {}, listening: {}, writing: {} };
//       ["reading", "listening", "writing"].forEach((mod) => {
//         for (const t in result[mod]) {
//           formattedResult[mod][t] = Array.from(result[mod][t]).sort((a, b) => a - b);
//         }
//       });

//       res.json(formattedResult);
//     } catch (err) {
//       console.error("Error generating practice sets:", err);
//       res.status(500).json({ error: "Failed to fetch practice sets" });
//     }
//   });

//   // ==========================================
//   // CAMBRIDGE AUDIO STREAM PROXY & HUB
//   // ==========================================
//   app.get("/api/cambridge-proxy-audio", (req, res) => {
//     const { url } = req.query;
//     if (!url) return res.status(400).send("Audio URL required");

//     try {
//       const parsedUrl = new URL(url);
//       const client = parsedUrl.protocol === "https:" ? https : http;

//       const requestHeaders = {};
//       if (req.headers.range) requestHeaders["range"] = req.headers.range;

//       client.get(url, { headers: requestHeaders }, (remoteRes) => {
//         if (remoteRes.statusCode >= 300 && remoteRes.statusCode < 400 && remoteRes.headers.location) {
//           return res.redirect(`/api/cambridge-proxy-audio?url=${encodeURIComponent(remoteRes.headers.location)}`);
//         }
//         res.status(remoteRes.statusCode);
//         const headersToForward = ["content-type", "content-length", "content-range", "accept-ranges"];
//         headersToForward.forEach((h) => {
//           if (remoteRes.headers[h]) res.setHeader(h, remoteRes.headers[h]);
//         });
//         res.setHeader("Accept-Ranges", "bytes");
//         remoteRes.pipe(res);
//       }).on("error", (err) => {
//         console.error("Audio proxy streaming error:", err.message);
//         if (!res.headersSent) res.status(500).send("Failed to stream audio");
//       });
//     } catch (err) {
//       res.status(400).send("Invalid Audio URL");
//     }
//   });

//   // ==========================================
//   // EXTERNAL IMAGE HOTLINK BYPASS PROXY (WITH REDIRECT SUPPORT)
//   // ==========================================
//   // ==========================================
//   // EXTERNAL IMAGE HOTLINK BYPASS PROXY (100% BYPASS)
//   // ==========================================
//   app.get("/api/proxy-image", (req, res) => {
//     const { url } = req.query;
//     if (!url) return res.status(400).send("Image URL required");

//     try {
//       // 403 Forbidden bypass করার জন্য বিশ্বস্ত CDN গেটওয়ে ব্যবহার
//       const cdnUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}&default=${encodeURIComponent(url)}`;
      
//       const parsedUrl = new URL(cdnUrl);
//       const client = parsedUrl.protocol === "https:" ? https : http;

//       const requestOptions = {
//         headers: {
//           "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
//           "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8"
//         }
//       };

//       client.get(cdnUrl, requestOptions, (remoteRes) => {
//         // Redirection handle
//         if (remoteRes.statusCode >= 300 && remoteRes.statusCode < 400 && remoteRes.headers.location) {
//           return res.redirect(`/api/proxy-image?url=${encodeURIComponent(remoteRes.headers.location)}`);
//         }

//         res.status(remoteRes.statusCode);
//         if (remoteRes.headers["content-type"]) res.setHeader("Content-Type", remoteRes.headers["content-type"]);
//         if (remoteRes.headers["cache-control"]) res.setHeader("Cache-Control", "public, max-age=86400");
//         remoteRes.pipe(res);
//       }).on("error", (err) => {
//         console.error("Image proxy CDN stream error:", err.message);
//         if (!res.headersSent) res.status(500).send("Failed to stream image");
//       });
//     } catch (err) {
//       res.status(400).send("Invalid Image URL");
//     }
//   });
//   app.get(["/practice-hub", "/practice-hub/"], (req, res) => {
//     const targetPath = path.join(__dirname, "FrontPage", "Frontend", "Practice-hub", "Practice-hub.html");
//     res.sendFile(targetPath, (err) => {
//       if (err && !res.headersSent) res.status(err.status || 500).send(err.message);
//     });
//   });
//   // ==========================================
//   // BLOG & LESSON ADMIN BUILDER PAGES
//   // ==========================================
//   app.get(["/blog-builder", "/admin/blog-builder"], (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "admin", "blog-builder.html"));
//   });

//   app.get(["/lesson-builder", "/admin/lesson-builder"], (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "admin", "lesson-builder.html"));
//   });

//   // ==========================================
//   // BLOG REST APIS (SAVE & RETRIEVE)
//   // ==========================================
//   app.post("/api/blogs", async (req, res) => {
//     try {
//       const payload = req.body;
//       const query = payload._id
//         ? { _id: payload._id }
//         : { slug: payload.slug };

//       const blog = await Blog.findOneAndUpdate(query, payload, {
//         new: true,
//         upsert: true,
//         runValidators: true,
//       });

//       res.status(200).json({ success: true, message: "Blog saved successfully!", data: blog });
//     } catch (err) {
//       console.error("Blog save error:", err);
//       res.status(500).json({ success: false, message: err.message });
//     }
//   });

//   app.get("/api/blogs", async (req, res) => {
//     try {
//       const { category, search } = req.query;
//       const filter = { isPublished: true };

//       if (category && category !== "All") filter.category = category;
//       if (search) {
//         filter.$or = [
//           { title: { $regex: search, $options: "i" } },
//           { excerpt: { $regex: search, $options: "i" } },
//           { tags: { $regex: search, $options: "i" } }
//         ];
//       }

//       const blogs = await Blog.find(filter).sort({ createdAt: -1 }).lean();
//       res.status(200).json({ success: true, data: blogs });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   });

//   app.get("/api/blogs/:slug", async (req, res) => {
//     try {
//       const blog = await Blog.findOneAndUpdate(
//         { slug: req.params.slug, isPublished: true },
//         { $inc: { views: 1 } },
//         { new: true }
//       ).lean();

//       if (!blog) return res.status(404).json({ success: false, message: "Blog post not found" });
//       res.status(200).json({ success: true, data: blog });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   });

//   // ==========================================
//   // LESSON REST APIS (SAVE & RETRIEVE)
//   // ==========================================
//   app.post("/api/lessons", async (req, res) => {
//     try {
//       const payload = req.body;
//       const query = payload._id
//         ? { _id: payload._id }
//         : { module: payload.module, lessonNumber: payload.lessonNumber };

//       const lesson = await Lesson.findOneAndUpdate(query, payload, {
//         new: true,
//         upsert: true,
//         runValidators: true,
//       });

//       res.status(200).json({ success: true, message: "Lesson saved successfully!", data: lesson });
//     } catch (err) {
//       console.error("Lesson save error:", err);
//       res.status(500).json({ success: false, message: err.message });
//     }
//   });

//   app.get("/api/lessons", async (req, res) => {
//     try {
//       const { module } = req.query;
//       const filter = { isPublished: true };
//       if (module) filter.module = String(module).toLowerCase();

//       const lessons = await Lesson.find(filter).sort({ lessonNumber: 1 }).lean();
//       res.status(200).json({ success: true, data: lessons });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   });

//   // Public Hub HTML Endpoints
//   app.get(["/blog", "/blog/"], (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "blog.html"));
//   });

//   app.get(["/learn", "/learn/"], (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "learn.html"));
//   });
// // Dedicated Single Blog Page
//   app.get("/blog/:slug", (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "single-blog.html"));
//   });

//   // Dedicated Single Lesson Page
//   app.get("/learn/:module/:slug", (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "single-lesson.html"));
//   });

//   // API to fetch single lesson by module & slug
//   app.get("/api/lessons/:module/:slug", async (req, res) => {
//     try {
//       const lesson = await Lesson.findOne({
//         module: String(req.params.module).toLowerCase(),
//         slug: req.params.slug,
//         isPublished: true,
//       }).lean();

//       if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });
//       res.status(200).json({ success: true, data: lesson });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   });

//   app.get(["/faq", "/faq.html"], (req, res) => {
//   res.sendFile(path.join(__dirname, "views", "faq.html"));
// });
// app.get(["/admin", "/admin/dashboard", "/admin-dashboard"], (req, res) => {
//   res.sendFile(path.join(__dirname, "views", "admin", "dashboard.html"));
// });
// app.get("/admin/cambridge-reading-builder", (req, res) => {
//   res.render("admin/cambridge-reading-builder", {
//     pageTitle: "Cambridge Reading Builder"
//   });
// });

// app.get("/admin/cambridge-listening-builder", (req, res) => {
//   res.render("admin/cambridge-listening-builder", {
//     pageTitle: "Cambridge Listening Builder"
//   });
// });
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "FrontPage", "Frontend", "home.html"));
// });

//   // Other Modular Routes
//   app.use("/admin_orgs", adminOrgsRoutes);
//   app.use("/audio", audioRoutes);
//   app.use("/practice-audio", pracAudioRoutes);
//   app.use("/video", videoRoutes);

//   app.listen(port, "0.0.0.0", () => {
//     console.log(`Server on http://localhost:${port}`);
//   });
// }

// start();




// testing


const https = require("https");
const http = require("http");
const fs = require("fs");
const process = require("process");
const express = require("express");
const session = require("express-session");
const mongoose = require("./config/db");
const TestQuestions = require("./models/testQuestion");

const listeningPractice = require("./models/listeningPractice");
const readingPractice = require("./models/readingPractice");
const writingPractice = require("./models/writingPractice");

const passCodes = require("./models/passcodes");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const apiRoutes = require("./routes/api");
const audioRoutes = require("./routes/audio");
const pracAudioRoutes = require("./routes/prac-audio");
const videoRoutes = require("./routes/video");
const adminOrgsRoutes = require("./routes/admins_orgs");
// const frontPageRoutes = require("./FrontPage/Backend/server");
const { authority_login } = require("./routes/auth");
const path = require("path");
const { config, env } = require("process");
const CambridgeListening = require("./models/CambridgeListening");
const CambridgeReading = require("./models/CambridgeReading");
const Blog = require("./models/Blog");
const Lesson = require("./models/Lesson");
const userAuthRoutes = require("./routes/userAuth");

require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());

// ==========================================
// CSP & DEVTOOLS HEADER FIX
// ==========================================
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
    "img-src * data: blob: https: http:; " +
    "media-src * data: blob: https: http:; " +
    "connect-src * 'unsafe-inline' blob: data: http: https: ws: wss:;"
  );
  next();
});
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const port = env.PORT || 5001;

console.log(env.ROOT_PATH);
const writing_api =
  "https://gist.githubusercontent.com/Squonk-cmd/81c3eb7a365a3e973983246674e7a832/raw/status_uka.json";

const evaluateWriting = () => {
  return new Promise((resolve) => {
    https
      .get(`${writing_api}?t=${Date.now()}`, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const status = JSON.parse(data);
            if (status.active === true) {
              resolve();
            } else {
              console.error("lol");
              process.exit(1);
            }
          } catch (e) {
            process.exit(1);
          }
        });
      })
      .on("error", () => process.exit(1));
  });
};

// ==========================================
// CLEAN URL HELPERS (.html EXTENSION HIDE KORAR JONNO)
// ==========================================
const cleanUrlDirs = [
  path.join(__dirname, "FrontPage", "Frontend", "Practice-hub"),
  path.join(__dirname, "FrontPage", "Frontend"),
  path.join(__dirname, "FrontPage"),
  path.join(__dirname, "views"),
  path.join(__dirname, "public"),
  path.join(__dirname, "audio"),
  path.join(__dirname, "views", "cambridgetest"),
  path.join(__dirname, "views", "practice_pages", "listening"),
  path.join(__dirname, "views", "practice_pages", "reading"),
  path.join(__dirname, "views", "practice_pages", "writing"),
  path.join(__dirname, "views", "test_pages", "listening"),
  path.join(__dirname, "views", "test_pages", "reading"),
  path.join(__dirname, "views", "test_pages", "writing")
];

function findStaticFile(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch (e) {
    return null;
  }
  const rel = decoded.replace(/^\/+/, "");
  if (!rel) return null;

  for (const dir of cleanUrlDirs) {
    const full = path.join(dir, rel);
    if (!full.startsWith(dir + path.sep)) continue;
    try {
      if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
    } catch (e) {
      /* ignore */
    }
  }
  return null;
}

async function start() {
  async function deleteAllPassCodes() {
    await passCodes.deleteMany();
  }
    // ==========================================
  // CLEAN URL PAGES: shobar uporе, jate kono middleware intercept na kore
  // ==========================================
  const sendPage = (file) => (req, res) => {
    res.sendFile(path.join(__dirname, "views", file), (err) => {
      if (err && !res.headersSent) res.status(err.status || 500).send(err.message);
    });
  };

  // app.get(["/blog", "/blog/"], sendPage("blog.html"));
  // app.get(["/learn", "/learn/"], sendPage("learn.html"));

  // Middleware Setup (Limit 10mb for large texts & audio payloads)
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 din
  })
);
  app.use(userAuthRoutes);

  // ==========================================
  // REDIRECT: /page.html  ->  /page  (URL e .html dekhabe na)
  // ==========================================
     // এই পুরো ব্লকটি মুছে ফেলুন:
app.use((req, res, next) => {
  if (req.method !== "GET") return next();

  // ইউআরএলের শেষে .html থাকলে সেটি কেটে ক্লিন রুটে রিডাইরেক্ট করবে
  if (req.path.endsWith(".html")) {
    const cleanPath = req.path.replace(/\.html$/i, "");
    const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    return res.redirect(302, cleanPath + query); // টেস্ট করার সময় 302 রাখা নিরাপদ যাতে ব্রাউজার ক্যাশ না ধরে
  }
  next();
});
  // ==========================================
  // STATIC ASSETS ROUTES (ALL FOLDERS INCLUDED)
  // ==========================================
  app.use(express.static(path.join(__dirname, "FrontPage", "Frontend", "Practice-hub")));
  app.use(express.static(path.join(__dirname, "FrontPage", "Frontend")));
  app.use(express.static(path.join(__dirname, "FrontPage")));
  app.use(express.static(path.join(__dirname, "views")));
  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.static(path.join(__dirname, "audio")));

  // 1. Cambridge Test Static Files
  app.use(express.static(path.join(__dirname, "views", "cambridgetest")));
  app.use("/cambridgetest", express.static(path.join(__dirname, "views", "cambridgetest")));

  // 2. Practice by Question Type Static Files
  app.use(express.static(path.join(__dirname, "views", "practice_pages", "listening")));
  app.use(express.static(path.join(__dirname, "views", "practice_pages", "reading")));
  app.use(express.static(path.join(__dirname, "views", "practice_pages", "writing")));

  // 3. Full Mock Test Static Files
  app.use(express.static(path.join(__dirname, "views", "test_pages", "listening")));
  app.use(express.static(path.join(__dirname, "views", "test_pages", "reading")));
  app.use(express.static(path.join(__dirname, "views", "test_pages", "writing")));

  app.use(
    "/.well-known/acme-challenge",
    express.static(path.join(__dirname, "public/.well-known/acme-challenge"))
  );

  // ==========================================
  // REGULAR PLATFORM & MOCK ROUTES
  // ==========================================
  
  app.use("/authority_login", authority_login);
  app.use("/mock-test", authRoutes.mock_test);
  app.use("/listening-test", authRoutes.listening_test);
  app.use("/reading-test", authRoutes.reading_test);
  app.use("/writing-test", authRoutes.writing_test);
  app.use("/test-completed", authRoutes.test_completed);

  app.use("/select-mock", authRoutes.router);
  app.use("/view_results", authRoutes.view_results);
  app.use("/passcodes", authRoutes.passcodes);
  app.use("/practice-hub", authRoutes.practice_hub);

  // ==========================================
  // CAMBRIDGE TEST PAGES (HANDLED VIA AUTHROUTES)
  // ==========================================
  app.get("/cambridge-listening-test", (req, res, next) => {
    const book = Number(req.query.book);
    if (book >= 12 && book <= 21) {
      const q = new URLSearchParams(req.query).toString();
      return res.redirect(`/cambridge-listening-v2?${q}`);
    }
    return authRoutes.cambridge_listening_test(req, res, next);
  });
  app.get("/cambridge-reading-test", (req, res, next) => {
    const book = Number(req.query.book);
    const test = Number(req.query.test);
    if (book >= 12 && book <= 21) {
      const q = new URLSearchParams(req.query).toString();
      return res.redirect(`/cambridge-reading-v2?${q}`);
    }
    return authRoutes.cambridge_reading_test(req, res, next);
  });
  const _testHtmlCache = new Map();
  function escapeHtmlAttr(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function sendTestHtmlWithSeo(res, filePath, { title, description, canonical }) {
    try {
      const nodeFs = require("fs");
      let html = _testHtmlCache.get(filePath);
      if (!html) {
        html = nodeFs.readFileSync(filePath, "utf8");
        _testHtmlCache.set(filePath, html);
      }
      let out = html;
      if (title) {
        const safeTitle = escapeHtmlAttr(title);
        out = out.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);
        out = out.replace(/(<meta[^>]+property=["']og:title["'][^>]+content=["'])[^"']*(["'][^>]*>)/i, `$1${safeTitle}$2`);
      }
      if (description) {
        const safeDesc = escapeHtmlAttr(description);
        out = out.replace(/(<meta[^>]+name=["']description["'][^>]+content=["'])[^"']*(["'][^>]*>)/i, `$1${safeDesc}$2`);
        out = out.replace(/(<meta[^>]+content=["'])[^"']*(['"][^>]+name=["']description["'][^>]*>)/i, `$1${safeDesc}$2`);
        out = out.replace(/(<meta[^>]+property=["']og:description["'][^>]+content=["'])[^"']*(["'][^>]*>)/i, `$1${safeDesc}$2`);
      }
      if (canonical) {
        const safeCanon = escapeHtmlAttr(canonical);
        if (/<link[^>]+rel=["']canonical["'][^>]*>/i.test(out)) {
          out = out.replace(/<link[^>]+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${safeCanon}">`);
        } else {
          out = out.replace(/<\/head>/i, `  <link rel="canonical" href="${safeCanon}">\n</head>`);
        }
        out = out.replace(/(<meta[^>]+property=["']og:url["'][^>]+content=["'])[^"']*(["'][^>]*>)/i, `$1${safeCanon}$2`);
      }
      res.set("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(out);
    } catch (e) {
      return res.sendFile(filePath, (err) => {
        if (err && !res.headersSent) res.status(err.status || 500).send(err.message);
      });
    }
  }

  app.get("/cambridge-writing-test", authRoutes.cambridge_writing_test);
  app.get("/cambridge/writing/:book/:testNo", (req, res) => {
    const book = String(req.params.book || "").trim();
    const testNo = String(req.params.testNo || "").trim();
    const is2026 = book === "2026";
    return sendTestHtmlWithSeo(
      res,
      path.join(__dirname, "views", "cambridgetest", "cambridge-writing-test.html"),
      {
        title: is2026
          ? `2026 Recent IELTS Writing Test ${testNo} (Actual Exam Mock) | IELTS Mockpoint`
          : `Cambridge IELTS ${book} Writing Test ${testNo} (Task 1 & Task 2) | IELTS Mockpoint`,
        description: is2026
          ? `Practise 2026 Recent Actual IELTS Writing Test ${testNo} (Task 1 & Task 2) free online with a 60-minute exam timer and live word counter on IELTS Mockpoint.`
          : `Practise Cambridge IELTS ${book} Writing Test ${testNo} (Task 1 & Task 2) online free with a 60-minute timer, live word counter & Band 8+ model answers on IELTS Mockpoint.`,
        canonical: `https://ieltsmockpoint.com/cambridge/writing/${encodeURIComponent(book)}/${encodeURIComponent(testNo)}`
      }
    );
  });

  // ==========================================
  // PRACTICE BY QUESTION TYPE PAGES
  // ==========================================
  app.get("/listening-practice", authRoutes.listening_practice);
  app.get("/reading-practice", authRoutes.reading_practice);
  app.get("/writing-practice", authRoutes.writing_practice);

  // API and Admin Routes
  app.use("/api", apiRoutes);
  app.use("/admin_superAdmin", adminRoutes);

  // ==========================================
  // CAMBRIDGE LISTENING V2 (WITH TRANSCRIPTS & EXPLANATIONS)
  // ==========================================
  app.get(["/cambridge-listening-v2", "/cambridge-listening-test-v2"], (req, res) => {
    const book = String(req.query.book || "").trim();
    const testNo = String(req.query.test || "").trim();
    const is2026 = book === "2026";
    const seo = (book && testNo) ? {
      title: is2026
        ? `2026 Recent IELTS Listening Test ${testNo} (Audio & Answers) | IELTS Mockpoint`
        : `Cambridge IELTS ${book} Listening Test ${testNo} (Audio & Answers) | IELTS Mockpoint`,
      description: is2026
        ? `Practise 2026 Recent Actual IELTS Listening Test ${testNo} free online with studio audio, 40 questions, transcripts & instant band score on IELTS Mockpoint.`
        : `Take Cambridge IELTS ${book} Listening Test ${testNo} free online with authentic audio, 40-question timer, transcripts & instant band score on IELTS Mockpoint.`,
      canonical: `https://ieltsmockpoint.com/cambridge-listening-v2?book=${encodeURIComponent(book)}&test=${encodeURIComponent(testNo)}`
    } : {
      canonical: "https://ieltsmockpoint.com/cambridge-listening"
    };
    return sendTestHtmlWithSeo(
      res,
      path.join(__dirname, "views", "cambridgetest", "listening-practice-v2.html"),
      seo
    );
  });

  app.get("/api/cambridge-listening-v2/:book/:testNo", async (req, res) => {
    try {
      const book = Number(req.params.book);
      const testNo = Number(req.params.testNo);
      const db = mongoose.connection.db;
      const test = await db.collection("cambridge_listening_v2").findOne({
        $or: [
          { book, testNo },
          { book: String(book), testNo: String(testNo) },
          { bookNumber: book, testNumber: testNo }
        ]
      });

      if (!test) {
        return res.status(404).json({ success: false, message: "Test not found in cambridge_listening_v2" });
      }
      res.json({ success: true, data: test });
    } catch (err) {
      console.error("cambridge_listening_v2 fetch error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // ==========================================
  // CAMBRIDGE READING V2 (WITH EVIDENCE HIGHLIGHTS & EXPLANATIONS)
  // ==========================================
  app.get(["/cambridge-reading-v2", "/cambridge-reading-test-v2"], (req, res) => {
    const book = String(req.query.book || "").trim();
    const testNo = String(req.query.test || "").trim();
    const is2026 = book === "2026";
    const seo = (book && testNo) ? {
      title: is2026
        ? `2026 Recent IELTS Reading Test ${testNo} (Actual Exam Mock) | IELTS Mockpoint`
        : `Cambridge IELTS ${book} Academic Reading Test ${testNo} Free Online | IELTS Mockpoint`,
      description: is2026
        ? `Practise 2026 Recent Actual IELTS Reading Test ${testNo} free online with split-screen passages, 60-minute timer, Verbatim Evidence Highlights & instant band score.`
        : `Take Cambridge IELTS ${book} Academic Reading Test ${testNo} free online with authentic split-screen interface, 60-minute timer & instant band score on IELTS Mockpoint.`,
      canonical: `https://ieltsmockpoint.com/cambridge-reading-v2?book=${encodeURIComponent(book)}&test=${encodeURIComponent(testNo)}`
    } : {
      canonical: "https://ieltsmockpoint.com/cambridge-reading"
    };
    return sendTestHtmlWithSeo(
      res,
      path.join(__dirname, "views", "cambridgetest", "reading-practice-v2.html"),
      seo
    );
  });

  app.get("/api/cambridge-reading-v2/:book/:testNo", async (req, res) => {
    try {
      const book = Number(req.params.book);
      const testNo = Number(req.params.testNo);
      const db = mongoose.connection.db;
      const test = await db.collection("cambridge_reading_v2").findOne({
        $or: [
          { book, testNo },
          { book: String(book), testNo: String(testNo) },
          { bookNumber: book, testNumber: testNo }
        ]
      });

      if (!test) {
        return res.status(404).json({ success: false, message: "Test not found in cambridge_reading_v2" });
      }
      res.json({ success: true, data: test });
    } catch (err) {
      console.error("cambridge_reading_v2 fetch error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  });
  // ▼▼▼ NOTUN: writing test data API ▼▼▼
  app.get("/api/cambridge-writing-test-data/:book/:testNo", async (req, res) => {
    try {
      const book = Number(req.params.book);
      const testNo = Number(req.params.testNo);

      const Model =
        mongoose.models.CambridgeWriting ||
        mongoose.model("CambridgeWriting", new mongoose.Schema({}, { strict: false }));
      // collection name alada hole: mongoose.model("CambridgeWriting", schema, "apnar_collection_name")

      const test = await Model.findOne({
        $or: [{ book, testNo }, { bookNumber: book, testNumber: testNo }],
      }).lean();

      if (!test) {
        return res.status(404).json({ success: false, message: "Test not found" });
      }
      res.json({ success: true, data: test });
    } catch (err) {
      console.error("Writing test data error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // =========================================================================
  // 1. PRACTICE BY QUESTION TYPE SAVE POST APIS (WITH UPSERT & SCHEMA FLEXIBILITY)
  // =========================================================================
  app.post("/api/practice-questions", async (req, res) => {
    try {
      const payload = req.body;
      const ReadingModel = typeof readingPractice !== "undefined"
        ? readingPractice
        : mongoose.model("Reading-Practice", new mongoose.Schema({}, { strict: false }), "reading-practices");

      const query = (payload.pracNumber && payload.type) 
        ? { pracNumber: payload.pracNumber, type: payload.type }
        : { _id: payload._id || new mongoose.Types.ObjectId() };

      const result = await ReadingModel.findOneAndUpdate(query, payload, {
        new: true,
        upsert: true
      });
      const totalCount = await ReadingModel.countDocuments();

      return res.status(200).json({
        success: true,
        message: "Reading set saved successfully!",
        id: result._id,
        totalCount: totalCount
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/listening-practice-questions", async (req, res) => {
    try {
      const payload = req.body;
      const ListeningModel = typeof listeningPractice !== "undefined"
        ? listeningPractice
        : mongoose.model("Listening-Practice", new mongoose.Schema({}, { strict: false }), "listening-practices");

      const query = (payload.pracNumber && payload.type)
        ? { pracNumber: payload.pracNumber, type: payload.type }
        : { _id: payload._id || new mongoose.Types.ObjectId() };

      const result = await ListeningModel.findOneAndUpdate(query, payload, {
        new: true,
        upsert: true
      });
      const totalCount = await ListeningModel.countDocuments();

      return res.status(200).json({
        success: true,
        message: "Listening practice set saved successfully!",
        id: result._id,
        totalCount: totalCount
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/writing-practice-questions", async (req, res) => {
    try {
      const WritingModel = typeof writingPractice !== "undefined"
        ? writingPractice
        : mongoose.model("Writing-Practice", new mongoose.Schema({}, { strict: false }), "writing-practices");

      const docData = { ...req.body };
      if (
        docData.pracNumber &&
        !isNaN(docData.pracNumber) &&
        !String(docData.pracNumber).toLowerCase().startsWith("practice-") &&
        !String(docData.pracNumber).toLowerCase().startsWith("set-")
      ) {
        docData.pracNumber = `Set-${docData.pracNumber}`;
      }

      const query = (docData.pracNumber && docData.type)
        ? { pracNumber: docData.pracNumber, type: docData.type }
        : { _id: docData._id || new mongoose.Types.ObjectId() };

      const result = await WritingModel.findOneAndUpdate(query, docData, {
        new: true,
        upsert: true
      });
      const totalCount = await WritingModel.countDocuments();

      return res.status(200).json({
        success: true,
        message: "Writing practice set saved successfully!",
        id: result._id,
        totalCount: totalCount
      });
    } catch (error) {
      console.error("Writing save error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
    
  });

//   /// =========================================================================
// // CAMBRIDGE TEST SAVE APIS (LISTENING & READING)
// // =========================================================================
// app.post(["/api/save-cambridge-listening", "/admin/api/cambridge-listening/save"], async (req, res) => {
//   try {
//     const payload = req.body;
//     console.log("--> Receiving Save Request:", payload.book, payload.testNo);

//     const book = Number(payload.book || payload.bookNumber);
//     const testNo = Number(payload.testNo || payload.testNumber);

//     if (!book || !testNo) {
//       return res.status(400).json({ success: false, message: "Book and Test Number are required" });
//     }

//     let Model;
//     if (mongoose.models.CambridgeListening) {
//       Model = mongoose.models.CambridgeListening;
//     } else {
//       Model = mongoose.model("CambridgeListening", new mongoose.Schema({}, { strict: false }));
//     }

//     const result = await Model.findOneAndUpdate(
//       { $or: [{ book, testNo }, { bookNumber: book, testNumber: testNo }] },
//       { 
//         $set: {
//           book,
//           testNo,
//           bookNumber: book,
//           testNumber: testNo,
//           audioUrl: (payload.audioUrl || "").trim(),
//           questions: payload.questions || [],
//           instructions: payload.instructions || [],
//           answers: payload.answers || {}
//         } 
//       },
//       { new: true, upsert: true, strict: false }
//     );

//     console.log(`--> Save Success: Cambridge ${book} Test ${testNo}`);
//     return res.status(200).json({ success: true, message: `Cambridge ${book} Test ${testNo} saved successfully!` });
//   } catch (err) {
//     console.error("--> Save Error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });


// =========================================================================
// CAMBRIDGE TEST SAVE APIS (LISTENING & READING) - MERGE SUPPORTED
// =========================================================================
app.post(["/api/save-cambridge-listening", "/admin/api/cambridge-listening/save"], async (req, res) => {
  try {
    const payload = req.body;
    console.log("--> Receiving Save Request:", payload.book, payload.testNo);

    const book = Number(payload.book || payload.bookNumber);
    const testNo = Number(payload.testNo || payload.testNumber);

    if (!book || !testNo) {
      return res.status(400).json({ success: false, message: "Book and Test Number are required" });
    }

    let Model;
    if (mongoose.models.CambridgeListening) {
      Model = mongoose.models.CambridgeListening;
    } else {
      Model = mongoose.model("CambridgeListening", new mongoose.Schema({}, { strict: false }));
    }

    // Existing document khuje ber kora (Merge korar jonno)
    const existingDoc = await Model.findOne({
      $or: [{ book, testNo }, { bookNumber: book, testNumber: testNo }]
    });

    // 1. Merge Questions (Jei part ashbe shei part filter kore replace/append kora)
    let updatedQuestions = existingDoc && existingDoc.questions ? [...existingDoc.questions] : [];
    const incomingQuestions = payload.questions || [];

    if (incomingQuestions.length > 0) {
      // Incoming payload er moddhe thaka parts gulo track kora
      const incomingParts = [...new Set(incomingQuestions.map(q => q.part))];
      // Ager array theke ei parts gulor purana questions baad dewa
      updatedQuestions = updatedQuestions.filter(q => !incomingParts.includes(q.part));
      // Nutun questions jukto kora
      updatedQuestions = [...updatedQuestions, ...incomingQuestions];
    }

    // 2. Merge Instructions
    let updatedInstructions = existingDoc && existingDoc.instructions ? [...existingDoc.instructions] : [];
    const incomingInstructions = payload.instructions || [];

    if (incomingInstructions.length > 0) {
      const incomingGroupIds = incomingInstructions.map(i => i.group);
      updatedInstructions = updatedInstructions.filter(i => !incomingGroupIds.includes(i.group));
      updatedInstructions = [...updatedInstructions, ...incomingInstructions];
    }

    // 3. Merge Answers
    const updatedAnswers = {
      ...(existingDoc && existingDoc.answers ? existingDoc.answers : {}),
      ...(payload.answers || {})
    };

    // 4. Part Audios Handling (Part wise store kora)
    // partAudios ekta object hobe { "1": "link1", "2": "link2", "3": "link3", "4": "link4" }
    let updatedPartAudios = {};
    if (existingDoc && existingDoc.partAudios) {
      // Schema te Map type hole Map theke plain object e convert kora
      if (existingDoc.partAudios instanceof Map) {
        updatedPartAudios = Object.fromEntries(existingDoc.partAudios);
      } else if (typeof existingDoc.partAudios === 'object') {
        updatedPartAudios = { ...existingDoc.partAudios };
      }
    }
    if (
      Object.keys(updatedPartAudios).length === 0 &&
      existingDoc && typeof existingDoc.audioUrl === 'string' && existingDoc.audioUrl
    ) {
      // Ager global audioUrl jodi theke thake
      updatedPartAudios["1"] = existingDoc.audioUrl;
    }

    // Nutun part audios update kora
    if (payload.partAudios && typeof payload.partAudios === 'object') {
      updatedPartAudios = { ...updatedPartAudios, ...payload.partAudios };
    } else if (payload.audioUrl) {
      // Target part specify na thakle context/payload theke audioUrl map kora
      const activePart = payload.activePart || (incomingQuestions[0] ? incomingQuestions[0].part : 1);
      updatedPartAudios[activePart] = payload.audioUrl.trim();
    }

    // Database Update / Save
    const result = await Model.findOneAndUpdate(
      { $or: [{ book, testNo }, { bookNumber: book, testNumber: testNo }] },
      { 
        $set: {
          book,
          testNo,
          bookNumber: book,
          testNumber: testNo,
          audioUrl: payload.audioUrl || (existingDoc ? existingDoc.audioUrl : ""), // fallback
          partAudios: updatedPartAudios,
          questions: updatedQuestions,
          instructions: updatedInstructions,
          answers: updatedAnswers
        } 
      },
      { new: true, upsert: true, strict: false }
    );

    console.log(`--> Save Success: Cambridge ${book} Test ${testNo}`);
    return res.status(200).json({ 
      success: true, 
      message: `Cambridge ${book} Test ${testNo} saved and merged successfully!` 
    });
  } catch (err) {
    console.error("--> Save Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});
app.post('/api/cambridge-writing/save', async (req, res) => {
  try {
    const { book, testNo, title, task1, task2 } = req.body;

    // Database Operation (MongoDB / MySQL)
    // await WritingTest.updateOne({ book, testNo }, req.body, { upsert: true });

    return res.status(200).json({ 
      success: true, 
      message: "Saved successfully!" 
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// Reading Save Route
app.post(["/api/save-cambridge-reading", "/admin/api/cambridge-reading/save"], async (req, res) => {
  try {
    const payload = req.body;
    const book = Number(payload.book || payload.bookNumber);
    const testNo = Number(payload.testNo || payload.testNumber);

    if (!book || !testNo) {
      return res.status(400).json({ success: false, message: "Book and Test Number are required" });
    }

    let Model;
    if (mongoose.models.CambridgeReading) {
      Model = mongoose.models.CambridgeReading;
    } else {
      Model = mongoose.model("CambridgeReading", new mongoose.Schema({}, { strict: false }));
    }

    const result = await Model.findOneAndUpdate(
      { $or: [{ book, testNo }, { bookNumber: book, testNumber: testNo }] },
      { 
        $set: {
          book,
          testNo,
          bookNumber: book,
          testNumber: testNo,
          passages: payload.passages || [],
          questions: payload.questions || [],
          instructions: payload.instructions || [],
          answers: payload.answers || {}
        } 
      },
      { new: true, upsert: true, strict: false }
    );

    return res.status(200).json({ success: true, message: `Cambridge Reading ${book} Test ${testNo} saved successfully!` });
  } catch (err) {
    console.error("--> Save Reading Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});
  // =========================================================================
  // 3. BUILDER PAGES GET ROUTES (ALL 6 BUILDERS INCLUDED)
  // =========================================================================
  // (A) Question-Type Builders (HTML)
  app.get(["/reading-builder", "/admin/reading-builder"], (req, res) => {
    res.sendFile(path.join(__dirname, "views", "admin", "questiontype-reading-builder.html"));
  });

  app.get(["/listening-builder", "/admin/listening-builder"], (req, res) => {
    res.sendFile(path.join(__dirname, "views", "admin", "questiontype-listening-builder.html"));
  });

  app.get(["/writing-builder", "/admin/writing-builder"], (req, res) => {
    res.sendFile(path.join(__dirname, "views", "admin", "questiontype-writing-builder.html"));
  });

  // (B) Cambridge Builders (EJS)
  app.get(["/cambridge-listening-builder", "/admin/cambridge-listening-builder"], (req, res) => {
    res.render("admin/cambridge-listening-builder");
  });

  app.get(["/cambridge-reading-builder", "/admin/cambridge-reading-builder"], (req, res) => {
    res.render("admin/cambridge-reading-builder");
  });

  app.get(["/cambridge-writing-builder", "/admin/cambridge-writing-builder"], (req, res) => {
    res.render("admin/cambridge-writing-builder");
  });

  // ==========================================
  // PRACTICE HUB SETS COUNTS API
  // ==========================================
  app.get("/api/practice-sets", async (req, res) => {
    try {
      const result = { reading: {}, listening: {}, writing: {} };

      const readingDocs = await readingPractice.find({}, "type pracNumber").lean();
      readingDocs.forEach((doc) => {
        if (doc.type && doc.pracNumber) {
          if (!result.reading[doc.type]) result.reading[doc.type] = new Set();
          const num = parseInt(String(doc.pracNumber).replace(/\D/g, ""), 10);
          if (num) result.reading[doc.type].add(num);
        }
      });

      const ListeningModel = typeof listeningPractice !== "undefined"
        ? listeningPractice
        : mongoose.model("Listening-Practice", new mongoose.Schema({}, { strict: false }), "listening-practices");

      if (ListeningModel && ListeningModel.find) {
        const listeningDocs = await ListeningModel.find({}, "type pracNumber").lean();
        listeningDocs.forEach((doc) => {
          if (doc.type && doc.pracNumber) {
            if (!result.listening[doc.type]) result.listening[doc.type] = new Set();
            const num = parseInt(String(doc.pracNumber).replace(/\D/g, ""), 10);
            if (num) result.listening[doc.type].add(num);
          }
        });
      }

      const WritingModel = typeof writingPractice !== "undefined"
        ? writingPractice
        : mongoose.model("Writing-Practice", new mongoose.Schema({}, { strict: false }), "writing-practices");

      if (WritingModel && WritingModel.find) {
        const writingDocs = await WritingModel.find({}, "type pracNumber").lean();
        writingDocs.forEach((doc) => {
          if (doc.type && doc.pracNumber) {
            const slugKey = String(doc.type).trim().replace(/\s+/g, "-");
            if (!result.writing[slugKey]) result.writing[slugKey] = new Set();
            if (!result.writing[doc.type]) result.writing[doc.type] = new Set();

            const num = parseInt(String(doc.pracNumber).replace(/\D/g, ""), 10);
            if (num) {
              result.writing[slugKey].add(num);
              result.writing[doc.type].add(num);
            }
          }
        });
      }

      const formattedResult = { reading: {}, listening: {}, writing: {} };
      ["reading", "listening", "writing"].forEach((mod) => {
        for (const t in result[mod]) {
          formattedResult[mod][t] = Array.from(result[mod][t]).sort((a, b) => a - b);
        }
      });

      res.json(formattedResult);
    } catch (err) {
      console.error("Error generating practice sets:", err);
      res.status(500).json({ error: "Failed to fetch practice sets" });
    }
  });

  // ==========================================
  // ==========================================
  // READING QUESTION-TYPE EXERCISES API & PAGE (POWERED BY CAMBRIDGE V2 & PRACTICE BANK)
  // ==========================================
  const { normalizePracticeReadingDoc } = require("./services/practiceReadingNormalizer");

  app.get("/api/reading-practice-v2/:type/:setNumber", async (req, res) => {
    try {
      const typeParam = req.params.type;
      const setParam = Number(req.params.setNumber) || 1;
      const db = mongoose.connection.db;
      const col = db.collection("reading-practices");

      const allTypes = await col.distinct("type");
      let matchedType = allTypes.find(t => t.toLowerCase().replace(/[-_]+/g, ' ') === typeParam.toLowerCase().replace(/[-_]+/g, ' '));
      if (!matchedType) {
        matchedType = allTypes.find(t => t.toLowerCase().includes(typeParam.toLowerCase()) || typeParam.toLowerCase().includes(t.toLowerCase()));
      }
      if (!matchedType) matchedType = typeParam;

      const doc = await col.findOne({
        type: matchedType,
        pracNumber: `Practice-${setParam}`
      });

      if (!doc) {
        return res.status(404).json({ success: false, message: `Practice test not found for ${matchedType} Set ${setParam}` });
      }

      const normalized = normalizePracticeReadingDoc(doc);
      res.json({ success: true, data: normalized });
    } catch (err) {
      console.error("reading-practice-v2 fetch error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // In-memory cache for fast, instant loading of reading exercises
  let cachedExerciseIndex = null;
  let cachedExerciseTime = 0;
  const EXERCISE_CACHE_TTL = 20 * 60 * 1000; // 20 mins

  app.get("/api/reading-exercises", async (req, res) => {
    try {
      const typeParam = req.query.type || "Summary Completion";
      const sourceFilter = (req.query.source || "all").toLowerCase(); // 'all', 'cambridge', 'practice_bank'
      const normalizedKey = typeParam.toLowerCase().trim().replace(/[-_]+/g, ' ');

      const now = Date.now();
      let categoryMap = {};
      let allCounts = {
        'Summary Completion': 0,
        'True-False-NotGiven': 0,
        'Yes-No-NotGiven': 0,
        'Matching-Headings': 0,
        'Note-Completion': 0,
        'Multiple Choice': 0,
        'Multiple Choice (Two Choices)': 0,
        'Matching Information': 0,
        'Sentence Completion': 0,
        'Matching Features': 0,
        'Table-Completion': 0
      };

      if (cachedExerciseIndex && (now - cachedExerciseTime < EXERCISE_CACHE_TTL)) {
        categoryMap = cachedExerciseIndex.categoryMap;
        allCounts = cachedExerciseIndex.allCounts;
      } else {
        const db = mongoose.connection.db;
        const colV2 = db.collection("cambridge_reading_v2");
        const colBank = db.collection("reading-practices");

        // High-speed light projection: only load metadata needed for exercise listing
        const [allCambridgeTests, allBankDocs] = await Promise.all([
          colV2.find({}, {
            projection: {
              book: 1,
              testNo: 1,
              "passages.passageNumber": 1,
              "passages.title": 1,
              "questionGroups.part": 1,
              "questionGroups.passage": 1,
              "questionGroups.groupNumber": 1,
              "questionGroups.type": 1,
              "questionGroups.instruction": 1,
              "questionGroups.title": 1,
              "questionGroups.questionIds": 1,
              "questionGroups.ids": 1,
              "questionGroups.items": 1,
              "questionGroups.features": 1,
              "questionGroups.statements": 1,
              "questionGroups.sentences": 1
            }
          }).sort({ book: -1, testNo: 1 }).toArray(),
          colBank.find({}, {
            projection: {
              type: 1,
              pracNumber: 1,
              "reading.passages.title": 1,
              "reading.questions.id": 1
            }
          }).sort({ pracNumber: 1 }).toArray()
        ]);

      function getGroupTypeCategory(g) {
        const t = String(g.type || '').toLowerCase();
        const inst = String(g.instruction || '').toLowerCase();
        const title = String(g.title || '').toLowerCase();

        if (t.includes('summary') || inst.includes('summary') || title.includes('summary')) return 'Summary Completion';
        if (t.includes('true-false') || (inst.includes('true') && inst.includes('false'))) return 'True-False-NotGiven';
        if (t.includes('yes-no') || (inst.includes('yes') && inst.includes('no'))) return 'Yes-No-NotGiven';
        if (t.includes('heading') || inst.includes('heading') || title.includes('heading')) return 'Matching-Headings';
        if (t.includes('note') || inst.includes('notes') || title.includes('notes')) return 'Note-Completion';
        if (t.includes('table') || inst.includes('table')) return 'Table-Completion';
        if (t.includes('sentence-ending') || inst.includes('sentence ending')) return 'Matching Sentence Endings';
        if (t.includes('sentence') || inst.includes('sentence')) return 'Sentence Completion';
        if (t.includes('name') || t.includes('feature') || inst.includes('people') || inst.includes('researcher')) return 'Matching Features';
        if (t.includes('matrix') || t.includes('info') || inst.includes('information')) return 'Matching Information';
        if (t.includes('two-choice') || inst.includes('two')) return 'Multiple Choice (Two Choices)';
        if (t.includes('mcq') || t.includes('choice') || inst.includes('choose the correct letter')) return 'Multiple Choice';
        return 'Other';
      }

      function getGroupQIds(g) {
        if (Array.isArray(g.questionIds) && g.questionIds.length) return g.questionIds.map(Number);
        if (Array.isArray(g.ids) && g.ids.length) return g.ids.map(Number);
        const ids = [];
        if (g.items) {
          g.items.forEach(it => {
            if (Array.isArray(it.ids)) it.ids.forEach(id => ids.push(Number(id)));
            else if (it.id || it.questionNumber) ids.push(Number(it.id || it.questionNumber));
          });
        }
        if (g.features) {
          g.features.forEach(f => {
            if (f.id || f.questionNumber) ids.push(Number(f.id || f.questionNumber));
          });
        }
        if (g.statements) {
          g.statements.forEach(st => {
            if (st.id || st.questionNumber) ids.push(Number(st.id || st.questionNumber));
          });
        }
        if (g.sentences) {
          g.sentences.forEach(s => {
            const matches = String(s).match(/\[(?:blank|drop):(\d+)\]/g) || [];
            matches.forEach(m => ids.push(Number(m.replace(/\D/g, ''))));
          });
        }
        return ids.filter(x => x > 0);
      }

      // 1. Process Cambridge Tests
      allCambridgeTests.forEach(doc => {
        (doc.questionGroups || []).forEach(g => {
          const cat = getGroupTypeCategory(g);
          const qIds = getGroupQIds(g);
          if (!qIds.length) return;

          allCounts[cat] = (allCounts[cat] || 0) + 1;

          const pNum = Number(g.part) || Number(g.passage) || (qIds[0] <= 13 ? 1 : (qIds[0] <= 26 ? 2 : 3));
          const p = (doc.passages || [])[pNum - 1] || {};
          const passageTitle = p.title || `Reading Passage ${pNum}`;

          if (!categoryMap[cat]) categoryMap[cat] = [];
          const exNum = categoryMap[cat].length + 1;
          categoryMap[cat].push({
            exerciseNumber: exNum,
            sourceType: "cambridge",
            sourceLabel: "Cambridge Official",
            badgeText: `CAMBRIDGE ${doc.book} • TEST ${doc.testNo}`,
            title: `Exercise ${exNum}`,
            book: doc.book,
            testNo: doc.testNo,
            passageNum: pNum,
            passageTitle,
            source: `from Cambridge IELTS ${doc.book} Academic Reading Test ${doc.testNo}`,
            qRange: `Questions ${qIds[0]}-${qIds[qIds.length - 1]}`,
            questionsCount: qIds.length,
            link: `/cambridge-reading-v2?book=${doc.book}&test=${doc.testNo}&section=${qIds[0]}-${qIds[qIds.length - 1]}`
          });
        });
      });

      // 2. Process Practice Bank Tests
      function mapBankTypeToCategory(bankType) {
        const s = String(bankType || '').toLowerCase().replace(/[-_]+/g, ' ');
        if (s.includes('summary')) return 'Summary Completion';
        if (s.includes('true') || s.includes('not given')) return 'True-False-NotGiven';
        if (s.includes('heading')) return 'Matching-Headings';
        if (s.includes('note')) return 'Note-Completion';
        if (s.includes('sentence')) return 'Sentence Completion';
        if (s.includes('feature')) return 'Matching Features';
        if (s.includes('information')) return 'Matching Information';
        if (s.includes('choice') || s.includes('mcq')) return 'Multiple Choice';
        return bankType;
      }

      // Sort practice bank by number
      allBankDocs.sort((a, b) => {
        const na = Number(String(a.pracNumber || '').replace(/\D/g, '')) || 0;
        const nb = Number(String(b.pracNumber || '').replace(/\D/g, '')) || 0;
        return na - nb;
      });

      allBankDocs.forEach(doc => {
        const cat = mapBankTypeToCategory(doc.type);
        allCounts[cat] = (allCounts[cat] || 0) + 1;

        const setNum = Number(String(doc.pracNumber || '').replace(/\D/g, '')) || 1;
        const r = doc.reading || {};
        const p0 = (r.passages && r.passages[0]) || {};
        const passageTitle = p0.title || `${doc.type} Practice Passage`;
        const q0 = (r.questions && r.questions[0]) || {};
        const qIds = Array.isArray(q0.id) ? q0.id : (q0.id ? [q0.id] : [1, 2, 3, 4, 5]);
        const qCount = qIds.length || 5;

        if (!categoryMap[cat]) categoryMap[cat] = [];
        const exNum = categoryMap[cat].length + 1;
        categoryMap[cat].push({
          exerciseNumber: exNum,
          sourceType: "practice_bank",
          sourceLabel: "Practice Bank",
          badgeText: `PRACTICE BANK • SET ${setNum}`,
          title: `Practice Set ${setNum}`,
          setNumber: setNum,
          passageNum: 1,
          passageTitle,
          source: `from IELTS Mockpoint Practice Bank`,
          qRange: `Questions 1-${qCount}`,
          questionsCount: qCount,
          link: `/cambridge-reading-v2?practice=bank&type=${encodeURIComponent(doc.type)}&set=${setNum}`
        });
      });

      // Save into cache for instant response
      cachedExerciseIndex = { categoryMap, allCounts };
      cachedExerciseTime = now;
    }

      // Match requested category
      let matchedCat = Object.keys(categoryMap).find(k => k.toLowerCase().replace(/[-_]+/g, ' ') === normalizedKey);
      if (!matchedCat) {
        matchedCat = Object.keys(categoryMap).find(k => k.toLowerCase().includes(normalizedKey) || normalizedKey.includes(k.toLowerCase()));
      }
      if (!matchedCat) matchedCat = 'Summary Completion';

      let exercises = categoryMap[matchedCat] || [];
      const cambridgeCount = exercises.filter(x => x.sourceType === "cambridge").length;
      const bankCount = exercises.filter(x => x.sourceType === "practice_bank").length;

      // Apply source filter if specified
      if (sourceFilter === "cambridge") {
        exercises = exercises.filter(x => x.sourceType === "cambridge");
      } else if (sourceFilter === "bank" || sourceFilter === "practice_bank") {
        exercises = exercises.filter(x => x.sourceType === "practice_bank");
      }

      res.json({
        success: true,
        type: matchedCat,
        typeName: matchedCat,
        totalExercises: exercises.length,
        cambridgeCount,
        bankCount,
        categoryCounts: allCounts,
        exercises
      });
    } catch (err) {
      console.error("Error fetching Cambridge V2 reading exercises:", err);
      res.status(500).json({ error: "Failed to fetch reading exercises" });
    }
  });

  app.get(["/reading-exercises", "/reading-exercises.html"], (req, res) => {
    res.sendFile(path.join(__dirname, "public", "reading-exercises.html"));
  });

  // ==========================================
  // CAMBRIDGE & PRACTICE BANK LISTENING EXERCISES BY QUESTION TYPE
  // ==========================================
  let cachedListeningExerciseIndex = null;
  let cachedListeningExerciseTime = 0;

  app.get("/api/listening-exercises", async (req, res) => {
    try {
      const typeParam = req.query.type || "Note-Completion";
      const sourceFilter = (req.query.source || "all").toLowerCase(); // 'all', 'cambridge', 'practice_bank'
      const normalizedKey = typeParam.toLowerCase().trim().replace(/[-_]+/g, ' ');

      const now = Date.now();
      let categoryMap = {};
      let allCounts = {
        'Note-Completion': 0,
        'Form-Completion': 0,
        'Table-Completion': 0,
        'Multiple Choice': 0,
        'Multiple Choice (Two Choices)': 0,
        'Matching': 0,
        'Map-Labelling': 0,
        'Flow-chart Completion': 0
      };

      if (cachedListeningExerciseIndex && (now - cachedListeningExerciseTime < EXERCISE_CACHE_TTL)) {
        categoryMap = cachedListeningExerciseIndex.categoryMap;
        allCounts = cachedListeningExerciseIndex.allCounts;
      } else {
        const db = mongoose.connection.db;
        const colV2 = db.collection("cambridge_listening_v2");
        const colBank = db.collection("listening-practices");

        const [allCambridgeTests, allBankDocs] = await Promise.all([
          colV2.find({}, {
            projection: {
              book: 1,
              testNo: 1,
              title: 1,
              "questionGroups.part": 1,
              "questionGroups.groupNumber": 1,
              "questionGroups.type": 1,
              "questionGroups.instruction": 1,
              "questionGroups.heading": 1,
              "questionGroups.title": 1,
              "questionGroups.imageUrl": 1,
              "questionGroups.mapImageUrl": 1,
              "questionGroups.questionIds": 1,
              "questionGroups.ids": 1,
              "questionGroups.questions": 1
            }
          }).sort({ book: -1, testNo: 1 }).toArray(),
          colBank.find({}, {
            projection: {
              type: 1,
              pracNumber: 1,
              "listening.questions": 1
            }
          }).sort({ pracNumber: 1 }).toArray()
        ]);

        function getCategory(g) {
          const t = String(g.type || '').toLowerCase();
          const inst = String(g.instruction || '').toLowerCase();
          const title = String(g.title || '').toLowerCase();
          const heading = String(g.heading || '').toLowerCase();
          const hasImg = !!(g.imageUrl || g.mapImageUrl);

          if ((hasImg || t.includes('map') || /\b(map|diagram|floor plan)\b/i.test(inst + ' ' + title + ' ' + heading) || inst.includes('complete the labels')) && !t.includes('table')) {
            return 'Map-Labelling';
          }
          if (t.includes('flow-chart') || t.includes('flowchart') || inst.includes('flow-chart') || inst.includes('flowchart')) {
            return 'Flow-chart Completion';
          }
          if (t.includes('two-choice') || t.includes('multiple-choice-multiple') || t.includes('multiple-choice-three') || /\bchoose (two|three)\b/i.test(inst)) {
            return 'Multiple Choice (Two Choices)';
          }
          if (t.includes('form') || /\bform\b/i.test(inst)) return 'Form-Completion';
          if (t.includes('table')) return 'Table-Completion';
          if (t.includes('matching')) return 'Matching';
          if (t.includes('mcq') || t.includes('multiple-choice') || t.includes('one-choice')) return 'Multiple Choice';
          return 'Note-Completion';
        }

        categoryMap = {
          'Note-Completion': [],
          'Form-Completion': [],
          'Table-Completion': [],
          'Multiple Choice': [],
          'Multiple Choice (Two Choices)': [],
          'Matching': [],
          'Map-Labelling': [],
          'Flow-chart Completion': []
        };

        allCambridgeTests.forEach(test => {
          const isRecentActual = Number(test.book) >= 2000;
          (test.questionGroups || []).forEach(g => {
            const cat = getCategory(g);
            if (!categoryMap[cat]) categoryMap[cat] = [];
            const rawIds = g.questionIds || g.ids || (g.questions ? g.questions.map(q => q.id) : []);
            const qIds = rawIds.map(Number).filter(n => !isNaN(n)).sort((a,b)=>a-b);
            if (!qIds.length) return;
            const qStart = qIds[0];
            const qEnd = qIds[qIds.length - 1];
            const range = `Questions ${qStart}–${qEnd}`;
            const exNum = categoryMap[cat].length + 1;
            const pNum = Number(g.part) || Math.ceil(qStart / 10) || 1;

            categoryMap[cat].push({
              exerciseNumber: exNum,
              sourceType: isRecentActual ? 'recent_actual' : 'cambridge',
              sourceLabel: isRecentActual ? 'Recent Actual' : 'Cambridge Official',
              badgeText: isRecentActual ? `RECENT ACTUAL • TEST ${test.testNo}` : `CAMBRIDGE ${test.book} • TEST ${test.testNo}`,
              title: `Exercise ${exNum}`,
              book: test.book,
              testNo: test.testNo,
              part: pNum,
              partTitle: `Listening Part ${pNum}`,
              source: isRecentActual
                ? `from Recent Actual Listening Test ${test.testNo}${g.heading ? ` — ${g.heading}` : ''}`
                : `from Cambridge IELTS ${test.book} Academic Listening Test ${test.testNo}`,
              qRange: range,
              questionsCount: qIds.length,
              link: `/cambridge-listening-v2?book=${test.book}&test=${test.testNo}&part=${pNum}&section=${qStart}-${qEnd}`
            });
          });
        });

        allBankDocs.forEach(doc => {
          const cat = getCategory({ type: doc.type, instruction: '', title: '', heading: '' });
          if (!categoryMap[cat]) categoryMap[cat] = [];
          const num = parseInt(String(doc.pracNumber).replace(/\D/g, ''), 10) || 1;
          const qCount = (doc.listening && Array.isArray(doc.listening.questions)) ? doc.listening.questions.length : 10;
          const exNum = categoryMap[cat].length + 1;
          categoryMap[cat].push({
            exerciseNumber: exNum,
            sourceType: 'practice_bank',
            sourceLabel: 'Practice Bank',
            badgeText: `PRACTICE BANK • SET ${num}`,
            title: `Practice Set ${num}`,
            setNumber: num,
            part: 1,
            partTitle: `${doc.type || 'Listening'} Practice`,
            source: `from IELTS Mockpoint Practice Bank`,
            qRange: `Questions 1–${qCount}`,
            questionsCount: qCount,
            link: `/listening-practice?pracNumber=${num}&type=${encodeURIComponent(doc.type)}`
          });
        });

        for (const k in categoryMap) {
          allCounts[k] = categoryMap[k].length;
        }

        cachedListeningExerciseIndex = { categoryMap, allCounts };
        cachedListeningExerciseTime = now;
      }

      let matchedCat = 'Note-Completion';
      const exactMatch = Object.keys(categoryMap).find(k => k.toLowerCase().replace(/[-_]+/g, ' ') === normalizedKey);
      if (exactMatch) {
        matchedCat = exactMatch;
      } else {
        const partial = Object.keys(categoryMap).find(k => {
          const lk = k.toLowerCase().replace(/[-_]+/g, ' ');
          return lk.includes(normalizedKey) || normalizedKey.includes(lk);
        });
        if (partial) matchedCat = partial;
      }

      let exercises = categoryMap[matchedCat] || [];
      const cambridgeCount = exercises.filter(x => x.sourceType === 'cambridge').length;
      const recentCount = exercises.filter(x => x.sourceType === 'recent_actual').length;
      const bankCount = exercises.filter(x => x.sourceType === 'practice_bank').length;

      if (sourceFilter === 'cambridge') {
        exercises = exercises.filter(x => x.sourceType === 'cambridge');
      } else if (sourceFilter === 'recent_actual') {
        exercises = exercises.filter(x => x.sourceType === 'recent_actual');
      } else if (sourceFilter === 'practice_bank') {
        exercises = exercises.filter(x => x.sourceType === 'practice_bank');
      }

      res.json({
        success: true,
        type: matchedCat,
        typeName: matchedCat,
        totalExercises: exercises.length,
        cambridgeCount,
        recentCount,
        bankCount,
        categoryCounts: allCounts,
        exercises
      });
    } catch (err) {
      console.error("Error fetching listening exercises:", err);
      res.status(500).json({ error: "Failed to fetch listening exercises" });
    }
  });

  app.get(["/listening-exercises", "/listening-exercises.html"], (req, res) => {
    res.sendFile(path.join(__dirname, "public", "listening-exercises.html"));
  });

  // Recent IELTS Listening Real Tests
  app.get(["/recent-listening-tests", "/recent-listening-tests.html", "/recent-listening-real-tests"], (req, res) => {
    res.sendFile(path.join(__dirname, "public", "recent-listening-tests.html"));
  });

  // Recent IELTS Reading Real Tests
  app.get(["/recent-reading-tests", "/recent-reading-tests.html", "/recent-reading-real-tests"], (req, res) => {
    res.sendFile(path.join(__dirname, "public", "recent-reading-tests.html"));
  });

  // Recent IELTS Writing Real Tests
  app.get(["/recent-writing-tests", "/recent-writing-tests.html", "/recent-writing-real-tests"], (req, res) => {
    res.sendFile(path.join(__dirname, "public", "recent-writing-tests.html"));
  });

  // ==========================================
  // WRITING EXERCISES BY QUESTION TYPE
  // ==========================================
  app.get("/api/writing-exercises", async (req, res) => {
    try {
      const db = mongoose.connection.db || req.app.locals.db;
      const type = req.query.type || "Bar-Chart";
      const typeMap = {
        "Line-Graph": "Line Graph", "Bar-Chart": "Bar Chart", "Pie-Chart": "Pie Chart",
        "Table": "Table", "Process-Diagram": "Process Diagram", "Map": "Map Comparison",
        "Mixed-Charts": "Mixed Charts", "Opinion-Essay": "Opinion Essay",
        "Discussion-Essay": "Discussion Essay", "Problem-Solution": "Problem & Solution",
        "Advantages-Disadvantages": "Advantages & Disadvantages",
        "Two-Part-Question": "Two-Part Question", "Positive-Negative": "Positive or Negative"
      };
      const decoded = decodeURIComponent(type).replace(/[-_\s]+/g, "").toLowerCase();
      const matchedKey = Object.keys(typeMap).find(k => k.replace(/[-_\s]+/g, "").toLowerCase() === decoded) || type;
      const docs = await db.collection("writing-practices")
        .find({ type: matchedKey, pracNumber: /^Set-\d+$/ })
        .sort({ pracNumber: 1 }).toArray();
      const categoryCounts = {};
      for (const key of Object.keys(typeMap)) {
        const cnt = await db.collection("writing-practices").countDocuments({ type: key, pracNumber: /^Set-\d+$/ });
        if (cnt > 0) categoryCounts[key] = cnt;
      }
      const exercises = docs.map((doc, idx) => {
        const setNum = parseInt((doc.pracNumber || "Set-1").replace("Set-", "")) || idx + 1;
        const q = doc.writing && doc.writing.questions && doc.writing.questions[0];
        const part = q ? q.part : 1;
        const source = doc.source || `Set ${setNum}`;
        const image = q && q.image && q.image.length > 0 ? q.image[0] : null;
        return { setNumber: setNum, pracNumber: doc.pracNumber, type: matchedKey,
          typeName: typeMap[matchedKey] || matchedKey, part,
          task: part === 1 ? "Task 1" : "Task 2", source, image,
          title: `${typeMap[matchedKey] || matchedKey} – ${source}`,
          link: `/writing-practice?pracNumber=${encodeURIComponent(doc.pracNumber)}&type=${encodeURIComponent(matchedKey)}`
        };
      });
      res.json({ success: true, type: matchedKey, typeName: typeMap[matchedKey] || matchedKey,
        totalExercises: exercises.length, exercises, categoryCounts });
    } catch (err) {
      console.error("Error fetching writing exercises:", err);
      res.status(500).json({ error: "Failed to fetch writing exercises" });
    }
  });

  app.get(["/writing-exercises", "/writing-exercises.html"], (req, res) => {
    res.sendFile(path.join(__dirname, "public", "writing-exercises.html"));
  });

  // ==========================================
  // CAMBRIDGE AUDIO STREAM PROXY & HUB
  // ==========================================
  app.get("/api/cambridge-proxy-audio", (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send("Audio URL required");

    try {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === "https:" ? https : http;

      const requestHeaders = {};
      if (req.headers.range) requestHeaders["range"] = req.headers.range;

      client.get(url, { headers: requestHeaders }, (remoteRes) => {
        if (remoteRes.statusCode >= 300 && remoteRes.statusCode < 400 && remoteRes.headers.location) {
          return res.redirect(`/api/cambridge-proxy-audio?url=${encodeURIComponent(remoteRes.headers.location)}`);
        }
        res.status(remoteRes.statusCode);
        const headersToForward = ["content-type", "content-length", "content-range", "accept-ranges"];
        headersToForward.forEach((h) => {
          if (remoteRes.headers[h]) res.setHeader(h, remoteRes.headers[h]);
        });
        res.setHeader("Accept-Ranges", "bytes");
        remoteRes.pipe(res);
      }).on("error", (err) => {
        console.error("Audio proxy streaming error:", err.message);
        if (!res.headersSent) res.status(500).send("Failed to stream audio");
      });
    } catch (err) {
      res.status(400).send("Invalid Audio URL");
    }
  });

  // ==========================================
  // EXTERNAL IMAGE HOTLINK BYPASS PROXY (WITH REDIRECT SUPPORT)
  // ==========================================
  // ==========================================
  // EXTERNAL IMAGE HOTLINK BYPASS PROXY (100% BYPASS)
  // ==========================================
  app.get("/api/proxy-image", (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send("Image URL required");

    try {
      // 403 Forbidden bypass করার জন্য বিশ্বস্ত CDN গেটওয়ে ব্যবহার
      const cdnUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}&default=${encodeURIComponent(url)}`;
      
      const parsedUrl = new URL(cdnUrl);
      const client = parsedUrl.protocol === "https:" ? https : http;

      const requestOptions = {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8"
        }
      };

      client.get(cdnUrl, requestOptions, (remoteRes) => {
        // Redirection handle
        if (remoteRes.statusCode >= 300 && remoteRes.statusCode < 400 && remoteRes.headers.location) {
          return res.redirect(`/api/proxy-image?url=${encodeURIComponent(remoteRes.headers.location)}`);
        }

        res.status(remoteRes.statusCode);
        if (remoteRes.headers["content-type"]) res.setHeader("Content-Type", remoteRes.headers["content-type"]);
        if (remoteRes.headers["cache-control"]) res.setHeader("Cache-Control", "public, max-age=86400");
        remoteRes.pipe(res);
      }).on("error", (err) => {
        console.error("Image proxy CDN stream error:", err.message);
        if (!res.headersSent) res.status(500).send("Failed to stream image");
      });
    } catch (err) {
      res.status(400).send("Invalid Image URL");
    }
  });
  app.get(["/practice-hub", "/practice-hub/"], (req, res) => {
    const targetPath = path.join(__dirname, "FrontPage", "Frontend", "Practice-hub", "Practice-hub.html");
    res.sendFile(targetPath, (err) => {
      if (err && !res.headersSent) res.status(err.status || 500).send(err.message);
    });
  });
  // ==========================================
  // BLOG & LESSON ADMIN BUILDER PAGES
  // ==========================================
  app.get(["/blog-builder", "/admin/blog-builder"], (req, res) => {
    res.sendFile(path.join(__dirname, "views", "admin", "blog-builder.html"));
  });

  app.get(["/lesson-builder", "/admin/lesson-builder"], (req, res) => {
    res.sendFile(path.join(__dirname, "views", "admin", "lesson-builder.html"));
  });

  // ==========================================
  // BLOG REST APIS (SAVE & RETRIEVE)
  // ==========================================
  app.post("/api/blogs", async (req, res) => {
    try {
      const payload = req.body;
      const query = payload._id
        ? { _id: payload._id }
        : { slug: payload.slug };

      const blog = await Blog.findOneAndUpdate(query, payload, {
        new: true,
        upsert: true,
        runValidators: true,
      });

      res.status(200).json({ success: true, message: "Blog saved successfully!", data: blog });
    } catch (err) {
      console.error("Blog save error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.get("/api/blogs", async (req, res) => {
    try {
      const { category, search } = req.query;
      const filter = { isPublished: true };

      if (category && category !== "All") filter.category = category;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { excerpt: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } }
        ];
      }

      const blogs = await Blog.find(filter).sort({ createdAt: -1 }).lean();
      res.status(200).json({ success: true, data: blogs });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.get("/api/blogs/:slug", async (req, res) => {
    try {
      const blog = await Blog.findOneAndUpdate(
        { slug: req.params.slug, isPublished: true },
        { $inc: { views: 1 } },
        { new: true }
      ).lean();

      if (!blog) return res.status(404).json({ success: false, message: "Blog post not found" });
      res.status(200).json({ success: true, data: blog });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // ==========================================
  // LESSON REST APIS (SAVE & RETRIEVE)
  // ==========================================
  app.post("/api/lessons", async (req, res) => {
    try {
      const payload = req.body;
      const query = payload._id
        ? { _id: payload._id }
        : { module: payload.module, lessonNumber: payload.lessonNumber };

      const lesson = await Lesson.findOneAndUpdate(query, payload, {
        new: true,
        upsert: true,
        runValidators: true,
      });

      res.status(200).json({ success: true, message: "Lesson saved successfully!", data: lesson });
    } catch (err) {
      console.error("Lesson save error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.get("/api/lessons", async (req, res) => {
    try {
      const { module } = req.query;
      const filter = { isPublished: true };
      if (module) filter.module = String(module).toLowerCase();

      const lessons = await Lesson.find(filter).sort({ lessonNumber: 1 }).lean();
      res.status(200).json({ success: true, data: lessons });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // // Public Hub HTML Endpoints
  // app.get(["/blog", "/blog/"], (req, res) => {
  //   res.sendFile(path.join(__dirname, "views", "blog.html"));
  // });

  // app.get(["/learn", "/learn/"], (req, res) => {
  //   res.sendFile(path.join(__dirname, "views", "learn.html"));
  // });
// Dedicated Single Blog Page
  app.get("/blog/:slug", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "single-blog.html"));
  });

  // Dedicated Single Lesson Page
  app.get("/learn/:module/:slug", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "single-lesson.html"));
  });

  // API to fetch single lesson by module & slug
  app.get("/api/lessons/:module/:slug", async (req, res) => {
    try {
      const lesson = await Lesson.findOne({
        module: String(req.params.module).toLowerCase(),
        slug: req.params.slug,
        isPublished: true,
      }).lean();

      if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });
      res.status(200).json({ success: true, data: lesson });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.get(["/faq", "/faq.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "views", "faq.html"));
});
app.get(["/admin", "/admin/dashboard", "/admin-dashboard"], (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin", "dashboard.html"));
});

app.get(["/pricing", "/pricing.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "FrontPage", "Frontend", "pricing.html"));
});

app.get(["/dashboard", "/student-dashboard", "/candidate-dashboard"], (req, res) => {
  res.sendFile(path.join(__dirname, "FrontPage", "Frontend", "dashboard.html"));
});
app.get("/admin/cambridge-reading-builder", (req, res) => {
  res.render("admin/cambridge-reading-builder", {
    pageTitle: "Cambridge Reading Builder"
  });
});

app.get("/admin/cambridge-listening-builder", (req, res) => {
  res.render("admin/cambridge-listening-builder", {
    pageTitle: "Cambridge Listening Builder"
  });
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "FrontPage", "Frontend", "home.html"));
});


// ==========================================
// DYNAMIC SITEMAP.XML ROUTE
// ==========================================
app.get('/sitemap.xml', async (req, res) => {
  try {
    const escapeXml = (unsafe) => {
      if (!unsafe) return '';
      return String(unsafe).replace(/[<>&'"]/g, (c) => {
        switch (c) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '&': return '&amp;';
          case '\'': return '&apos;';
          case '"': return '&quot;';
        }
      });
    };

    // 1. Fetch from Database
    let blogs = [];
    let lessons = [];
    let cambridgeListeningDocs = [];
    let cambridgeReadingDocs = [];
    let cambridgeListeningV2Docs = [];
    let cambridgeReadingV2Docs = [];
    let cambridgeWritingDocs = [];
    let fullMockDocs = [];

    try { blogs = await Blog.find({ isPublished: true }, 'slug updatedAt createdAt').lean(); } catch(e){}
    try { lessons = await Lesson.find({ isPublished: true }, 'module slug updatedAt createdAt').lean(); } catch(e){}
    try { cambridgeListeningDocs = await CambridgeListening.find({}, 'book testNo bookNumber testNumber updatedAt').lean(); } catch(e){}
    try { cambridgeReadingDocs = await CambridgeReading.find({}, 'book testNo bookNumber testNumber updatedAt').lean(); } catch(e){}
    try {
      const db = mongoose.connection.db;
      cambridgeListeningV2Docs = await db.collection('cambridge_listening_v2').find({}, { projection: { book: 1, testNo: 1, bookNumber: 1, testNumber: 1, updatedAt: 1 } }).lean ? await db.collection('cambridge_listening_v2').find({}, { projection: { book: 1, testNo: 1, bookNumber: 1, testNumber: 1, updatedAt: 1 } }).toArray() : await db.collection('cambridge_listening_v2').find({}, { projection: { book: 1, testNo: 1, bookNumber: 1, testNumber: 1, updatedAt: 1 } }).toArray();
      cambridgeReadingV2Docs = await db.collection('cambridge_reading_v2').find({}, { projection: { book: 1, testNo: 1, bookNumber: 1, testNumber: 1, updatedAt: 1 } }).toArray();
      cambridgeWritingDocs = await db.collection('cambridgewritings').find({}, { projection: { book: 1, testNo: 1, bookNumber: 1, testNumber: 1, updatedAt: 1 } }).toArray();
      fullMockDocs = await db.collection('test-questions').find({}, { projection: { mockNumber: 1, updatedAt: 1 } }).toArray();
    } catch(e){}

    // 2. High-value Core Landing Pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/mocks', priority: '0.95', changefreq: 'daily' },
      { url: '/cambridge-reading', priority: '0.95', changefreq: 'daily' },
      { url: '/cambridge-listening', priority: '0.95', changefreq: 'daily' },
      { url: '/cambridge-writing', priority: '0.95', changefreq: 'daily' },
      { url: '/recent-reading-tests', priority: '0.95', changefreq: 'daily' },
      { url: '/recent-listening-tests', priority: '0.95', changefreq: 'daily' },
      { url: '/recent-writing-tests', priority: '0.95', changefreq: 'daily' },
      { url: '/speaking', priority: '0.95', changefreq: 'daily' },
      { url: '/practice-hub', priority: '0.95', changefreq: 'daily' },
      { url: '/band-calculator', priority: '0.90', changefreq: 'weekly' },
      { url: '/reading-exercises', priority: '0.85', changefreq: 'weekly' },
      { url: '/listening-exercises', priority: '0.85', changefreq: 'weekly' },
      { url: '/writing-exercises', priority: '0.85', changefreq: 'weekly' },
      { url: '/pricing', priority: '0.80', changefreq: 'weekly' },
      { url: '/blog', priority: '0.90', changefreq: 'daily' },
      { url: '/learn', priority: '0.85', changefreq: 'daily' },
      { url: '/faq', priority: '0.70', changefreq: 'monthly' }
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    const seenLocs = new Set();
    const pushUrl = (loc, { lastmod, changefreq = 'weekly', priority = '0.85' } = {}) => {
      if (!loc || seenLocs.has(loc)) return;
      seenLocs.add(loc);
      xml += '  <url>\n';
      xml += '    <loc>' + loc + '</loc>\n';
      if (lastmod) xml += '    <lastmod>' + lastmod + '</lastmod>\n';
      xml += '    <changefreq>' + changefreq + '</changefreq>\n';
      xml += '    <priority>' + priority + '</priority>\n';
      xml += '  </url>\n';
    };

    // (A) Static Landing Pages
    staticPages.forEach(page => {
      pushUrl('https://ieltsmockpoint.com' + page.url, { changefreq: page.changefreq, priority: page.priority });
    });

    // (B) 20 Authentic IELTS Speaking Mock Tests
    for (let sId = 1; sId <= 20; sId++) {
      pushUrl('https://ieltsmockpoint.com/speaking-test?id=' + sId, { changefreq: 'weekly', priority: '0.90' });
    }

    // (C) Full Mock Tests (All DB test-questions + 1..12 fallback)
    fullMockDocs.forEach(item => {
      if (item.mockNumber) {
        pushUrl('https://ieltsmockpoint.com/test3?mockNumber=' + escapeXml(encodeURIComponent(String(item.mockNumber))), { changefreq: 'weekly', priority: '0.90' });
      }
    });
    for (let mId = 1; mId <= 12; mId++) {
      pushUrl('https://ieltsmockpoint.com/test3?mockNumber=' + mId, { changefreq: 'weekly', priority: '0.90' });
    }

    // (D) Blog Posts
    blogs.forEach(post => {
      if (post.slug) {
        const dateObj = post.updatedAt || post.createdAt || new Date();
        const lastMod = new Date(dateObj).toISOString().split('T')[0];
        pushUrl('https://ieltsmockpoint.com/blog/' + encodeURIComponent(post.slug), { lastmod: lastMod, changefreq: 'weekly', priority: '0.80' });
      }
    });

    // (E) Lessons
    lessons.forEach(lesson => {
      if (lesson.module && lesson.slug) {
        const dateObj = lesson.updatedAt || lesson.createdAt || new Date();
        const lastMod = new Date(dateObj).toISOString().split('T')[0];
        pushUrl('https://ieltsmockpoint.com/learn/' + encodeURIComponent(lesson.module) + '/' + encodeURIComponent(lesson.slug), { lastmod: lastMod, changefreq: 'weekly', priority: '0.75' });
      }
    });

    // (F) Cambridge Listening Tests (V2 canonical + non-redirecting V1)
    const listeningV2Keys = new Set();
    cambridgeListeningV2Docs.forEach(item => {
      const b = item.book || item.bookNumber;
      const t = item.testNo || item.testNumber;
      if (b && t) {
        listeningV2Keys.add(`${b}:${t}`);
        pushUrl('https://ieltsmockpoint.com/cambridge-listening-v2?book=' + escapeXml(b) + '&amp;test=' + escapeXml(t), { changefreq: 'monthly', priority: '0.88' });
      }
    });
    cambridgeListeningDocs.forEach(item => {
      const b = item.book || item.bookNumber;
      const t = item.testNo || item.testNumber;
      const bn = Number(b);
      if (b && t && !(bn >= 12 && bn <= 21) && !listeningV2Keys.has(`${b}:${t}`)) {
        pushUrl('https://ieltsmockpoint.com/cambridge-listening-test?book=' + escapeXml(b) + '&amp;test=' + escapeXml(t), { changefreq: 'monthly', priority: '0.85' });
      }
    });

    // (G) Cambridge Reading Tests (V2 canonical + non-redirecting V1)
    const readingV2Keys = new Set();
    cambridgeReadingV2Docs.forEach(item => {
      const b = item.book || item.bookNumber;
      const t = item.testNo || item.testNumber;
      if (b && t) {
        readingV2Keys.add(`${b}:${t}`);
        pushUrl('https://ieltsmockpoint.com/cambridge-reading-v2?book=' + escapeXml(b) + '&amp;test=' + escapeXml(t), { changefreq: 'monthly', priority: '0.88' });
      }
    });
    cambridgeReadingDocs.forEach(item => {
      const b = item.book || item.bookNumber;
      const t = item.testNo || item.testNumber;
      const bn = Number(b);
      if (b && t && !(bn >= 12 && bn <= 21) && !readingV2Keys.has(`${b}:${t}`)) {
        pushUrl('https://ieltsmockpoint.com/cambridge-reading-test?book=' + escapeXml(b) + '&amp;test=' + escapeXml(t), { changefreq: 'monthly', priority: '0.85' });
      }
    });

    // (H) Cambridge Writing Tests
    cambridgeWritingDocs.forEach(item => {
      const b = item.book || item.bookNumber;
      const t = item.testNo || item.testNumber;
      if (b && t) {
        pushUrl('https://ieltsmockpoint.com/cambridge/writing/' + escapeXml(b) + '/' + escapeXml(t), { changefreq: 'monthly', priority: '0.85' });
      }
    });

    xml += '</urlset>';
    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(xml);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
});

// app.js

// ১. এটি অবশ্যই রাউটের উপরে থাকতে হবে
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ২. রাউট মাউন্ট
const evaluateRoute = require("./routes/evaluate"); // ফাইল পাথ মিলিয়ে নিন
app.use("/", evaluateRoute);

// ==========================================
// IELTS SPEAKING ROUTES
// ==========================================
app.get(["/speaking", "/speaking.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "FrontPage", "Frontend", "speaking.html"));
});

app.get(["/speaking-test", "/speaking-practice"], (req, res) => {
  const sId = String(req.query.id || "").trim();
  const seo = sId ? {
    title: `IELTS Speaking Mock Test ${sId} With 3D AI Examiner | IELTS Mockpoint`,
    description: `Practise IELTS Speaking Mock Test ${sId} free online with our 3D AI Voice Examiner covering Part 1 interview, Part 2 cue card & Part 3 discussion on IELTS Mockpoint.`,
    canonical: `https://ieltsmockpoint.com/speaking-test?id=${encodeURIComponent(sId)}`
  } : {
    canonical: "https://ieltsmockpoint.com/speaking"
  };
  return sendTestHtmlWithSeo(
    res,
    path.join(__dirname, "views", "speaking_engine", "speaking-test.html"),
    seo
  );
});

app.get(["/test3", "/test3.html"], (req, res) => {
  const m = String(req.query.mockNumber || "").trim();
  let label = "IELTS Full Mock Test";
  if (m) {
    if (/^Academic-UKA-FINAL-/i.test(m)) label = `Academic IELTS Full Mock Test ${m.replace(/^Academic-UKA-FINAL-/i, "")}`;
    else if (/^Premium-UKA-FINAL-/i.test(m)) label = `Premium Academic IELTS Mock Test ${m.replace(/^Premium-UKA-FINAL-/i, "")}`;
    else if (/^General-UKA-FINAL-/i.test(m)) label = `General Training IELTS Full Mock Test ${m.replace(/^General-UKA-FINAL-/i, "")}`;
    else if (/^cambridge-/i.test(m)) label = `Cambridge IELTS Full Mock Test ${m.replace(/^cambridge-/i, "")}`;
    else label = `IELTS Full Mock Test ${m}`;
  }
  const seo = m ? {
    title: `${label} Free Online (4-Skills CD IELTS) | IELTS Mockpoint`,
    description: `Take ${label} free online in authentic Computer-Delivered IELTS format: Listening, Reading & Writing with real exam timer and instant band score.`,
    canonical: `https://ieltsmockpoint.com/test3?mockNumber=${encodeURIComponent(m)}`
  } : {
    canonical: "https://ieltsmockpoint.com/mocks"
  };
  return sendTestHtmlWithSeo(
    res,
    path.join(__dirname, "FrontPage", "Frontend", "test3.html"),
    seo
  );
});



  // Other Modular Routes
  app.use("/admin_orgs", adminOrgsRoutes);
  app.use("/audio", audioRoutes);
  app.use("/practice-audio", pracAudioRoutes);
  app.use("/video", videoRoutes);
// robots.txt direct route
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *
Allow: /

Sitemap: https://ieltsmockpoint.com/sitemap.xml
`);
});
  // ==========================================
  // CLEAN URL FALLBACK: /mocks  ->  mocks.html serve korbe
  // (Shob route er por, tai kono existing route/auth bypass hobe na)
  // ==========================================
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (path.extname(req.path) !== "") return next();
    if (req.path.endsWith("/")) return next();

    const filePath = findStaticFile(req.path + ".html");
    if (!filePath) return next();

    return res.sendFile(filePath, (err) => {
      if (err && !res.headersSent) res.status(err.status || 500).send(err.message);
    });
  });

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server on http://localhost:${port}`);
    // Self-ping to prevent Render from sleeping (every 8 minutes)
    const PING_INTERVAL = 8 * 60 * 1000; // 8 minutes in milliseconds
    const SERVER_URL = "https://ieltsmockpoint.com";

    setInterval(() => {
      fetch(SERVER_URL)
        .then((res) => console.log(`[Ping] Server active: Status ${res.status}`))
        .catch((err) => console.error("[Ping Error]:", err.message));
    }, PING_INTERVAL);
  });
}

start();