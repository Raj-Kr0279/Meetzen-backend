const mongoose = require("mongoose");
const Meeting = require("../models/Meeting");

exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find();

    res.json(meetings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};