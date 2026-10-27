const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

router.use(auth);

router.get("/", async (req, res) => {
  try {
    res.json(await Task.find({ userId: req.user.id }).sort({ dueDate: 1, createdAt: -1 }));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not load tasks." });
  }
});

router.post("/", async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    const subject = String(req.body.subject || "").trim();
    const dueDate = req.body.dueDate;
    const priority = ["Low", "Medium", "High"].includes(req.body.priority)
      ? req.body.priority
      : "Medium";
    if (!title || !subject || !dueDate) {
      return res.status(400).json({ message: "Title, subject, and due date are required." });
    }
    const d = new Date(`${dueDate}T12:00:00`);
    if (Number.isNaN(d.getTime())) {
      return res.status(400).json({ message: "Enter a valid due date." });
    }
    res.status(201).json(await Task.create({ userId: req.user.id, title, subject, dueDate: d, priority }));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not save task." });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const update = {};
    for (const k of ["title", "subject", "dueDate", "priority", "completed"]) {
      if (req.body[k] !== undefined) update[k] = req.body[k];
    }
    if (typeof update.completed === "boolean") {
      update.completedAt = update.completed ? new Date() : null;
    }
    const t = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      update,
      { new: true, runValidators: true }
    );
    if (!t) return res.status(404).json({ message: "Task not found." });
    res.json(t);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not update task." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const t = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!t) return res.status(404).json({ message: "Task not found." });
    res.json({ message: "Task deleted." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not delete task." });
  }
});

module.exports = router;
