const { getCompanies, addCompany, findWithId } = require("../controller/companyController");
const Company = require("../models/Company");
const express = require("express");
const router = express.Router()

router.get('/get-companies', getCompanies);
router.post('/add-company', addCompany)
router.post('/findWithId', findWithId)
module.exports = router;