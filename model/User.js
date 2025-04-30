const mongoose = require('mongoose')
// const jwt = require('jsonwebtoken')

const bcrypt = require('bcryptjs')


const userschema = new mongoose.Schema({
    username: String,
    password: String,
    id: String,
    firstname: {
        type: String,
        default: ""
    },
    lastname: {
        type: String,
        default: ""
    },
    dob: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        default: ""
    },
    accounttype: {
        type: String,
        default: ""
    },
    adharcard: {
        type: String,
        default: ""
    },
    photo: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    pincode: {
        type: String,
        default: ""
    },
    bloodgroup: {
        type: String,
        default: ""
    },
    pin: {
        type: String,
        default:""
    },
    formsubmit: {
        type: Boolean,
        default: false,
    },
    approved: {
        type: Boolean,
        default: false,
    },
    accountnumber: {
        type: String,
        default: ""
    },
    balance: {
        type: String,
        default:0
    },
     upi: {
        type: String,
        default: ""
    }
    
})


userschema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userschema.methods.validatepassword = async function (userpassword) {
    return await bcrypt.compare(userpassword, this.password)
}


module.exports = mongoose.model('User', userschema)
