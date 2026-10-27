const r = require("express").Router();
const auth = require("../middleware/auth");
const Focus = require("../models/FocusSession");
const Study = require("../models/StudySession");

r.use(auth);

r.get("/focus", async (q, s) => {
  try {
    const sessions = await Focus.find({ userId: q.user.id }).sort({ completedAt: -1 }).limit(100);
    s.json({ sessions, totalMinutes: sessions.reduce((a, x) => a + x.minutes, 0) });
  } catch (e) {
    console.error(e);
    s.status(500).json({ message: "Could not load focus sessions." });
  }
});

r.post("/focus", async (q, s) => {
  try {
    const minutes = Number(q.body.minutes);
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
      return s.status(400).json({ message: "Minutes must be between 1 and 180." });
    }
    s.status(201).json(await Focus.create({ userId: q.user.id, minutes }));
  } catch (e) {
    console.error(e);
    s.status(500).json({ message: "Could not save focus session." });
  }
});

r.get("/timetable", async (q, s) => {
  try {
    s.json(await Study.find({ userId: q.user.id }).sort({ date: 1, startTime: 1 }));
  } catch (e) {
    console.error(e);
    s.status(500).json({ message: "Could not load timetable." });
  }
});

r.post("/timetable", async (q, s) => {
  try {
    const { title, subject, date, startTime, endTime } = q.body;
    if (![title, subject, date, startTime, endTime].every((x) => String(x || "").trim())) {
      return s.status(400).json({ message: "Fill in all timetable fields." });
    }
    if (endTime <= startTime) {
      return s.status(400).json({ message: "End time must be after start time." });
    }
    s.status(201).json(
      await Study.create({
        userId: q.user.id,
        title,
        subject,
        date: new Date(`${date}T12:00:00`),
        startTime,
        endTime
      })
    );
  } catch (e) {
    console.error(e);
    s.status(500).json({ message: "Could not save study session." });
  }
});

r.patch("/timetable/:id", async (q, s) => {
  try {
    const x = await Study.findOneAndUpdate(
      { _id: q.params.id, userId: q.user.id },
      { completed: !!q.body.completed },
      { new: true }
    );
    if (!x) return s.status(404).json({ message: "Session not found." });
    s.json(x);
  } catch (e) {
    console.error(e);
    s.status(500).json({ message: "Could not update session." });
  }
});

r.delete("/timetable/:id", async (q, s) => {
  try {
    const x = await Study.findOneAndDelete({ _id: q.params.id, userId: q.user.id });
    if (!x) return s.status(404).json({ message: "Session not found." });
    s.json({ message: "Session deleted." });
  } catch (e) {
    console.error(e);
    s.status(500).json({ message: "Could not delete session." });
  }
});

module.exports = r;
