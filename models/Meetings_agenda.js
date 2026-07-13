const mongoose = require("mongoose");

const meetingAgendaSchema = new mongoose.Schema({
  meetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meeting",
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MeetingAgenda",
    default: null,
  },
  agendaNo: {
    type: String,
    required: true,
  },
  referenceNo: String,
  title: {
    type: String,
    required: true,
  },
  agendaType: {
    type: String,
    enum: ["Information", "Discussion", "Approval", "Decision"],
    default: "Information",
  },
  order: Number,
  isFavourite: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model("MeetingAgenda", meetingAgendaSchema);