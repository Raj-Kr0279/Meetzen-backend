const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploads = multer({ dest: "uploads/" });
const { supabase } = require("../config/supabase.js");

exports.addUser = async (req, res) => {
    try {
        const { companyId, bio, userImage, name, phone, role, email, password, timezone, language } = req.body;
        const existedUser = await User.findOne({ email: email })
        if (existedUser) { return res.status(400).json({ success: false, message: "User already exists" }) }
        const salt = await bcrypt.genSalt(4)
        const hashed = await bcrypt.hash(password, salt);
        const user = new User({
            name, phone, role, email, companyId, bio, userImage, language, timezone, password: hashed
        });
        const newUser = await user.save()
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY })
        res.status(201).json({
            success: true,
            user: newUser,
            token
        })
    }
    catch (error) {
        console.error(error);

        // Mongoose Validation Error
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        // Duplicate Key Error
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "User already exists."
            });
        }

        // Invalid ObjectId
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid ID."
            });
        }

        // Unknown Error
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            phone,
            bio,
            language,
            timezone,
        } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.bio = bio || user.bio;
        user.language = language || user.language;
        user.timezone = timezone || user.timezone;

        // Update profile image
        if (req.file) {

            // delete old image
            // if (user.userImage) {
            //     const oldPath = path.join(__dirname, "..", user.userImage);

            //     if (fs.existsSync(oldPath)) {
            //         fs.unlinkSync(oldPath);
            //     }
            // }

            // user.userImage = req.file.path.replace(/\\/g, "/");
            const fileName = `users/${Date.now()}-${req.file.originalname}`;

            const { error } = await supabase.storage
                .from("profile-images")
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: true,
                });

            if (error) throw error;

            const { data } = supabase.storage
                .from("profile-images")
                .getPublicUrl(fileName);

            user.userImage = data.publicUrl;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};