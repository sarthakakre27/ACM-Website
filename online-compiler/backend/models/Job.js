const mongoose = require("mongoose");

const JobSchema = mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ["cpp", "py","c","js","java"],
  },
  filepath: {
    type: String,
    required: true,
  },
  input: {
    type: String
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "success", "error"],
  },
  output: {
    type: String,
  },
  probID: {
    type: mongoose.Types.ObjectId,
  }
});

// default export
module.exports = mongoose.model("job", JobSchema);
