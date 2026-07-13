const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  meetingType: String,
  committeeName: String,
  meetingNo: Number,
  committeeCode: String,
  status: {
    type: String,
    enum: ["recent", "upcoming", "completed", "cancelled"],
    default: "upcoming",
  },
  startAt: Date,
  endAt: Date,
  membersAccepted: Number,
  membersTotal: Number,
  location: {
    label: String,
    mapQuery: String,
  },
  description: String,
}, { timestamps: true });

module.exports = mongoose.model("Meeting", meetingSchema);