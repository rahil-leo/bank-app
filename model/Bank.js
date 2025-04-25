const mongoose = require('mongoose')
// const jwt = require('jsonwebtoken')

const bcrypt = require('bcryptjs')


const bankschema = new mongoose.Schema({
    username: String,
    password: String,
    id: String,
})


bankschema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

bankschema.methods.validatepassword = async function (userpassword) {
    return await bcrypt.compare(userpassword, this.password)
}


module.exports = mongoose.model('Bank', bankschema)