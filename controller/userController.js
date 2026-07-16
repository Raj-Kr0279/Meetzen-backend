const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

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
exports.login = async (req, res) => {
    const { email, password, companyId } = req.body;
    try {
        const isUserExists = await User.findOne({ email: email })
        if (isUserExists) {
            if (isUserExists.companyId === companyId) {
                const isMatch = await bcrypt.compare(password, isUserExists.password)
                console.log(isMatch, "ismatching");
                if (isMatch) {
                    return res.status(200).json(isUserExists)
                }
                return res.status(401).json({ message: "password incorrect" })
            }
            return res.status(401).json({ message: "please select correct company" })
        }
        return res.status(401).json({ message: "User not registered. contact your organisation" })





    }
    catch (error) {
        res.status(500).json({ error: error })
    }
}