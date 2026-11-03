// insert_writing_exercises_route.js
// Inserts writing-exercises API route and page route after the listening-exercises route

const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let content = fs.readFileSync(appPath, 'utf8');

const target = `  app.get(["/listening-exercises", "/listening-exercises.html"], (req, res) => {\r\n    res.sendFile(path.join(__dirname, "public", "listening-exercises.html"));\r\n  });\r\n\r\n  // ==========================================\r\n  // CAMBRIDGE AUDIO STREAM PROXY & HUB`;

const insertion = `  app.get(["/listening-exercises", "/listening-exercises.html"], (req, res) => {
    res.sendFile(path.join(__dirname, "public", "listening-exercises.html"));
  });

  // ==========================================
  // WRITING EXERCISES BY QUESTION TYPE
  // ==========================================
  app.get("/api/writing-exercises", async (req, res) => {
    try {
      const db = req.app.locals.db;
      const type = req.query.type || "Bar-Chart";

      const typeMap = {
        "Line-Graph":               "Line Graph",
        "Bar-Chart":                "Bar Chart",
        "Pie-Chart":                "Pie Chart",
        "Table":                    "Table",
        "Process-Diagram":          "Process Diagram",
        "Map":                      "Map Comparison",
        "Mixed-Charts":             "Mixed Charts",
        "Opinion-Essay":            "Opinion Essay",
        "Discussion-Essay":         "Discussion Essay",
        "Problem-Solution":         "Problem & Solution",
        "Advantages-Disadvantages": "Advantages & Disadvantages",
        "Two-Part-Question":        "Two-Part Question",
        "Positive-Negative":        "Positive or Negative"
      };

      const decoded = decodeURIComponent(type).replace(/[-_\\s]+/g, "").toLowerCase();
      const matchedKey = Object.keys(typeMap).find(k =>
        k.replace(/[-_\\s]+/g, "").toLowerCase() === decoded
      ) || type;

      const docs = await db.collection("writing-practices")
        .find({ type: matchedKey, pracNumber: /^Set-\\d+$/ })
        .sort({ pracNumber: 1 })
        .toArray();

      const categoryCounts = {};
      for (const key of Object.keys(typeMap)) {
        const cnt = await db.collection("writing-practices")
          .countDocuments({ type: key, pracNumber: /^Set-\\d+$/ });
        if (cnt > 0) categoryCounts[key] = cnt;
      }

      const exercises = docs.map((doc, idx) => {
        const setNum = parseInt((doc.pracNumber || "Set-1").replace("Set-", "")) || idx + 1;
        const q = doc.writing && doc.writing.questions && doc.writing.questions[0];
        const part = q ? q.part : 1;
        const source = doc.source || \`Set \${setNum}\`;
        const image = q && q.image && q.image.length > 0 ? q.image[0] : null;
        return {
          setNumber: setNum,
          pracNumber: doc.pracNumber,
          type: matchedKey,
          typeName: typeMap[matchedKey] || matchedKey,
          part,
          task: part === 1 ? "Task 1" : "Task 2",
          source,
          image,
          title: \`\${typeMap[matchedKey] || matchedKey} – \${source}\`,
          link: \`/writing-practice?pracNumber=\${encodeURIComponent(doc.pracNumber)}&type=\${encodeURIComponent(matchedKey)}\`
        };
      });

      res.json({
        success: true,
        type: matchedKey,
        typeName: typeMap[matchedKey] || matchedKey,
        totalExercises: exercises.length,
        exercises,
        categoryCounts
      });
    } catch (err) {
      console.error("Error fetching writing exercises:", err);
      res.status(500).json({ error: "Failed to fetch writing exercises" });
    }
  });

  app.get(["/writing-exercises", "/writing-exercises.html"], (req, res) => {
    res.sendFile(path.join(__dirname, "public", "writing-exercises.html"));
  });

  // ==========================================
  // CAMBRIDGE AUDIO STREAM PROXY & HUB`;

// Use a marker that's unique in the file
const marker = '  // ==========================================\r\n  // CAMBRIDGE AUDIO STREAM PROXY & HUB';
if (!content.includes(marker)) {
  console.error('Marker not found!');
  process.exit(1);
}

// Replace just the marker section - keep the existing listening route, insert writing routes before CAMBRIDGE AUDIO
const newContent = content.replace(
  '  // ==========================================\r\n  // CAMBRIDGE AUDIO STREAM PROXY & HUB',
  `  // ==========================================\n  // WRITING EXERCISES BY QUESTION TYPE\n  // ==========================================\n  app.get("/api/writing-exercises", async (req, res) => {\n    try {\n      const db = req.app.locals.db;\n      const type = req.query.type || "Bar-Chart";\n      const typeMap = {\n        "Line-Graph": "Line Graph", "Bar-Chart": "Bar Chart", "Pie-Chart": "Pie Chart",\n        "Table": "Table", "Process-Diagram": "Process Diagram", "Map": "Map Comparison",\n        "Mixed-Charts": "Mixed Charts", "Opinion-Essay": "Opinion Essay",\n        "Discussion-Essay": "Discussion Essay", "Problem-Solution": "Problem & Solution",\n        "Advantages-Disadvantages": "Advantages & Disadvantages",\n        "Two-Part-Question": "Two-Part Question", "Positive-Negative": "Positive or Negative"\n      };\n      const decoded = decodeURIComponent(type).replace(/[-_\\s]+/g, "").toLowerCase();\n      const matchedKey = Object.keys(typeMap).find(k => k.replace(/[-_\\s]+/g, "").toLowerCase() === decoded) || type;\n      const docs = await db.collection("writing-practices")\n        .find({ type: matchedKey, pracNumber: /^Set-\\d+$/ })\n        .sort({ pracNumber: 1 }).toArray();\n      const categoryCounts = {};\n      for (const key of Object.keys(typeMap)) {\n        const cnt = await db.collection("writing-practices").countDocuments({ type: key, pracNumber: /^Set-\\d+$/ });\n        if (cnt > 0) categoryCounts[key] = cnt;\n      }\n      const exercises = docs.map((doc, idx) => {\n        const setNum = parseInt((doc.pracNumber || "Set-1").replace("Set-", "")) || idx + 1;\n        const q = doc.writing && doc.writing.questions && doc.writing.questions[0];\n        const part = q ? q.part : 1;\n        const source = doc.source || \`Set \${setNum}\`;\n        const image = q && q.image && q.image.length > 0 ? q.image[0] : null;\n        return { setNumber: setNum, pracNumber: doc.pracNumber, type: matchedKey,\n          typeName: typeMap[matchedKey] || matchedKey, part,\n          task: part === 1 ? "Task 1" : "Task 2", source, image,\n          title: \`\${typeMap[matchedKey] || matchedKey} – \${source}\`,\n          link: \`/writing-practice?pracNumber=\${encodeURIComponent(doc.pracNumber)}&type=\${encodeURIComponent(matchedKey)}\`\n        };\n      });\n      res.json({ success: true, type: matchedKey, typeName: typeMap[matchedKey] || matchedKey,\n        totalExercises: exercises.length, exercises, categoryCounts });\n    } catch (err) {\n      console.error("Error fetching writing exercises:", err);\n      res.status(500).json({ error: "Failed to fetch writing exercises" });\n    }\n  });\n\n  app.get(["/writing-exercises", "/writing-exercises.html"], (req, res) => {\n    res.sendFile(path.join(__dirname, "public", "writing-exercises.html"));\n  });\n\n  // ==========================================\n  // CAMBRIDGE AUDIO STREAM PROXY & HUB`
);

if (newContent === content) {
  console.error('No replacement made!');
  process.exit(1);
}

fs.writeFileSync(appPath, newContent, 'utf8');
console.log('✅ Writing exercises route added to app.js');
