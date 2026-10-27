const r = require("express").Router();
const auth = require("../middleware/auth");
const Note = require("../models/Note");

r.use(auth);

r.get("/", async (q, s) => {
  try {
    s.json(await Note.find({ userId: q.user.id }).sort({ updatedAt: -1 }));
  } catch (e) {
    console.error(e);
    s.status(500).json({ message: "Could not load notes." });
  }
});

r.post("/", async (q, s) => {
  try {
    const { subject, title, content = "" } = q.body;
    if (!String(subject || "").trim() || !String(title || "").trim()) {
      return s.status(400).json({ message: "Subject and title are required." });
    }
    s.status(201).json(await Note.create({ userId: q.user.id, subject, title, content }));
  } catch (e) {
    console.error(e);
    s.status(500).json({ message: "Could not save note." });
  }
});

r.patch("/:id", async (q, s) => {
  try {
    const u = {};
    for (const k of ["subject", "title", "content", "revised"]) {
      if (q.body[k] !== undefined) u[k] = q.body[k];
    }
    if (typeof u.revised === "boolean") u.revisedAt = u.revised ? new Date() : null;
    const n = await Note.findOneAndUpdate(
      { _id: q.params.id, userId: q.user.id },
      u,
      { new: true, runValidators: true }
    );
    if (!n) return s.status(404).json({ message: "Note not found." });
    s.json(n);
  } catch (e) {
    console.error(e);
    s.status(500).json({ message: "Could not update note." });
  }
});

r.delete("/:id", async (q, s) => {
  try {
    const n = await Note.findOneAndDelete({ _id: q.params.id, userId: q.user.id });
    if (!n) return s.status(404).json({ message: "Note not found." });
    s.json({ message: "Note deleted." });
  } catch (e) {
    console.error(e);
    s.status(500).json({ message: "Could not delete note." });
  }
});

module.exports = r;
