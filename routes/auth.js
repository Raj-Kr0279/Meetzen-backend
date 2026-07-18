const express = require("express");
const router = express.Router();

const authController = require("../controller/authController");
const auth = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/getMe", auth, authController.getMe);

module.exports = router;
