const mongoose = require('mongoose')

const upischema = new mongoose.Schema({
    id: String,
    upi: String,
    accountnumber:String
})

module.exports = mongoose.model('Upi', upischema)



