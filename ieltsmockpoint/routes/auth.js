// const express = require("express");
// const router = express.Router();
// const path = require("path");
// const User = require("../FrontPage/Backend/models/User");
// const TestQuestions = require("../models/testQuestion");
// const adminAuth = require("../middleware/adminAuthMiddleware");

// const listeningPractice = require("../models/listeningPractice");
// const readingPractice = require("../models/readingPractice");
// const writingPractice = require("../models/writingPractice");

// // ==========================================
// // ১. হোম ও মক সিলেক্ট পেজ
// // ==========================================
// router.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/user.html"));
// });

// router.get("/select-mock", async (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/user.html"));
// });

// // ==========================================
// // ২. পাসকোড বাইপাস ও মক সেটআপ রাউটস
// // ==========================================
// router.get("/passcode-for-mock/mock", async (req, res) => {
//   try {
//     const mockID = req.query.mockID || req.query;
//     const targetID = typeof mockID === "object" ? mockID.mockID : mockID;

//     let mock = await TestQuestions.findOne({ mockNumber: targetID });
//     if (!mock) {
//       return res.status(404).send("Error getting mock");
//     }

//     req.session.mock = {
//       mockNumber: mock.mockNumber,
//       plan: mock.plan || "Free",
//       listening: mock.listening,
//       reading: mock.reading,
//       writing: mock.writing,
//     };

//     res.redirect("/mock-test");
//   } catch (err) {
//     console.error("Mock load error:", err);
//     res.status(500).send("Server Error");
//   }
// });

// router.get("/select-mock/mock", async (req, res) => {
//   try {
//     const mockID = req.query.mockID || req.query;
//     const targetID = typeof mockID === "object" ? mockID.mockID : mockID;

//     let mock = await TestQuestions.findOne({ mockNumber: targetID });
//     if (!mock) {
//       return res.status(404).send("Error getting mock");
//     }

//     req.session.mock = {
//       mockNumber: mock.mockNumber,
//       plan: mock.plan || "Free",
//       listening: mock.listening,
//       reading: mock.reading,
//       writing: mock.writing,
//     };

//     res.redirect("/mock-test");
//   } catch (err) {
//     console.error("Select mock error:", err);
//     res.status(500).send("Server Error");
//   }
// });

// // ==========================================
// // ৩. মক টেস্ট ও অথরিটি পেজ
// // ==========================================
// const mock_test = (req, res) => {
//   res.sendFile(path.join(__dirname, "../views/mock.html"));
// };
// router.get("/mock-test", mock_test);

// const authority_login = (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/admin_for_orgs_login.html"));
// };
// router.get("/authority_login", authority_login);

// const passcodes = async (req, res) => {
//   const mockID = req.query.mockID;

//   let mock = await TestQuestions.findOne({ mockNumber: mockID });
//   if (!mock) {
//     return res.status(404).send("Error getting mock");
//   }

//   req.session.mock = {
//     mockNumber: mock.mockNumber,
//     plan: mock.plan || "Free",
//     listening: mock.listening,
//     reading: mock.reading,
//     writing: mock.writing,
//   };

//   res.redirect("/mock-test");
// };
// router.get("/passcodes", passcodes);

// // ==========================================
// // ৪. রেজাল্ট পেজ
// // ==========================================
// const view_results = (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/view_results.html"));
// };
// router.get("/view_results", view_results);

// const test_completed = (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/test_completed.html"));
// };
// router.get("/test-completed", test_completed);

// // ==========================================
// // ৫. ফুল মক মডিউল ভিউজ
// // ==========================================
// const listening_test = (req, res) => {
//   res.sendFile(path.join(__dirname, "../views/test_pages/listening/listening.html"));
// };
// router.get("/listening-test", listening_test);

// const reading_test = (req, res) => {
//   res.sendFile(path.join(__dirname, "../views/test_pages/reading/reading.html"));
// };
// router.get("/reading-test", reading_test);

// const writing_test = (req, res) => {
//   res.sendFile(path.join(__dirname, "../views/test_pages/writing/writing.html"));
// };
// router.get("/writing-test", writing_test);

// // ==========================================
// // ৬. ইনডিভিজুয়াল প্র্যাকটিস রাউটস (TOPIC/TYPE BASED)
// // ==========================================
// const listening_practice = async (req, res) => {
//   try {
//     const { pracNumber, type } = req.query;
//     let practiceData = await listeningPractice.findOne({ pracNumber, type });
//     if (!practiceData) {
//       return res.redirect("/practice-hub");
//     }
//     req.session.pracListening = {
//       pracNumber: practiceData.pracNumber,
//       plan: practiceData.plan || "Free",
//       listening: practiceData.listening,
//       type: practiceData.type,
//     };
//     res.sendFile(path.join(__dirname, "../views/practice_pages/listening/listening-prac.html"));
//   } catch (err) {
//     res.redirect("/practice-hub");
//   }
// };
// router.get("/listening-practice", listening_practice);

// const reading_practice = async (req, res) => {
//   try {
//     const { pracNumber, type } = req.query;
//     let practiceData = await readingPractice.findOne({ pracNumber, type });
//     if (!practiceData) {
//       return res.redirect("/practice-hub");
//     }
//     req.session.pracReading = {
//       pracNumber: practiceData.pracNumber,
//       plan: practiceData.plan || "Free",
//       reading: practiceData.reading,
//       type: practiceData.type,
//     };
//     res.sendFile(path.join(__dirname, "../views/practice_pages/reading/reading-prac.html"));
//   } catch (err) {
//     res.redirect("/practice-hub");
//   }
// };
// router.get("/reading-practice", reading_practice);

// const writing_practice = async (req, res) => {
//   try {
//     const { pracNumber, type } = req.query;
//     let practiceData = await writingPractice.findOne({ pracNumber, type });
//     if (!practiceData) {
//       return res.redirect("/practice-hub");
//     }
//     req.session.pracWriting = {
//       pracNumber: practiceData.pracNumber,
//       plan: practiceData.plan || "Free",
//       writing: practiceData.writing,
//       type: practiceData.type,
//     };
//     res.sendFile(path.join(__dirname, "../views/practice_pages/writing/writing-prac.html"));
//   } catch (err) {
//     res.redirect("/practice-hub");
//   }
// };
// router.get("/writing-practice", writing_practice);

// // ==========================================
// // ৭. ক্যামব্রিজ টেস্ট পেজ রাউটস (BOOK & TEST QUERY BASED)
// // ==========================================
// const cambridge_listening_test = async (req, res) => {
//   try {
//     const { book, test } = req.query;
//     if (book && test) {
//       // ডেটাবেজ থেকে টেস্ট খুঁজে সেশন সংরক্ষণ যাতে এপিআই ডেটা পায়
//       const testData = await listeningPractice.findOne({
//         $or: [
//           { pracNumber: test, type: `Cambridge-${book}` },
//           { book: book, test: test },
//           { bookNumber: book, testNumber: test },
//           { mockNumber: `cambridge-${book}-${test}` },
//         ],
//       });

//       if (testData) {
//         req.session.pracListening = {
//           pracNumber: testData.pracNumber,
//           plan: testData.plan || "Free",
//           listening: testData.listening,
//           type: testData.type,
//         };
//       }
//     }
//     res.sendFile(path.join(__dirname, "../views/practice_pages/listening/listening-prac.html"));
//   } catch (err) {
//     console.error("Cambridge Listening Route Error:", err);
//     res.sendFile(path.join(__dirname, "../views/practice_pages/listening/listening-prac.html"));
//   }
// };
// router.get("/cambridge-listening-test", cambridge_listening_test);

// const cambridge_reading_test = async (req, res) => {
//   try {
//     const { book, test } = req.query;
//     if (book && test) {
//       const testData = await readingPractice.findOne({
//         $or: [
//           { pracNumber: test, type: `Cambridge-${book}` },
//           { book: book, test: test },
//           { bookNumber: book, testNumber: test },
//           { mockNumber: `cambridge-${book}-${test}` },
//         ],
//       });

//       if (testData) {
//         req.session.pracReading = {
//           pracNumber: testData.pracNumber,
//           plan: testData.plan || "Free",
//           reading: testData.reading,
//           type: testData.type,
//         };
//       }
//     }
//     res.sendFile(path.join(__dirname, "../views/practice_pages/reading/reading-prac.html"));
//   } catch (err) {
//     console.error("Cambridge Reading Route Error:", err);
//     res.sendFile(path.join(__dirname, "../views/practice_pages/reading/reading-prac.html"));
//   }
// };
// router.get("/cambridge-reading-test", cambridge_reading_test);

// const cambridge_writing_test = async (req, res) => {
//   try {
//     const { book, test } = req.query;
//     if (book && test) {
//       const testData = await writingPractice.findOne({
//         $or: [
//           { pracNumber: test, type: `Cambridge-${book}` },
//           { book: book, test: test },
//           { bookNumber: book, testNumber: test },
//           { mockNumber: `cambridge-${book}-${test}` },
//         ],
//       });

//       if (testData) {
//         req.session.pracWriting = {
//           pracNumber: testData.pracNumber,
//           plan: testData.plan || "Free",
//           writing: testData.writing,
//           type: testData.type,
//         };
//       }
//     }
//     res.sendFile(path.join(__dirname, "../views/practice_pages/writing/writing-prac.html"));
//   } catch (err) {
//     console.error("Cambridge Writing Route Error:", err);
//     res.sendFile(path.join(__dirname, "../views/practice_pages/writing/writing-prac.html"));
//   }
// };
// router.get("/cambridge-writing-test", cambridge_writing_test);

// // ==========================================
// // ৮. প্র্যাকটিস হাব
// // ==========================================
// const practice_hub = (req, res) => {
//   res.sendFile(path.join(__dirname, "../FrontPage/Frontend/Practice-hub.html"));
// };
// router.get("/practice-hub", practice_hub);

// // ==========================================
// // ৯. এক্সপোর্টস
// // ==========================================
// module.exports = {
//   router,
//   authority_login,
//   view_results,
//   passcodes,
//   mock_test,
//   listening_test,
//   reading_test,
//   writing_test,
//   practice_hub,
//   listening_practice,
//   reading_practice,
//   writing_practice,
//   cambridge_listening_test,
//   cambridge_reading_test,
//   cambridge_writing_test,
//   test_completed,
// };

// const express = require("express");
// const router = express.Router();
// const path = require("path");
// const mongoose = require("mongoose");
// const User = require("../FrontPage/Backend/models/User");
// const TestQuestions = require("../models/testQuestion");
// const adminAuth = require("../middleware/adminAuthMiddleware");

// const listeningPractice = require("../models/listeningPractice");
// const readingPractice = require("../models/readingPractice");
// const writingPractice = require("../models/writingPractice");

// // ==========================================
// // 1. HOME & MOCK SELECT PAGES
// // ==========================================
// router.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/user.html"));
// });

// router.get("/select-mock", async (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/user.html"));
// });

// // ==========================================
// // 2. PASSCODE BYPASS & DIRECT MOCK SETUP
// // ==========================================
// router.get("/passcode-for-mock/mock", async (req, res) => {
//   try {
//     const mockID = req.query.mockID || req.query;
//     const targetID = typeof mockID === "object" ? mockID.mockID : mockID;

//     let mock = await TestQuestions.findOne({ mockNumber: targetID });
//     if (!mock) {
//       return res.status(404).send("Error getting mock");
//     }

//     req.session.mock = {
//       mockNumber: mock.mockNumber,
//       plan: mock.plan || "Free",
//       listening: mock.listening,
//       reading: mock.reading,
//       writing: mock.writing,
//     };

//     res.redirect("/mock-test");
//   } catch (err) {
//     console.error("Mock load error:", err);
//     res.status(500).send("Server Error");
//   }
// });

// router.get("/select-mock/mock", async (req, res) => {
//   try {
//     const mockID = req.query.mockID || req.query;
//     const targetID = typeof mockID === "object" ? mockID.mockID : mockID;

//     let mock = await TestQuestions.findOne({ mockNumber: targetID });
//     if (!mock) {
//       return res.status(404).send("Error getting mock");
//     }

//     req.session.mock = {
//       mockNumber: mock.mockNumber,
//       plan: mock.plan || "Free",
//       listening: mock.listening,
//       reading: mock.reading,
//       writing: mock.writing,
//     };

//     res.redirect("/mock-test");
//   } catch (err) {
//     console.error("Select mock error:", err);
//     res.status(500).send("Server Error");
//   }
// });

// // ==========================================
// // 3. MOCK TEST, ADMIN & PASSCODES
// // ==========================================
// const mock_test = (req, res) => {
//   res.sendFile(path.join(__dirname, "../views/mock.html"));
// };
// router.get("/mock-test", mock_test);

// const authority_login = (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/admin_for_orgs_login.html"));
// };
// router.get("/authority_login", authority_login);

// const passcodes = async (req, res) => {
//   const mockID = req.query.mockID;

//   let mock = await TestQuestions.findOne({ mockNumber: mockID });
//   if (!mock) {
//     return res.status(404).send("Error getting mock");
//   }

//   req.session.mock = {
//     mockNumber: mock.mockNumber,
//     plan: mock.plan || "Free",
//     listening: mock.listening,
//     reading: mock.reading,
//     writing: mock.writing,
//   };

//   res.redirect("/mock-test");
// };
// router.get("/passcodes", passcodes);

// // ==========================================
// // 4. RESULTS PAGES
// // ==========================================
// const view_results = (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/view_results.html"));
// };
// router.get("/view_results", view_results);

// const test_completed = (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/test_completed.html"));
// };
// router.get("/test-completed", test_completed);

// // ==========================================
// // 5. FULL MOCK MODULES (views/test_pages/)
// // ==========================================
// const listening_test = (req, res) => {
//   res.sendFile(path.join(__dirname, "../views/test_pages/listening/listening.html"));
// };
// router.get("/listening-test", listening_test);

// const reading_test = (req, res) => {
//   res.sendFile(path.join(__dirname, "../views/test_pages/reading/reading.html"));
// };
// router.get("/reading-test", reading_test);

// const writing_test = (req, res) => {
//   res.sendFile(path.join(__dirname, "../views/test_pages/writing/writing.html"));
// };
// router.get("/writing-test", writing_test);

// // ==========================================
// // 6. PRACTICE BY QUESTION TYPE (views/practice_pages/)
// // ==========================================
// const listening_practice = async (req, res) => {
//   try {
//     const { pracNumber, type } = req.query;
//     let practiceData = await listeningPractice.findOne({ pracNumber, type });
//     if (!practiceData) {
//       return res.redirect("/practice-hub");
//     }
//     req.session.pracListening = {
//       pracNumber: practiceData.pracNumber,
//       plan: practiceData.plan || "Free",
//       listening: practiceData.listening,
//       type: practiceData.type,
//     };
//     res.sendFile(path.join(__dirname, "../views/practice_pages/listening/listening-prac.html"));
//   } catch (err) {
//     res.redirect("/practice-hub");
//   }
// };
// router.get("/listening-practice", listening_practice);

// const reading_practice = async (req, res) => {
//   try {
//     const { pracNumber, type } = req.query;
//     let practiceData = await readingPractice.findOne({ pracNumber, type });
//     if (!practiceData) {
//       return res.redirect("/practice-hub");
//     }
//     req.session.pracReading = {
//       pracNumber: practiceData.pracNumber,
//       plan: practiceData.plan || "Free",
//       reading: practiceData.reading,
//       type: practiceData.type,
//     };
//     res.sendFile(path.join(__dirname, "../views/practice_pages/reading/reading-prac.html"));
//   } catch (err) {
//     res.redirect("/practice-hub");
//   }
// };
// router.get("/reading-practice", reading_practice);

// const writing_practice = async (req, res) => {
//   try {
//     const { pracNumber, type } = req.query;
//     let practiceData = await writingPractice.findOne({ pracNumber, type });
//     if (!practiceData) {
//       return res.redirect("/practice-hub");
//     }
//     req.session.pracWriting = {
//       pracNumber: practiceData.pracNumber,
//       plan: practiceData.plan || "Free",
//       writing: practiceData.writing,
//       type: practiceData.type,
//     };
//     res.sendFile(path.join(__dirname, "../views/practice_pages/writing/writing-prac.html"));
//   } catch (err) {
//     res.redirect("/practice-hub");
//   }
// };
// router.get("/writing-practice", writing_practice);

// // ==========================================
// // 7. CAMBRIDGE TESTS (views/cambridgetest/)
// // ==========================================
// const cambridge_listening_test = (req, res) => {
//   try {
//     const { book, test } = req.query;
//     if (book) req.session.book = book;
//     if (test) req.session.test = test;
//     res.sendFile(path.join(__dirname, "../views/cambridgetest/listening-practice.html"));
//   } catch (err) {
//     console.error("Cambridge Listening Route Error:", err);
//     res.status(500).send("Error loading listening test");
//   }
// };
// router.get("/cambridge-listening-test", cambridge_listening_test);

// const cambridge_reading_test = async (req, res) => {
//   try {
//     const book = req.query.book || (req.session && req.session.book) || "12";
//     const test = req.query.test || (req.session && req.session.test) || "1";

//     if (req.query.book) req.session.book = req.query.book;
//     if (req.query.test) req.session.test = req.query.test;

//     const db = mongoose.connection.db;
//     const bNum = isNaN(book) ? book : Number(book);
//     const tNum = isNaN(test) ? test : Number(test);

//     let testDoc = await db.collection("cambridge_reading").findOne({
//       $or: [
//         { book: bNum, testNo: tNum },
//         { book: String(book), testNo: String(test) },
//         { book: bNum, test: tNum },
//         { bookNumber: bNum, testNumber: tNum }
//       ]
//     });

//     if (!testDoc) {
//       testDoc = {
//         title: `Cambridge ${book} - Reading Test ${test}`,
//         passages: [],
//         questions: [],
//         instructions: [],
//         answers: {}
//       };
//     } else if (!testDoc.title) {
//       testDoc.title = `Cambridge ${book} - Reading Test ${test}`;
//     }

//     res.render("cambridgetest/cambridge-reading-test", {
//       test: testDoc,
//       book: book,
//       testNo: test
//     });
//   } catch (err) {
//     console.error("Cambridge Reading Route Error:", err);
//     res.status(500).send("Error loading reading test: " + err.message);
//   }
// };
// router.get("/cambridge-reading-test", cambridge_reading_test);

// const cambridge_writing_test = (req, res) => {
//   try {
//     const { book, test } = req.query;
//     if (book) req.session.book = book;
//     if (test) req.session.test = test;
//     res.sendFile(path.join(__dirname, "../views/cambridgetest/cambridge-writing-test.html"));
//   } catch (err) {
//     console.error("Cambridge Writing Route Error:", err);
//     res.status(500).send("Error loading writing test");
//   }
// };
// router.get("/cambridge-writing-test", cambridge_writing_test);

// // ==========================================
// // 8. PRACTICE HUB
// // ==========================================
// const practice_hub = (req, res) => {
//   res.sendFile(path.join(__dirname, "../FrontPage/Frontend/Practice-hub.html"));
// };
// router.get("/practice-hub", practice_hub);

// // ==========================================
// // 9. MODULE EXPORTS
// // ==========================================
// module.exports = {
//   router,
//   authority_login,
//   view_results,
//   passcodes,
//   mock_test,
//   listening_test,
//   reading_test,
//   writing_test,
//   practice_hub,
//   listening_practice,
//   reading_practice,
//   writing_practice,
//   cambridge_listening_test,
//   cambridge_reading_test,
//   cambridge_writing_test,
//   test_completed,
// };

const express = require("express");
const router = express.Router();
const path = require("path");
const mongoose = require("mongoose");
const User = require("../models/User");
const TestQuestions = require("../models/testQuestion");
const adminAuth = require("../middleware/adminAuthMiddleware");

const listeningPractice = require("../models/listeningPractice");
const readingPractice = require("../models/readingPractice");
const writingPractice = require("../models/writingPractice");

// ==========================================
// 1. HOME & MOCK SELECT PAGES
// ==========================================
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/user.html"));
});

router.get("/select-mock", async (req, res) => {
  res.sendFile(path.join(__dirname, "../public/user.html"));
});

// ==========================================
// 2. PASSCODE BYPASS & DIRECT MOCK SETUP
// ==========================================
router.get("/passcode-for-mock/mock", async (req, res) => {
  try {
    const mockID = req.query.mockID || req.query;
    const targetID = typeof mockID === "object" ? mockID.mockID : mockID;

    let mock = await TestQuestions.findOne({ mockNumber: targetID });
    if (!mock) {
      return res.status(404).send("Error getting mock");
    }

    req.session.mock = {
      mockNumber: mock.mockNumber,
      plan: mock.plan || "Free",
      listening: mock.listening,
      reading: mock.reading,
      writing: mock.writing,
    };

    res.redirect("/mock-test");
  } catch (err) {
    console.error("Mock load error:", err);
    res.status(500).send("Server Error");
  }
});

router.get("/select-mock/mock", async (req, res) => {
  try {
    const mockID = req.query.mockID || req.query;
    const targetID = typeof mockID === "object" ? mockID.mockID : mockID;

    let mock = await TestQuestions.findOne({ mockNumber: targetID });
    if (!mock) {
      return res.status(404).send("Error getting mock");
    }

    req.session.mock = {
      mockNumber: mock.mockNumber,
      plan: mock.plan || "Free",
      listening: mock.listening,
      reading: mock.reading,
      writing: mock.writing,
    };

    res.redirect("/mock-test");
  } catch (err) {
    console.error("Select mock error:", err);
    res.status(500).send("Server Error");
  }
});

// ==========================================
// 3. MOCK TEST, ADMIN & PASSCODES
// ==========================================
const mock_test = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/mock.html"));
};
router.get("/mock-test", mock_test);

const authority_login = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin_for_orgs_login.html"));
};
router.get("/authority_login", authority_login);

const passcodes = async (req, res) => {
  const mockID = req.query.mockID;

  let mock = await TestQuestions.findOne({ mockNumber: mockID });
  if (!mock) {
    return res.status(404).send("Error getting mock");
  }

  req.session.mock = {
    mockNumber: mock.mockNumber,
    plan: mock.plan || "Free",
    listening: mock.listening,
    reading: mock.reading,
    writing: mock.writing,
  };

  res.redirect("/mock-test");
};
router.get("/passcodes", passcodes);

// ==========================================
// 4. RESULTS PAGES
// ==========================================
const view_results = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/view_results.html"));
};
router.get("/view_results", view_results);

const test_completed = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/test_completed.html"));
};
router.get("/test-completed", test_completed);

// ==========================================
// 5. FULL MOCK MODULES (views/test_pages/)
// ==========================================
const listening_test = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/test_pages/listening/listening.html"));
};
router.get("/listening-test", listening_test);

const reading_test = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/test_pages/reading/reading.html"));
};
router.get("/reading-test", reading_test);

const writing_test = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/test_pages/writing/writing.html"));
};
router.get("/writing-test", writing_test);

// ==========================================
// 6. PRACTICE BY QUESTION TYPE (views/practice_pages/)
// সেশন দিয়ে আটকানো বন্ধ করা হলো, সরাসরি ফাইল পাঠানো হবে
// ==========================================
const listening_practice = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/practice_pages/listening/listening-prac.html"));
};
router.get("/listening-practice", listening_practice);

const reading_practice = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/practice_pages/reading/reading-prac.html"));
};
router.get("/reading-practice", reading_practice);

const writing_practice = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/practice_pages/writing/writing-prac.html"));
};
router.get("/writing-practice", writing_practice);

// ==========================================
// 7. CAMBRIDGE TESTS (views/cambridgetest/)
// ==========================================
const cambridge_listening_test = (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../views/cambridgetest/listening-practice.html"));
  } catch (err) {
    console.error("Cambridge Listening Route Error:", err);
    res.status(500).send("Error loading listening test");
  }
};
router.get("/cambridge-listening-test", cambridge_listening_test);

const cambridge_reading_test = async (req, res) => {
  try {
    const book = req.query.book || "12";
    const test = req.query.test || "1";

    const db = mongoose.connection.db;
    const bNum = isNaN(book) ? book : Number(book);
    const tNum = isNaN(test) ? test : Number(test);

    let testDoc = await db.collection("cambridge_reading").findOne({
      $or: [
        { book: bNum, testNo: tNum },
        { book: String(book), testNo: String(test) },
        { book: bNum, test: tNum },
        { bookNumber: bNum, testNumber: tNum }
      ]
    });

    if (!testDoc) {
      testDoc = {
        title: `Cambridge ${book} - Reading Test ${test}`,
        passages: [],
        questions: [],
        instructions: [],
        answers: {}
      };
    } else if (!testDoc.title) {
      testDoc.title = `Cambridge ${book} - Reading Test ${test}`;
    }

    res.render("cambridgetest/cambridge-reading-test", {
      test: testDoc,
      book: book,
      testNo: test
    });
  } catch (err) {
    console.error("Cambridge Reading Route Error:", err);
    res.status(500).send("Error loading reading test: " + err.message);
  }
};
router.get("/cambridge-reading-test", cambridge_reading_test);

const cambridge_writing_test = (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../views/cambridgetest/cambridge-writing-test.html"));
  } catch (err) {
    console.error("Cambridge Writing Route Error:", err);
    res.status(500).send("Error loading writing test");
  }
};
router.get("/cambridge-writing-test", cambridge_writing_test);

// ==========================================
// 8. PRACTICE HUB
// ==========================================
const practice_hub = (req, res) => {
  res.sendFile(path.join(__dirname, "../FrontPage/Frontend/Practice-hub.html"));
};
router.get("/practice-hub", practice_hub);

// ==========================================
// 9. MODULE EXPORTS
// ==========================================
module.exports = {
  router,
  authority_login,
  view_results,
  passcodes,
  mock_test,
  listening_test,
  reading_test,
  writing_test,
  practice_hub,
  listening_practice,
  reading_practice,
  writing_practice,
  cambridge_listening_test,
  cambridge_reading_test,
  cambridge_writing_test,
  test_completed,
};