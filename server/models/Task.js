const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Task",
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
      },
      title: { type: String, required: true, trim: true, maxlength: 160 },
      subject: { type: String, required: true, trim: true, maxlength: 100 },
      dueDate: { type: Date, required: true },
      priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
      completed: { type: Boolean, default: false },
      completedAt: { type: Date, default: null }
    },
    { timestamps: true }
  )
);
