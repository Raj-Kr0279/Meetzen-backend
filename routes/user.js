const { addUser, login } = require('../controller/userController')
const User = require('../models/User')
const express = require("express")
const router = express.Router()

router.post('/add-user', addUser)
router.post('/login', login) 
module.exports = router