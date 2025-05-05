const express = require('express')
const router = express.Router()

const { getsignup, signup, application, fillapplication, logout, pending, home, sendmoney, getupi, createupi, postSendMoney, getpeoples, getinsufficient  } = require('../controllers/user')
const { validatethisUser } =require('../middleware/check')

router
    .route('/')
    .get(validatethisUser,home)
router
    .route('/application')
    .get(validatethisUser, application)
    .post(validatethisUser,fillapplication)
router 
    .route('/signup')
    .get(getsignup)
    .post(signup)
router
    .route('/pending')
    .get(validatethisUser,pending)
router
    .route('/sendmoney/:id')
    .get(validatethisUser, sendmoney)
    .post(validatethisUser,postSendMoney)
router
    .route('/upi')
    .get(validatethisUser,getupi)
    .post(validatethisUser, createupi)
router
    .route('/people')
    .get(validatethisUser, getpeoples)
router
    .route('/insufficient')
    .get(getinsufficient)
router
    .route('/logout')
    .get(validatethisUser, logout)  

module.exports = router