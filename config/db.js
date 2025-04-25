const mongoose = require('mongoose')

exports.connectDB = async () => {
    await mongoose.connect(process.env.DB)
    console.log('connect db')
}