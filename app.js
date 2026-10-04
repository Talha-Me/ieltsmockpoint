

const https = require("https");
const http = require("http");
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

async function start() {
  async function deleteAllPassCodes() {
    await passCodes.deleteMany();
  }

  // Middleware Setup (Limit 10mb for large texts & audio payloads)
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(
    session({ secret: "secret", resave: false, saveUninitialized: true })
  );

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
  app.get("/cambridge-listening-test", authRoutes.cambridge_listening_test);
  app.get("/cambridge-reading-test", authRoutes.cambridge_reading_test);
  app.get("/cambridge-writing-test", authRoutes.cambridge_writing_test);

  // ==========================================
  // PRACTICE BY QUESTION TYPE PAGES
  // ==========================================
  app.get("/listening-practice", authRoutes.listening_practice);
  app.get("/reading-practice", authRoutes.reading_practice);
  app.get("/writing-practice", authRoutes.writing_practice);

  // API and Admin Routes
  app.use("/api", apiRoutes);
  app.use("/admin_superAdmin", adminRoutes);

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

  /// =========================================================================
// CAMBRIDGE TEST SAVE APIS (LISTENING & READING)
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

    const result = await Model.findOneAndUpdate(
      { $or: [{ book, testNo }, { bookNumber: book, testNumber: testNo }] },
      { 
        $set: {
          book,
          testNo,
          bookNumber: book,
          testNumber: testNo,
          audioUrl: (payload.audioUrl || "").trim(),
          questions: payload.questions || [],
          instructions: payload.instructions || [],
          answers: payload.answers || {}
        } 
      },
      { new: true, upsert: true, strict: false }
    );

    console.log(`--> Save Success: Cambridge ${book} Test ${testNo}`);
    return res.status(200).json({ success: true, message: `Cambridge ${book} Test ${testNo} saved successfully!` });
  } catch (err) {
    console.error("--> Save Error:", err);
    return res.status(500).json({ success: false, message: err.message });
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

  // Public Hub HTML Endpoints
  app.get(["/blog", "/blog/"], (req, res) => {
    res.sendFile(path.join(__dirname, "views", "blog.html"));
  });

  app.get(["/learn", "/learn/"], (req, res) => {
    res.sendFile(path.join(__dirname, "views", "learn.html"));
  });
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

  // Other Modular Routes
  app.use("/admin_orgs", adminOrgsRoutes);
  app.use("/audio", audioRoutes);
  app.use("/practice-audio", pracAudioRoutes);
  app.use("/video", videoRoutes);

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server on http://localhost:${port}`);
  });
}

start();