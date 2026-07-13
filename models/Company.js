const mongoose = require("mongoose");
const companySchema = new mongoose.Schema({
    companyId: { type: String, unique: true },
    name: { type: String },
    email: { type: String },
    logo: { type: String, default: "" },
    address: { type: String }
})
module.exports = mongoose.model('Company', companySchema);