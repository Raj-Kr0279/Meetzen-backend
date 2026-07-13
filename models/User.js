const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    companyId: {type: String, required: true},
    role: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    bio: { type: String, required: false },
    password:{type:String, required:true},
    userImage: {
        type: String,
        default: "/images/profile/john-doe.jpg"
    }
})
module.exports = mongoose.model('user', userSchema);