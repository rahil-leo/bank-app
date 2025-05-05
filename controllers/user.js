
const User = require('../model/User')
const QRcode = require('qrcode')
const dayjs = require('dayjs')
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
    // console.log(username)
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
        user.pin = req.body.pin
        user.formsubmit = true;
        await user.save();

        res.redirect('/pending');
    } catch (err) {
        console.error("Error:", err);
        res.send(" wrong");
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
    const url = req.protocol + '://' + req.get('host') + '/sendmoney/' + userdetails.id
    // console.log(url)
    if (!userdetails.upi) {
        return res.render('user/homewithoutqr',{userdetails})
    }
    
    QRcode.toDataURL(url, function (err, image) {
        if (err) {
            return res.send('error')
        }
        var a  = image
        return res.render('user/home', { userdetails,a })
    })
   
}
exports.getupi = async (req, res) => {
    let username = req.user.username
    const user = await User.findOne({ username: username })
    return res.render('user/upi', { user})
}

exports.createupi = async (req, res) => {
    try {
        let upi = req.body.upi
        let bank = req.body.bank
        // console.log(bank, upi)
        let username = req.user.username
        const user = await User.findOne({ username: username })
        if (user.upi) {
            return res.send("User already has a UPI")
        }
        const finder = await Upi.findOne({ upi: upi + bank })
        if (finder) {
            return res.send("UPI already exists")
        }
        const newupi = `${upi}@${bank}`
        await Upi.create({
            id: Date.now(),
            upi: newupi,
            accountnumber: user.accountnumber
        })
        user.upi = newupi
        await user.save()

        return res.redirect('/')
    } catch (e) {
        console.log(e)
        return res.send('error')
    }
}



exports.sendmoney = async (req, res) => {
    const username = req.user.username
    let userdetails = await User.findOne({ username: username })
    // console.log(userdetails)
    let id = req.params.id
    // console.log(id,'id')
    const reciever = await User.findOne({ id: id });
    // console.log(reciever)
    let transactions = [];
    if (reciever) {
        transactions = await Transaction.find({
            $or: [
                { senderUpi: userdetails.upi, recieverUpi: reciever.upi },
                { senderUpi: reciever.upi, recieverUpi: userdetails.upi }
            ]
        });
    }
    return res.render('user/sendmoney', { userdetails, id, transactions,reciever })
}

exports.postSendMoney = async (req, res) => {
    try {
        const { amount } = req.body
        const reciverparams = req.params.id
        // console.log(reciverparams, 'here is the param id')
        const reciever = await User.findOne({ id: reciverparams })
        // console.log(reciever,'here is the reciever')
        // console.log(reciever.upi, 'here is the upi')
        if (!reciever.upi) {
            return res.send(`<div style='display: flex;justify-content: center;align-items: center;height: 100vh;width: 100%; '>
                                <div>
                                    <h1>this account do not have a upi to send money</h1>
                                    <a href="/people"><button style ='padding:8px 15px;background-color:red;color:white;'>bank</button></a>
                                </div>
                          </div>`)
        }
        if (!reciever) {
            return res.send('incorrect')
        }
        let username = req.user.username
        const sender = await User.findOne({ username: username })
        // console.log(sender, 'here is the sender')
        if (parseInt(sender.balance) < parseInt(amount)) {
            return res.redirect('/insufficient')
        }
        sender.balance = parseInt(sender.balance) - parseInt(amount)
        await sender.save()
        reciever.balance = parseInt(reciever.balance) + parseInt(amount)
        console.log(reciever.balance)
        await reciever.save()
        await Transaction.create({
            id: Date.now(),
            senderAccount: sender.accountnumber,
            senderUpi: sender.upi,
            recieverAccount: reciever.accountnumber,
            recieverUpi: reciever.upi,
            amount: amount,
            day: dayjs().format(' HH:mm:ss')
        })
        let userdetails = await User.findOne({ username: username })

        let transactions = await Transaction.find({
            $or: [
                { senderUpi: sender.upi, recieverUpi: reciever.upi },
                { senderUpi: reciever.upi, recieverUpi: sender.upi }
            ]
        })
        // console.log(transactions, 'here is the transctions')
        return res.render("user/sendmoney",{userdetails,id:reciverparams,transactions})
    } catch (e) {
        console.log(e)
        return res.send('error')
   }
};

exports.getpeoples = async (req, res) => {
    try {
        const currentUsername = req.user.username;
        const users = await User.find({ username: { $ne: currentUsername }, upi: { $ne: "" } })
        // console.log(users,'here is the users')
        // console.log(users)
        res.render('user/people', { users, currentUsername });
    } catch (err) {
        console.error(err);
        res.send('Error');
    }
};
exports.getinsufficient = (req,res) => {
    return res.render('user/insufficient')
}

exports.logout = (req, res) => {
    return res.clearCookie('cookie').redirect('/login')
}


