// let Application = require('../model/User')
let User = require('../model/User')

exports.getbank = async (req, res) => {
    id = req.params.id
    let allaccount = await User.findOne({ id: id })
    // let alldetails = await Application.find()
    return res.render('bank/bank', { oneaccount: allaccount ,accounts:[] })
}

exports.getbankdetails = async (req, res) => {
    id = req.params.id
    let allaccount = await User.findOne({ id: id })
    // console.log(allaccount)
    return res.render('bank/bankdetails', { oneaccount: allaccount , accounts:[] })
}

exports.getselectaccount = async (req, res) => {
    let allaccounts = await User.find({ formsubmit:true, approved:false })
    // console.log(allaccounts)
    return res.render('bank/selectaccount', { accounts: allaccounts })
}

exports.approval = async (req, res) => {
    try {
        let paramid = req.params.id
        console.log(paramid)
        // console.log(paramid,'here is the param id')
        let approveuser = await User.findOne({ id: paramid })
        console.log(approveuser)
        if (approveuser) {
            approveuser.approved = true
            approveuser.accountnumber = '2830' + Date.now()
            await approveuser.save()
        }
        return res.redirect('/bank')
    } catch (err) {
        console.log(err)
        return res.send('error in this code')
    }
}

exports.getapproved = async (req, res) => {
    let approveduser = await User.find({ approved:true })
    // console.log(approveduser)
    return res.render('bank/approved',{approveduser , accounts:[]})
}





exports.getdeposite = async (req, res) => {
    return res.render('bank/deposite')
}

exports.depositemoney = async(req, res) => {
    try {
        const { accountnumber, amount } = req.body
        // console.log(accountnumber, amount)

        let user = await User.findOne({ accountnumber: accountnumber })

        if (!user) {
            return res.send('Account not found')
        }
        user.balance = parseInt(user.balance) + parseInt(amount)
        await user.save()
        alert("username", user.username,'deposit success full')
        return res.redirect('/bank')
    } catch (err) {
        console.log(err)
        return res.send('error in this code')
    }
}

exports.getwidrow = async (req, res) => {
    return res.render('bank/widrow')
}

exports.widrowmoney = async (req, res) => {
    try {
        const { accountnumber, amount } = req.body
        // console.log(accountnumber, amount)
        let user = await User.findOne({ accountnumber: accountnumber })

        if (!user) {
            return res.send('Account not found')
        }

        user.balance = parseInt(user.balance) - parseInt(amount)
        await user.save()
        return res.redirect('/bank')
    } catch (err) {
        console.log(err)
        return res.send('error in this code')
    }

}




