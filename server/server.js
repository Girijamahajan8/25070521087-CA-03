require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "client")));

app.get("/api/health", (_q, r) => r.json({ ok: true, app: "StudySphere" }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/sessions", require("./routes/sessions"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (_q, r) => r.sendFile(path.join(__dirname, "..", "client", "index.html")));

(async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/studysphere",
      { serverSelectionTimeoutMS: 7000 }
    );
    console.log("MongoDB connected successfully.");
    app.listen(PORT, () => console.log(`StudySphere is running at http://localhost:${PORT}`));
  } catch (e) {
    console.error("MongoDB connection failed:", e.message);
    console.error("Start MongoDB and check MONGODB_URI in .env.");
    process.exit(1);
  }
})();
