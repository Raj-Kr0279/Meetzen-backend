const express = require("express");
const { getMeetings } = require("../controller/meetingController");
const router = express.Router()

router.get('/meeting-list', getMeetings);
module.exports = router