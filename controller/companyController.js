const Company = require("../models/Company");

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();

    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
}
exports.addCompany = async (req, res) => {
  try {
    const { name, id, address, logo } = req.body
    const company = new Company({
      name, id, address, logo
    })
    const newCompany = await company.save()
    res.status(201).json(newCompany)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
exports.findWithId = async (req, res) => {
  try {
    const { companyId } = req.body;
    const filteredCompany = await Company.findOne({companyId})
    if (!filteredCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(filteredCompany);
  }
  catch (error) {
   res.status(400).json({ error: error.message });
  }
}