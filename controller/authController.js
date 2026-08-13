const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { companyId, bio, userImage, name, phone, role, email, password, timezone, language } = req.body;

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(4);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      phone,
      role,
      email,
      companyId,
      bio,
      userImage,
      language,
      timezone,
      password: hashed,
    });

    const newUser = await user.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });
    const { password:_, ...userData } = newUser.toObject();
    return res.status(201).json({
      success: true,
      user: userData,
      token,
    });
  } catch (error) {
    console.error(error);

    // Mongoose Validation Error
    if (error?.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }

    // Duplicate Key Error
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: "User already exists." });
    }

    // Invalid ObjectId
    if (error?.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid ID." });
    }

    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password, companyId } = req.body;

  try {
    const isUserExists = await User.findOne({ email }).select("+password");

    if (!isUserExists) {
      return res.status(401).json({ message: "User not registered. contact your organisation" });
    }

    if (isUserExists.companyId !== companyId) {
      return res.status(401).json({ message: "please select correct company" });
    }

    const isMatch = await bcrypt.compare(password, isUserExists.password);
    if (!isMatch) {
      return res.status(401).json({ message: "password incorrect" });
    }

    // Token issue (important for auth flows)
    const token = jwt.sign({ id: isUserExists._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });
    const { password:_, ...userData } = isUserExists.toObject();
    return res.status(200).json({
      success: true,
      user: userData,
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: error?.message || error });
  }
};

// PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(4);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

