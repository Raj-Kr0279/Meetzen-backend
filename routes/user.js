const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// /api/user ke under only authenticated user actions rakhne chahiye.
router.put("/update-profile/:id", auth, upload.single("userImage"), userController.updateUser);

module.exports = router;
