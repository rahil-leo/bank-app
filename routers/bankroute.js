const express = require('express')
const router = express.Router()

const { getbank, getbankdetails, getselectaccount, approval, getapproved, getdeposite, depositemoney, getwidrow, widrowmoney, decline, showAllDeclinedAccounts } = require('../controllers/bank')
const{getbanklogin, banklogin}= require('../controllers/bankauth')
const {isLoggedin}=require('../middleware/admincheck')

router
    .route('/')
    .get(getbankdetails)
router
    .route('/banklogin')
    .get(isLoggedin,getbanklogin)    
    .post(isLoggedin,banklogin)
router
    .route('/bank/:id')
    .get(getbank)
router
    .route('/selectaccount/:id')
    .get(getselectaccount)
router
    .route('/approval/:id')
    .get(approval)
router
    .route('/approved')
    .get(getapproved)
router
    .route('/deposite')
    .get(getdeposite)
    .post(depositemoney)
router
    .route('/widrow')
    .get(getwidrow)
    .post(widrowmoney)


    
module.exports = router