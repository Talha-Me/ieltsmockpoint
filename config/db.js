require("dotenv").config();

const mongoose = require("mongoose");

const mongoURI =
  process.env.MONGO_URI ||
  "mongodb+srv://abutalhaakash26_db_user:9SLvZMWGpJKA3DlL@cluster0.ud2umzq.mongodb.net/ielts-agent?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI)
  .then((conn) => {
    console.log(`✅ Database Connected Successfully to: ${conn.connection.name}`);
  })
  .catch((err) => {
    console.error("❌ Database Connection Error:", err.message);
  });

module.exports = mongoose;