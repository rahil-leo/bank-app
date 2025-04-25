const express = require('express')
const router = express.Router()

const { getlogin,login } = require('../controllers/login')
const { isLoggedin } = require('../middleware/check')

router
    .route('/')
    .get(isLoggedin,getlogin)
    .post(login)

module.exports = router