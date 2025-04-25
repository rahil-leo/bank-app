const express = require('express')
const router = express.Router()

const { getbank, getbankdetails, getselectaccount, approval, getapproved } = require('../controllers/bank')

const { validatethisUser } = require('../middleware/check')

router
    .route('/')
    .get(getbankdetails)
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


    
module.exports = router