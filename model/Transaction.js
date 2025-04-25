const mongoose = require('mongoose')

const transactionschema = new mongoose.Schema({
    id: String,
    senderAccount: String,
    senderUpi: String,
    recieverAccount: String,
    recieverUpi: String,
    amount:String
})

module.exports = mongoose.model('Transaction', transactionschema)