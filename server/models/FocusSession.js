const m = require("mongoose");

module.exports = m.model(
  "FocusSession",
  new m.Schema(
    {
      userId: { type: m.Schema.Types.ObjectId, required: true, index: true },
      minutes: { type: Number, required: true, min: 1, max: 180 },
      completedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
  )
);
