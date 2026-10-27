const m = require("mongoose");

module.exports = m.model(
  "StudySession",
  new m.Schema(
    {
      userId: { type: m.Schema.Types.ObjectId, required: true, index: true },
      title: { type: String, required: true, trim: true, maxlength: 120 },
      subject: { type: String, required: true, trim: true, maxlength: 100 },
      date: { type: Date, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      completed: { type: Boolean, default: false }
    },
    { timestamps: true }
  )
);
