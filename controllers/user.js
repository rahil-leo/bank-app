
const User = require('../model/User')
const Upi = require('../model/Upi')
const Transaction = require('../model/Transaction')
const Bank = require('../model/Bank')

const cloudinary = require('cloudinary').v2

exports.getsignup = (req, res) => {
    res.render('user/signup', { msg: '' })
}

exports.signup = async (req, res) => {
    try {
        let username = req.body.username
        let password = req.body.password
        console.log(username, password)

        let userdetails = {
            username: username,
            password: password,
            id: Date.now()
        }
        let sameuser = await User.findOne({ username: req.body.username })
        if (sameuser) {
            return res.render('user/signup', { msg: 'this user already exist' })
        }
        await User.create(userdetails)

    } catch (e) {
        console.log(e)
    }

    res.redirect('/login')
}

exports.application = async (req, res) => {
    const username = req.user.username
    console.log(username)

    const user = await User.findOne({ username });

    if (!user) {
        return res.redirect('/login');
    }
    if (user.formsubmit) {
        return res.render('user/pending')
    }

    res.render('user/application', { msg: '' });
};



exports.fillapplication = async (req, res) => {
    try {
        const username = req.user.username;
        // console.log("Username:", username);

        const file = req.files?.photo;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath);

        let user = await User.findOne({ username });
        // console.log(user)
        if (!user) {
            return res.status(404).send("User not found");
        }
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.dob = req.body.date;
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.gender = req.body.gender;
        user.accounttype = req.body.accounttype;
        user.adharcard = req.body.adharcard;
        user.photo = uploadResult.secure_url;
        user.address = req.body.address;
        user.pincode = req.body.pincode;
        user.bloodgroup = req.body.bloodgroup;
        user.formsubmit = true;
        await user.save();

        res.redirect('/pending');
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Something went wrong");
    }
};


exports.pending = (req, res) => {
    return res.render('user/pending')
}

exports.home = async (req, res) => {
    const username = req.user.username
    let userdetails = await User.findOne({ username: username })
    // console.log(userdetails)
    if (userdetails.formsubmit && !userdetails.approved) {
        return res.redirect('/pending')
    }
    if (!userdetails.formsubmit) {
        return res.redirect('/application')
    }
    return res.render('user/home', { userdetails })
}
exports.getupi = async (req, res) => {
    let username = req.user.username
    const user = await User.findOne({ username: username })
    return res.render('user/upi',{user})
}

exports.createupi = async (req, res) => {
    let upi = req.body.upi
    let bank = req.body.bank
    console.log(bank, upi)
    let username = req.user.username
    const user = await User.findOne({ username: username })
    const finder = await Upi.findOne({ upi: upi })
    if (finder) {
        return res.send('already exists ')
    }
    await Upi.create({
        id: Date.now(),
        upi: upi + bank,
        accountnumber: user.accountnumber
    })
    user.upi = upi + Bank
    await user.save()
    
    return res.redirect('/')
}


exports.sendmoney = async (req, res) => {
    const username = req.user.username
    let userdetails = await User.findOne({ username: username })
    // console.log(userdetails)
    return res.render('user/sendmoney', { userdetails })
}

exports.postSendMoney = async (req, res) => {
    const { upi, amount } = req.body
    const reciever = await User.findOne({ upi: upi })
    console.log(reciever)

    return res.send("Transaction successful");
};





exports.logout = (req, res) => {
    return res.clearCookie('cookie').redirect('/login')
}


