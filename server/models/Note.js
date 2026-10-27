const m = require("mongoose");

module.exports = m.model(
  "Note",
  new m.Schema(
    {
      userId: { type: m.Schema.Types.ObjectId, required: true, index: true },
      subject: { type: String, required: true, trim: true, maxlength: 100 },
      title: { type: String, required: true, trim: true, maxlength: 160 },
      content: { type: String, default: "", maxlength: 12000 },
      revised: { type: Boolean, default: false },
      revisedAt: { type: Date, default: null }
    },
    { timestamps: true }
  )
);
